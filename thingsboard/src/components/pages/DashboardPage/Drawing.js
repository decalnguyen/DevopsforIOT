import { useEffect } from 'react';
import { Circle, Polygon, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';

function Drawing({ geoJSON, setGeoJSON, onRemove }) {
  const map = useMap();
  map.on('pm:create', (e) => {
    e.layer.on('pm:edit', (x) => {
      console.log('edit', x);
    });
  });

  useEffect(() => {
    const handleEdit = (e, index) => {
      const layer = e.layer;
      let coordinates;

      if (layer instanceof L.Rectangle) {
        const bounds = layer.getBounds();
        coordinates = {
          type: 'rectangle',
          topLeft: bounds.getNorthWest(),
          bottomRight: bounds.getSouthEast(),
        };
      } else if (layer instanceof L.Circle) {
        const latlng = layer.getLatLng();
        coordinates = {
          type: 'circle',
          center: latlng,
          radius: layer.getRadius(),
        };
      } else if (layer instanceof L.Polygon) {
        coordinates = {
          type: 'polygon',
          latlngs: layer.getLatLngs(),
        };
      }
      console.log('Drawn Shape:', coordinates);
      const newGeoJSON = geoJSON.map((value, _index) => (_index === index ? coordinates : value));
      // localStorage.setItem('geoJSON', JSON.stringify(newGeoJSON));
      setGeoJSON(newGeoJSON);
    };

    if (geoJSON && geoJSON.length > 0) {
      const _layers = geoJSON.map((feature, index) => {
        if (!feature) return null;
        let layer, _layer;
        switch (feature.type) {
          case 'polygon':
            _layer = <Polygon positions={feature.latlngs} key={index} />;
            layer = L.polygon(feature.latlngs).addTo(map);
            break;
          case 'rectangle':
            _layer = <Rectangle bounds={[feature.topLeft, feature.bottomRight]} key={index} />;
            layer = L.rectangle(L.latLngBounds(feature.topLeft, feature.bottomRight)).addTo(map);
            break;
          case 'circle':
            _layer = <Circle center={feature.center} radius={feature.radius} key={index} />;
            layer = L.circle(feature.center, feature.radius).addTo(map);
            break;

          default:
            return null;
        }
        if (layer) {
          layer.on('pm:edit', (e) => handleEdit(e, index));
          layer.on('pm:remove', (e) => onRemove(e));
        }
        return _layer;
      });
    }
    return () => {
      map.eachLayer((layer) => {
        if (!layer._url && !(layer instanceof L.Marker)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [geoJSON, map, onRemove, setGeoJSON]);
}

export default Drawing;
