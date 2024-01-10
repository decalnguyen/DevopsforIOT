export default function Transform(value) {
    switch(typeof value) {
        case 'boolean':
            return value ? 'true' : 'false';
        case 'object':
            return JSON.stringify(value);
        default:
            return value;
    }

}

export function convertToGeoJSON(value) {
    const newgeo = {
        type: 'FeatureCollection',
        features: []
    }
    console.log(value);
    if(value?.radius) { // This is a circle
        newgeo.features.push({
            type: 'Feature',
            properties: {radius: value.radius},
            geometry: {
                type: 'Point',
                coordinates: [value.longitude,value.latitude]
            }
        })
    }
    else {newgeo.features.push({
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: value
            }
        })}
        return newgeo;
    
}

export function convertToTBJSON(value) {
    console.log(value);
    if(!Array.isArray(value.features) || value.features.length === 0) return null;
    if(value.features[0].properties?.radius) { //This is a circle
        const feature = value.features[0];
        return {
            latitude: feature.geometry.coordinates[1],
            longitude: feature.geometry.coordinates[0],
            radius: feature.properties.radius,
            radiusUnit: 'METER'
        }
    }

    return value.geometry.coordinates; 
}

// 