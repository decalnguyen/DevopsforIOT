import { useDevicesInfo, useGeoJSON } from '~/hooks';
import useBusPosition from '~/hooks/useBusPosition';
import './Map.css';
import styles from './Map.module.scss';
import classNames from 'classnames/bind';
import Header from './Header';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map from './Map';
import BusAlert from './BusAlert';
import useGeofenceNotification from '~/hooks/useGeofenceNotification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function DashBoard() {
  const { devicesInfo } = useDevicesInfo();
  const { position } = useBusPosition({ devicesInfo });
  const [isEditMode, setIsEditMode] = useState(false);
  const geoJsonData = useGeoJSON();
  const { message } = useGeofenceNotification();

  useEffect(() => {
    if (message !== null) {
      toast(<BusAlert message={message} />);
    }
  }, [message]);

  return (
    <div style={{ marginTop: '16px' }} className="container-fluid">
      <Header isEditMode={isEditMode} setIsEditMode={setIsEditMode} onSave={geoJsonData.handleSave} />

      <Map
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        position={position}
        devicesInfo={devicesInfo}
        geofence={geoJsonData}
      />

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default DashBoard;
