# USGS: Earthquake Visualization
### Initial Set-Up
This visualization will require a MapBox API key. Once you have that from https://www.mapbox.com/, create a config.js file in the earthquakes/js directory with your API key assigned to a constant called 'API_KEY'. This will allow the rest of the visualization to be pulled in successfully.
### Resources
The earthquake data comes from the United States Geological Survey JSON database (https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). I selected their API endpoint that contains all earthquakes in the last week at any magnitude, though there are several other options. The tectonic plates comes from https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json which is part of a larger GitHub repository on tectonic plates (https://github.com/fraxen/tectonicplates). 
### Visualization
The data sources are compiled in earthquakes/js/logic.js using a Promise object and each earthquake and tectonic plate is mapped using Leaflet. A control panel in the top right corner allows the user to toggle between light and dark mode for the underlying map via radio buttons, while checkboxes below allow toggling of the earthquake and tectonic plate layers. Additionally, the legend in the bottom right explains the color coding for the earthquake circles by depth of the earthquake.
### Additional Notes
Within the toggling functionality, if the tectonic plates layer is turned on after the earthquakes layer, many of the earthquakes become impossible to click on because they are technically underneath the tectonic plate layer. To fix this, simply toggle the earthquake layer off and on again. This will set it as the top layer and allow interaction with the earthquake circles.
