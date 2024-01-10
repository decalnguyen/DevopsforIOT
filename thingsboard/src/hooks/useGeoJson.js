import { useCallback, useEffect, useState } from 'react';
import { getLocalStorageItems } from '~/utils';
import L from 'leaflet';
import { Circle,  Polygon, Rectangle, useMap } from 'react-leaflet';
import TelemetryRequest from '../services/requests/telemetryRequest';


const {getAttributesByScope, postAttributes} = TelemetryRequest();
function useGeoJSON({devicesInfo}) {
  
  const [geoJSON, setGeoJSON] = useState({});

  useEffect(() => {
    if(!devicesInfo || devicesInfo.length === 0) return;
    const fetchData = async () => {
        const device = devicesInfo[0];console.log(device);
        const obj = {entityType: device.id.entityType, entityId: device.id.id, scope:'SERVER_SCOPE', keys: 'perimeter'};
        console.log(obj);
        const data = await getAttributesByScope(obj);
        console.log(data);
        setGeoJSON(data[0]?.value);
        console.log(data[0]?.value);
    }
    fetchData();
  }, [devicesInfo])

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
      setGeoJSON(newGeoJSON);
    },
    [geoJSON],
  );

  const handleEditShape = (e) => {
    console.log('aaa');
  };

  const handleSave = useCallback(async (deviceInfo) => {
    localStorage.setItem('geoJSON', JSON.stringify(geoJSON));
    
    const {id} = deviceInfo;
    console.log(geoJSON);
    const response = await postAttributes({entityType: id.entityType, entityId: id.id, scope: 'SERVER_SCOPE', telemetry: {perimeter:geoJSON}});
    console.log(response);
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

