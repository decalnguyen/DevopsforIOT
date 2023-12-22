import { useEffect, useState } from 'react';
import { useAuth } from '~/contexts/AuthContext';

const useTemeletry = ({ deviceInfo }) => {
  const { token } = useAuth();
  const [telemetry, setTelemetry] = useState({});
  useEffect(() => {
    const webSocket = new WebSocket('wss://thingsboard.cloud/api/ws/plugins/telemetry?token=' + token);

    webSocket.onopen = () => {
      console.log('connection is established');
      const object = {
        tsSubCmds: deviceInfo && [
          {
            entityType: deviceInfo.id.entityType,
            entityId: deviceInfo.id.id,
            scope: 'LATEST_TELEMETRY',
            cmdId: 1,
          },
        ],
        historyCmds: [],
        attrSubCmds: [],
      };

      const data = JSON.stringify(object);
      webSocket.send(data);
    };

    webSocket.onmessage = (event) => {
      const received_msg = event.data;
      console.log('received message: ' + received_msg);
      const parsedResponse = JSON.parse(received_msg);
      const data = parsedResponse.data;
      console.log(data);

      if (Object.keys(data).length === 0) {
        return;
      }

      const firstKey = Object.keys(data)[0];
      console.log('first key: ' + firstKey);
      if (Object.values(data)[0][0][0] === 0) {
        setTelemetry((values) => values.filter((value) => value.key !== firstKey));
        return;
      }

      setTelemetry(
        Object.entries(data).map(([key, value], index) => {
          return {
            key,
            value: value[0][1],
            lastUpdateTs: value[0][0],
          };
        }),
      );
    };

    webSocket.onclose = () => {
      console.log('Connection is closed!');
    };

    // Clean up WebSocket on component unmount
    return () => {
      webSocket.close();
    };
  }, [token, deviceInfo]);
  return [telemetry, setTelemetry];
};

export default useTemeletry;
