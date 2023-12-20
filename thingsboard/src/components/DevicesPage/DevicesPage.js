import Header from './Header';
import { useAuth } from '~/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { deleteDevice, getAttributesData, getDevicesInfo, getTimeseriesData } from '~/services/request';
import { Button, Container, Form, Offcanvas, Row, Table } from 'react-bootstrap';

import styles from './DevicesPage.module.scss';
import classNames from 'classnames/bind';
import LoadingModal from '../LoadingModal';
import CustomModal from '../Modal/Modal';
import DevicesTable from './DevicesTable';
import DeviceInfoCanvas from './DeviceInfoOffcanvas/DeviceInfoCanvas';

const cx = classNames.bind(styles);

function DevicesPage() {
  const { token, platform, devicesInfo, setDevicesInfo } = useAuth();
  const [showModals, setShowModals] = useState({});
  const [showCanvas, setShowCanvas] = useState({});
  const [status, setStatus] = useState('');
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [attributesData, setAttributesData] = useState([]);

  useEffect(() => {
    const fetchDevicesInfo = async () => {
      const devicesInfo = await getDevicesInfo({ token, platform });
      return devicesInfo;
    };
    const fetchData = async () => {
      const devicesInfo = await fetchDevicesInfo();
      console.log('device:', devicesInfo);
      if (!devicesInfo || devicesInfo.length === 0) return;
      const devices = devicesInfo.map((device) => {
        const current = device.id;
        return {
          entityType: current.entityType,
          entityId: current.id,
          ...device,
        };
      });

      setDevicesInfo(devices);
      console.log('Devices:', devices);
      const timeSeriesDataPromises = devices.map(async (device) => {
        const { entityType, entityId } = device;
        const data = await getTimeseriesData({ entityType, entityId, token, platform });
        return data;
      });
      const attributesDataPromises = devices.map(async (device) => {
        const { entityType, entityId } = device;
        const data = await getAttributesData({ entityType, entityId, token, platform });
        return data;
      });
      const timeSeriesData = await Promise.all(timeSeriesDataPromises);
      const attributesData = await Promise.all(attributesDataPromises);
      setTimeSeriesData(timeSeriesData);
      setAttributesData(attributesData);
    };

    fetchData();
  }, [token, platform]);

  const handleNewDeviceAdded = async () => {
    const updatedDevicesInfo = await getDevicesInfo({ token, platform });

    setDevicesInfo(updatedDevicesInfo);
  };

  const handleDeleteDevice = async (index) => {
    const deviceId = devicesInfo[index].id.id;
    setShowModals((values) => ({ ...values, loading: true }));
    const response = await deleteDevice({ platform, token, deviceId });
    setShowModals((values) => ({ ...values, loading: false }));

    if (response) {
      setStatus('Delete device succesfully');
      setShowModals((values) => ({ ...values, status: true }));
      const newDevicesInfo = await getDevicesInfo({ token, platform });
      setDevicesInfo(newDevicesInfo);
    }
  };

  return (
    <Container>
      <Header onNewDeviceAdded={handleNewDeviceAdded} />

      <DevicesTable devicesInfo={devicesInfo} handleDeleteDevice={handleDeleteDevice} setShowCanvas={setShowCanvas} />
      <LoadingModal show={showModals.loading} />
      <CustomModal
        show={showModals.status}
        titleText="Delete device status"
        bodyText="Delete device succesfully!"
        onHide={() => setShowModals((values) => ({ ...values, status: false }))}
      />
      {showCanvas.show && (
        <DeviceInfoCanvas
          deviceInfo={devicesInfo[showCanvas.index]}
          onHide={() => setShowCanvas((values) => ({ ...values, show: false }))}
        />
      )}
    </Container>
  );
}

export default DevicesPage;
