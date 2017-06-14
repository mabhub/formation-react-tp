import osmtogeojson from 'osmtogeojson';

class GeoJSONHelper {

    getGeoJSONFromOverpass(dataFromOverpass) {
        var osmGeojson = osmtogeojson(new DOMParser().parseFromString(dataFromOverpass, 'text/xml'));
        // osmtogeojson writes polygon coordinates in anticlockwise order, not fitting the geojson specs.
        // Polygon coordinates need therefore to be reversed
        // osmGeojson.features.forEach(function(feature, index) {
        //     if (feature.geometry.type === 'Polygon') {
        //         var n = feature.geometry.coordinates.length;
        //         feature.geometry.coordinates[0].reverse();
        //         if (n > 1) {
        //             for (var i = 1; i < n; i++) {
        //                 var reversedCoordinates = feature.geometry.coordinates[i].slice().reverse();
        //                 osmGeojson.features[index].geometry.coordinates[i] = reversedCoordinates;
        //             }
        //         }
        //     }
        //     if (feature.geometry.type === 'MultiPolygon') {
        //         // Split it in simple polygons
        //         feature.geometry.coordinates.forEach(function(coords) {
        //             var n = coords.length;
        //             coords[0].reverse();
        //             if (n > 1) {
        //                 for (var i = 1; i < n; i++) {
        //                     coords[i] = coords[i].slice().reverse();
        //                 }
        //             }
        //             osmGeojson.features.push({
        //                 'type': 'Feature',
        //                 'properties': osmGeojson.features[index].properties,
        //                 'geometry': {
        //                     'type': 'Polygon',
        //                     'coordinates': coords
        //                 }
        //             });
        //         });
        //     }
        // });
        return osmGeojson;
    }
}

export default new GeoJSONHelper();
