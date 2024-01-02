import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useAuth } from '~/contexts/AuthContext';
import { useDevicesInfo } from '~/hooks';
import useBusPosition from '~/hooks/useBusPosition';
import { getDevicesInfo } from '~/services/request';
import './Map.css';
function Map() {
  const { devicesInfo } = useDevicesInfo();
  const { position } = useBusPosition({ devicesInfo });
  // console.log('position: ', position);
  const center =
    position.length > 0
      ? {
          lat: position[0].lat,
          lng: position[0].lng,
        }
      : { lat: 37.76596, lng: -122.45636 };
  const redOptions = { color: 'red' };
  const circleCenter = { lat: 37.76596, lng: -122.45636 };
  return (
    <MapContainer id="map" center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position.map((pos, index) => {
        console.log('Number of positions: ', position.length);
        return (
          <Marker position={{ lat: pos.lat, lng: pos.lng }} key={index}>
            <Popup>{index}</Popup>
          </Marker>
        );
      })}
      <Circle center={circleCenter} pathOptions={redOptions} radius={1000} />
    </MapContainer>
  );
}

export default Map;
