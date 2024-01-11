import { useDevicesInfo, useGeoJSON } from '~/hooks';
import useBusPosition from '~/hooks/useBusPosition';
import './Map.css';
import styles from './Map.module.scss';
import classNames from 'classnames/bind';
import Header from './Header';
import { useEffect, useState } from 'react';
import Map from './Map';
import useGeofenceNotification from '~/hooks/useGeofenceNotification';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatTimestamp } from '~/utils';

const cx = classNames.bind(styles);

function DashBoard() {
  const { devicesInfo } = useDevicesInfo();
  const { position } = useBusPosition({ devicesInfo });
  const [isEditMode, setIsEditMode] = useState(false);
  const geoJsonData = useGeoJSON({devicesInfo});
  const { message } = useGeofenceNotification();

  useEffect(() => {
    if (message !== null) {
      toast(`${message.name} has ${message.type.toLowerCase()} the geofence at ${formatTimestamp(message.ts)}`, {
        type: message.type === 'Entered' ? 'success' : 'warning',
      });
    }
  }, [message]);

  return (
    <div style={{ marginTop: '16px' }} className="container-fluid">
      <Header isEditMode={isEditMode} setIsEditMode={setIsEditMode} onSave={async() => {
        const {handleSave} = geoJsonData;
        const promise = async(deviceInfo) => {
          const data = await handleSave(deviceInfo);
          console.log(data);
        }
        
        const promises = devicesInfo && devicesInfo?.length > 0 && devicesInfo.map(promise);
        const results = await Promise.all(promises);
        console.log(results);
        }} />

      <Map
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        position={position}
        devicesInfo={devicesInfo}
        geofence={geoJsonData}
      />
    </div>
  );
}

export default DashBoard;
