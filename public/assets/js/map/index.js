var accessToken =
    "pk.eyJ1IjoiZmhtYWxiYSIsImEiOiJja3BlMnBha2QwNDFmMm9yaXoybTNqN3o4In0.mJvOMMlzRvQIlgXtG5L_7A";

var map = L.map("map").setView([-5.426, 105.2696], 11);

L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
    {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
    }
).addTo(map);

var json_url = "http://localhost:8000/v1/api/map";
$(function () {
    $.getJSON(json_url, (res) => {
        const geojson = {
            type: "FeatureCollection",
            features: [],
        };
        console.log(res);
        res.forEach((item) => {
            if (item.latitude !== null && item.longitude !== null) {
                geojson.features.push({
                    type: "Feature",
                    properties: {
                        address: item.address,
                        latlang: [parseFloat(item.latitude)+0.015, parseFloat(item.longitude)],
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [item.longitude, item.latitude],
                    },
                });
            }
        });
        console.log("GeoJSON is success");
        L.geoJSON(geojson,{
            onEachFeature: function (feature, layer) {
                layer.on("click", function () {
                    map.flyTo(feature.properties.latlang, 13);
                });

                layer.bindPopup(feature.properties.address);
            },
        }).addTo(map);
    });
});
