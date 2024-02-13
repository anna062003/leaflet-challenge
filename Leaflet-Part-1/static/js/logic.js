const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {

            let depth = feature.geometry.coordinates[2];
            let color = "";
            if (depth <= 10) {
                color = "#69B34C";
            }  else if (depth <= 30) {
                color = "#ACB334";
            } else if (depth <= 50) {
                color = "#FAB733";
            } else if (depth <= 70) {
                color = "#FF8E15";
            } else if (depth <= 90) {
                color = "#FF4E11";
            } else {
                color = "#FF0D0D";
            }

           
            let radius = feature.properties.mag * 10000;


            return L.circle(latlng, {
                radius: radius,
                fillColor: color,
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    });

    
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Define a baseMaps object to hold our base layers
    let baseMaps = {
        "Street Map": street,
    };

    // Create overlay object to hold our overlay layer
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    let myMap = L.map("map", {
        center: [
            39.833, -98.583
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend"),
            depths = [-10, 10, 30, 50, 70, 90],
            colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"],
            labels = [];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
            '<i style="background:' + colors[i] + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
            (depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : "+"));
    }

        return div;
    };

    legend.addTo(myMap);
}


