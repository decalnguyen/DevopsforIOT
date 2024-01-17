import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { formatTimestamp, isWithinTimeWindow } from '~/utils/time';
const brokerAddress = 'wss://sf7b1e57.ala.us-east-1.emqxsl.com/mqtt';
const topicToSubscribe = 'coord';

function useGeofenceNotification() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(brokerAddress, {
      clientId: 'mqttx_88e45305',
      username: 'nhquan22@clc.fitus.edu.vn',
      password: '123456',
      port: 8084,
      protocol: 'wss',
    });

    if (client) {
      client.on('connect', () => {
        console.log('Connected to EMQ X Cloud');
        client.subscribe(topicToSubscribe, (err) => {
          if (!err) {
            console.log(`Subscribed to ${topicToSubscribe}`);
          } else {
            console.error('Subscription error:', err);
          }
        });
      });
      client.on('error', (error) => {
        console.error('Error:', error);
      });

      client.on('message', (topic, receivedMessage) => {
        console.log(`Received message on topic ${topic}: ${receivedMessage.toString()}`);
        const parsedMessage = JSON.parse(receivedMessage);
        if (isWithinTimeWindow(parsedMessage.ts)) {
          setMessage(parsedMessage);
        }
      });
    }

    return () => {
      if (client) {
        client.end(() => {
          console.log('Disconnected gracefully');
        });
      }
    };
  }, []);

  return { message };
}

export default useGeofenceNotification;
