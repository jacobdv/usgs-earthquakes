const myMap = L.map("map", {
    center: [0, 0],
    zoom: 1
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
    return (magnitude * 100000)
}

function eqColor(depth) {
    return ('blue')
}

// Magnitude 4.5+ over the last month.
const m45 = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';

d3.json(m45).then(data => {
    const quakes = data.features;
    for (let i = 0; i < quakes.length; i++) {
        // Setting fill color.

        let latlng = [quakes[i].geometry.coordinates[1], quakes[i].geometry.coordinates[0]]
        console.log(latlng)
        L.circle(latlng, {
            fillOpacity: 0.75,
            color: 'white',
            weight: 0.5,
            fillColor: eqColor(quakes[i].geometry.coordinates[2]),
            radius: markerSize(quakes[i].properties.mag)
        }).bindPopup(quakes[i].properties.title).addTo(myMap); 
    }
          
  
});