import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '~/contexts/AuthContext';

const useBusPosition = ({ devicesInfo }) => {
  // const [position, setPosition] = useState([]);
  const token = localStorage.getItem('accessToken');
  const [position, setPosition] = useState([]);

  const onPositionUpdate = useCallback(({ subscriptionId, latitude, longitude }) => {
    setPosition((prev) => {
      const copy = [...prev];
      const hasPositionExisted = copy.some((current) => current.index === subscriptionId);

      if (hasPositionExisted) {
        const indexToUpdate = copy.findIndex((current) => current.index === subscriptionId);
        copy[indexToUpdate] = { index: subscriptionId, lat: latitude, lng: longitude };
      } else {
        copy.push({ index: subscriptionId, lat: latitude, lng: longitude });
      }

      return copy;
    });
  }, []);
  useEffect(() => {
    const webSocket = new WebSocket('wss://thingsboard.cloud/api/ws/plugins/telemetry?token=' + token);
    webSocket.onopen = () => {
      const object = {
        tsSubCmds:
          devicesInfo &&
          devicesInfo?.length > 0 &&
          devicesInfo.map((device, index) => ({
            entityType: device.id.entityType,
            entityId: device.id.id,
            scope: 'LATEST_TELEMETRY',
            cmdId: index,
          })),
        historyCmds: [],
        attrSubCmds: [],
      };

      const data = JSON.stringify(object);
      webSocket.send(data);
    };

    webSocket.onmessage = (event) => {
      const received_msg = event.data;
      const parsedResponse = JSON.parse(received_msg);

      if (parsedResponse.data && parsedResponse.data.latitude) {
        onPositionUpdate({
          subscriptionId: parsedResponse.subscriptionId,
          latitude: parsedResponse.data.latitude[0][1],
          longitude: parsedResponse.data.longitude[0][1],
        });
      } else {
        console.log('This is not a bus');
      }
    };

    webSocket.onclose = () => {
      console.log('Connection is closed!');
    };

    // Clean up WebSocket on component unmount
    return () => {
      webSocket.close();
    };
  }, [token, devicesInfo, onPositionUpdate]);

  return { position };
};

export default useBusPosition;
