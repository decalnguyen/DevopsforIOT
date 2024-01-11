import { useEffect } from 'react';
import { Circle, FeatureGroup, Polygon, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';

function Drawing({ geoJSON, setGeoJSON, onRemove,ref }) {

  const map = useMap();
  map.on('pm:create', (e) => {
    e.layer.on('pm:edit', (x) => {
      console.log('edit', x);
    });
  });

  useEffect(() => {
    const handleEdit = (e, index) => {
      const layer = e.layer;
      let coordinates = null;

      if (layer instanceof L.Rectangle) {
        const bounds = layer.getBounds();
        coordinates = {
          // type: 'rectangle',
          // topLeft: bounds.getNorthWest(),
          // bottomRight: bounds.getSouthEast(),
        };
      } else if (layer instanceof L.Circle) {
        const latlng = layer.getLatLng();
        coordinates = {
          // type: 'circle',
          // center: latlng,
          // radius: layer.getRadius(),
          latitude: latlng[0],
          longitude: latlng[1],
          radius: layer.getRadius(),
          ...geoJSON
        };
      } else if (layer instanceof L.Polygon) {
        // coordinates = {
        //   type: 'polygon',
        //   latlngs: layer.getLatLngs(),
        // };
        coordinates = layer.getLatLngs();
      }
      console.log('Drawn Shape:', coordinates);
      // const newGeoJSON = geoJSON.map((value, _index) => (_index === index ? coordinates : value));
      return coordinates;
    };

    // if (geoJSON && geoJSON?.length > 0) {
    //   const _layers = geoJSON.map((feature, index) => {
    //     if (!feature) return null;
    //     let layer, _layer;
        // switch (feature.type) {
        //   case 'polygon':
        //     _layer = <Polygon positions={feature.latlngs} key={index} />;
        //     layer = L.polygon(feature.latlngs).addTo(map);
        //     break;
        //   case 'circle':
        //     _layer = <Circle center={feature.center} radius={feature.radius} key={index} />;
        //     layer = L.circle(feature.center, feature.radius).addTo(map);
        //     break;

        //   default:
        //     return null;
        // }
        let layer,_layer;
        if(geoJSON) {
          if(geoJSON.radius) {
          const {latitude, longitude, radius} = geoJSON; 
          _layer = <Circle center={[latitude,longitude]} radius={radius} key={0} />;
            layer = L.circle([latitude,longitude], radius);
            ref?.current?.addLayer(_layer);
        } else {

        }}

        if (layer) {
          layer.on('pm:edit', (e) => {
            console.log('edit');
            const coord = handleEdit(e, 0)
            if(coord) setGeoJSON(coord);
          });
          layer.on('pm:remove', (e) => onRemove(e));
        }
        // return _layer;
    //   });
    // }
    return () => {
      map.eachLayer((layer) => {
        if (!layer._url && !(layer instanceof L.Marker)) {
          map.removeLayer(layer);
        }
      });
    };

    return (<FeatureGroup>

    </FeatureGroup>)
  }, [geoJSON, map, onRemove, setGeoJSON,ref]);
}

export default Drawing;
