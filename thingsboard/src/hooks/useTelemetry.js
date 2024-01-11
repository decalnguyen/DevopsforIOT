import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '~/contexts/AuthContext';

const useTelemetry = ({ deviceInfo }) => {
  const token = localStorage.getItem('accessToken');
  const [telemetry, setTelemetry] = useState([]);
  const telemetryRef = useRef(telemetry);

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

      const keys = Object.keys(data);

      if (keys?.length === 0) {
        return;
      }

      const firstKey = keys[0];
      console.log('first key: ' + firstKey);
      if (Object.values(data)[0][0][0] === 0) {
        setTelemetry((values) => values.filter((value) => !keys.includes(value.key)));
        return;
      }

      if (keys?.length === 1) {
        const index = telemetryRef.current.map((value) => value.key).findIndex((key) => key === firstKey);
        const firstObject = data[firstKey];
        const addedObject = {
          key: firstKey,
          value: firstObject[0][1],
          lastUpdateTs: firstObject[0][0],
        };

        if (index !== -1) {
          console.log('This key has already been added');
          setTelemetry((prev) => prev.map((item, i) => (i === index ? addedObject : item)));
        } else {
          setTelemetry((prev) => prev.concat(addedObject));
        }
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

    console.log('telemetry: ', telemetry);

    webSocket.onclose = () => {
      console.log('Connection is closed!');
    };

    // Clean up WebSocket on component unmount
    return () => {
      webSocket.close();
    };
  }, [token, deviceInfo]);

  // Update the telemetryRef when telemetry changes
  useEffect(() => {
    telemetryRef.current = telemetry;
  }, [telemetry]);

  return [telemetry, setTelemetry];
};

export default useTelemetry;
