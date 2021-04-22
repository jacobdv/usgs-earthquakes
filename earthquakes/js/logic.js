// Setting up light and dark map layers.
// Light
const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});
// Dark
const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});

// Setting up earthquake and tectonic plate layers. Creating the map.
// Layers
const layers = {
    Earthquakes: new L.LayerGroup(),
    Tectonic_Plates: new L.LayerGroup()
};
// Map
const myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [
        layers.Earthquakes,
        layers.Tectonic_Plates
    ]
});

// Adding to the map with overlays and layers.
darkmap.addTo(myMap);
const maps = {
    'Light': lightmap,
    'Dark': darkmap
};
const overlays = {
    'Earthquakes': layers.Earthquakes,
    'Tectonic Plates': layers.Tectonic_Plates
};

// Adding control functionality to map.
L.control.layers(maps, overlays).addTo(myMap);
const info = L.control({
    position: 'topright'
});
info.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    return div;
};
info.addTo(myMap);

// Functions to calculate circle radius and the color for circles and the legend.
// Circle radius.
function markerSize(magnitude) {
    return (magnitude * magnitude * 20000)
}
// Circle color.
function eqColor(depth) {
    switch (true) {
        case depth > 100 : return ('maroon');
        case depth > 88.5 : return ('firebrick');
        case depth > 75 : return ('indianred');
        case depth > 62.5 : return ('burlywood');
        case depth > 50 : return ('khaki');
        case depth > 37.5 : return ('palegreen');
        case depth > 25 : return ('springgreen');
        case depth > 12.5 : return ('mediumseagreen');
        case depth > 0 : return ('seagreen');
        // Default would indicate an above ground earthquake.
        default : return ('white');
    }
};
// Legend colors.
function getLegendColor(d) {
    switch (d) {
        case d = 100 : return ('maroon');
        case d = 87.5 : return ('firebrick');
        case d = 75 : return ('indianred');
        case d = 62.5 : return ('burlywood');
        case d = 50 : return ('khaki');
        case d = 37.5 : return ('palegreen');
        case d = 25 : return ('springgreen');
        case d = 12.5 : return ('mediumseagreen');
        case d = 0 : return ('seagreen');
        // White would be an error and should be impossible to reach.
        default : return ('white');
    }
} 

// Creating the legend.
// Based on https://leafletjs.com/examples/choropleth/ legend creation.
// Positioning.
const legend = L.control({
    position: 'bottomright'
});
// Adding with colors and text.
legend.onAdd = function (map) {
    let legendDiv = L.DomUtil.create('div','info legend'),
    numbers = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
    legendDiv.innerHTML +=
            '<h3> Legend </h3>';
    for (let i = 0; i < numbers.length; i++) {
        legendDiv.innerHTML +=
            '<i style = "background:' + getLegendColor(numbers[i]) + '"></i>' +
            numbers[i] + (numbers[i + 1] ? '&ndash;' + numbers[i + 1] + '<br>' : '+');
    }
    return legendDiv;
};
legend.addTo(myMap);

// Data.
// Using data from all earthquakes in the last week.
const m45 = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// Tectonic plate data.
const tectonic = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json'

// Drawing the circles and adding them to the earthquake layer of the map.
Promise.all([d3.json(m45), d3.json(tectonic)]).then(([data, tectonic]) => {
    // Tectonic plate visualizations.
    const tectonicPlates = tectonic.features;
    // Adding polygon for each plate.
    for (let i = 0; i < tectonicPlates.length; i++) {
        const coords = tectonicPlates[i].geometry.coordinates[0];
        // Reformats coordinate pair ordering into new array.
        const plate = [];
        coords.forEach(latlng => {
            let lat = latlng[1];
            let lng = latlng[0];
            let formattedCoords = [lat, lng];
            plate.push(formattedCoords)
        })
        // Creates new plates.
        const newPlate = L.polygon(plate, {
            color: 'gold',
            fillOpacity: 0,
            weight: 1
        });
        // Adding to tectonic plate layer and giving plate name in a pop up.
        newPlate.addTo(layers.Tectonic_Plates);
        newPlate.bindPopup(tectonicPlates[i].properties.PlateName);
    }

    // Earthquake data visualizations.
    // Beginning parsing through the data.
    const quakes = data.features;
    // For each earthquake the coordinates and magnitude are used to create unique circles.
    for (let i = 0; i < quakes.length; i++) {
        const newCircle = L.circle([quakes[i].geometry.coordinates[1], quakes[i].geometry.coordinates[0]], {
            fillOpacity: 1,
            color: 'white',
            weight: 0.5,
            fillColor: eqColor(quakes[i].geometry.coordinates[2]),
            radius: markerSize(quakes[i].properties.mag)
        });
        // Adding to earthquake layer and giving further information in a popup bound to the circle.
        newCircle.addTo(layers.Earthquakes);
        newCircle.bindPopup(quakes[i].properties.title + '<br>' + `Depth: ${quakes[i].geometry.coordinates[2]}`); 
    }
});