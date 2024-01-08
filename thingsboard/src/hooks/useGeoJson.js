import { useCallback, useEffect, useState } from 'react';
import { getLocalStorageItems } from '~/utils';
import L, { DivOverlay, Events, Layer } from 'leaflet';
import { Circle, FeatureGroup, LayerGroup, Polygon, Rectangle, useMap } from 'react-leaflet';
import { createLeafComponent } from '@react-leaflet/core';
import TelemetryRequest from '~/services/requests/telemetryRequest';
function useGeoJSON() {
  const { getTimeseriesData } = TelemetryRequest();
  const [geoJSON, setGeoJSON] = useState(() => {
    // const data = await getTimeseriesData({ entityType: 'DEVICE', entityId: '7dc6b560-a862-11ee-b767-61ae9d239871' });
    // console.log(data);
    const { geoJSON } = getLocalStorageItems();
    console.log(geoJSON);
    return geoJSON ? JSON.parse(geoJSON) : [];
  });

  const addGeoJSON = (_geoJSON) => {
    const newGeoJSON = [...geoJSON, _geoJSON];
    localStorage.setItem('geoJSON', JSON.stringify(newGeoJSON));
    setGeoJSON(newGeoJSON);
  };

  const removeGeoJSON = (index) => {
    const newGeoJSON = [...geoJSON];
    newGeoJSON.splice(index, 1);
    setGeoJSON(newGeoJSON);
  };

  const modifyGeoJSON = (index, _geoJSON) => {
    if (geoJSON.length > 0) {
      const newGeoJSON = geoJSON.map((data, _index) => {
        return index === _index ? _geoJSON : data;
      });
      localStorage.setItem('geoJSON', JSON.stringify(newGeoJSON));
      setGeoJSON(newGeoJSON);
    }
  };

  const handleShapeCreated = useCallback(
    (e) => {
      const layer = e?.layer;
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
      const newGeoJSON = [...geoJSON, coordinates];
      // localStorage.setItem('geoJSON', JSON.stringify(newGeoJSON));
      setGeoJSON(newGeoJSON);
    },
    [geoJSON],
  );

  const handleEditShape = (e) => {
    console.log('aaa');
  };

  const handleSave = useCallback(() => {
    localStorage.setItem('geoJSON', JSON.stringify(geoJSON));
  }, [geoJSON]);

  const render = useCallback(() => {
    if (geoJSON && geoJSON.length > 0) {
      return geoJSON.map((data, index) => {
        switch (data.type) {
          case 'rectangle':
            return <Rectangle bounds={[data.topLeft, data.bottomRight]} key={index} />;
          case 'polygon':
            return <Polygon positions={data.latlngs} key={index} />;
          case 'circle':
            return <Circle center={data.center} radius={data.radius} />;
          default:
            return null;
        }
      });
    }
    return null;
  }, [geoJSON]);

  return {
    geoJSON,
    setGeoJSON,
    addGeoJSON,
    removeGeoJSON,
    modifyGeoJSON,
    handleShapeCreated,
    render,
    handleEditShape,
    handleSave,
  };
}

export default useGeoJSON;

export function Drawing({ geoJSON, setGeoJSON, onRemove }) {
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
        // console.log(feature);
        switch (feature.type) {
          case 'polygon':
            _layer = <Polygon positions={feature.latlngs} key={index} />;
            layer = L.polygon(feature.latlngs).addTo(map);
            // L.polygon(L.latLng(feature.topLeft, feature.bottomRight)).addTo(map);
            break;
          case 'rectangle':
            _layer = <Rectangle bounds={[feature.topLeft, feature.bottomRight]} key={index} />;
            // L.rectangle(L.latLng(feature.topLeft, feature.bottomRight)).addTo(map);
            layer = L.rectangle(L.latLngBounds(feature.topLeft, feature.bottomRight)).addTo(map);
            break;
          case 'circle':
            _layer = <Circle center={feature.center} radius={feature.radius} key={index} />;
            // L.circle(feature.center, { radius: feature.radius }).addTo(map);
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
