const myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
});
  
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
}).addTo(myMap);
  
function markerSize(magnitude) {
    return (magnitude * magnitude * 20000)
}

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

// All earthquakes in the last week.
const m45 = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(m45).then(data => {
    const quakes = data.features;
    const maxa = [];
    for (let i = 0; i < quakes.length; i++) {
        let latlng = [quakes[i].geometry.coordinates[1], quakes[i].geometry.coordinates[0]]
        console.log(latlng)
        L.circle(latlng, {
            fillOpacity: 1,
            color: 'white',
            weight: 0.5,
            fillColor: eqColor(quakes[i].geometry.coordinates[2]),
            radius: markerSize(quakes[i].properties.mag)
        }).bindPopup(quakes[i].properties.title + '<br>' + `Depth: ${quakes[i].geometry.coordinates[2]}`).addTo(myMap); 
    }
  
});