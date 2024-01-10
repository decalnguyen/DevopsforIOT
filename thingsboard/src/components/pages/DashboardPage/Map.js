import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  LayersControl,
  LayerGroup,
  Circle,
  useMap,
} from 'react-leaflet';
import styles from './Map.module.scss';
import classNames from 'classnames/bind';
import Search from './SearchBox';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GeomanControls } from 'react-leaflet-geoman-v2';
import  Drawing  from './Drawing';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import GeomanWrapper from './GeomanWrapper';
const cx = classNames.bind(styles);


function Map({ geofence, position, devicesInfo, isEditMode }) {
  const ref = useRef(null);
  // const map = useMap();
  const center =
    position.length > 0
      ? {
          lat: position[0].lat,
          lng: position[0].lng,
        }
      : { lat: 37.76596, lng: -122.45636 };
  const { handleShapeCreated, geoJSON, setGeoJSON, removeGeoJSON } = geofence;
  
  return (
    <div>
      <div className={cx('map-wrapper')}>
        <MapContainer id="map" center={center} zoom={12} scrollWheelZoom={false}>
          <LayersControl position="bottomright">
            <LayersControl.BaseLayer checked name="map">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.Overlay name="Searchbar">
              <LayerGroup>
                <Search provider={new OpenStreetMapProvider()} />
              </LayerGroup>
            </LayersControl.Overlay>
            {/* {render()} */}

            {/* <Drawing geoJSON={geoJSON} setGeoJSON={setGeoJSON} onRemove={removeGeoJSON} ref={ref}/> */}

            {/* {isEditMode && (
              <FeatureGroup ref={ref}>
                <GeomanControls
                  options={{
                    position: 'topleft',
                    drawText: false,
                  }}
                  globalOptions={{
                    continueDrawing: false,
                    editable: false,
                  }}
                  onCreate={handleShapeCreated}
                />
              </FeatureGroup>
            )} */}
            <GeomanWrapper geoJSON={geoJSON} setGeoJSON={setGeoJSON} isEditMode={isEditMode}/>

            {position.map((pos, index) => {
              return (
                <Marker position={{ lat: pos.lat, lng: pos.lng }} key={index} className="Bus-marker">
                  <Popup>
                    <span style={{ fontSize: '1.4rem' }}>Name: {devicesInfo[index].name}</span>
                    <br />
                    <span style={{ fontSize: '1.2rem' }}>Lat: {pos.lat}</span>
                    <br />
                    <span style={{ fontSize: '1.2rem' }}>Lng: {pos.lng}</span>
                  </Popup>
                </Marker>
              );
            })}
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;
