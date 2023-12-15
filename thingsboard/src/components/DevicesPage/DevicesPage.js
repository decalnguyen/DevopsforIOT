import Header from './Header';
import { useAuth } from '~/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { deleteDevice, getAttributesData, getDevicesInfo, getTimeseriesData } from '~/services/request';
import { Button, Container, Form, Row, Table } from 'react-bootstrap';

import styles from './DevicesPage.module.scss';
import classNames from 'classnames/bind';
import { formatTimestamp } from '~/utils';
import LoadingModal from '../LoadingModal';
import CustomModal from '../Modal/Modal';

const cx = classNames.bind(styles);

function DevicesPage() {
  const { token, platform, devicesInfo, setDevicesInfo } = useAuth();
  const [showModals, setShowModals] = useState({});
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

      <Table stripped hover style={{ fontSize: '1.4rem' }}>
        <thead>
          <tr>
            <th>
              <Form.Check type="checkbox" id="default" />
            </th>
            <th>Created time</th>
            <th>Name</th>
            <th>Device Profile</th>
            <th>Label</th>
            <th>State</th>
            <th>Customer name</th>
            <th>Group</th>
            <th>Is Gateway</th>
          </tr>
        </thead>
        <tbody>
          {devicesInfo.map((device, index) => {
            return (
              <tr>
                <td>
                  <Form.Check type="checkbox" id="default" />
                </td>
                <td>{formatTimestamp(device.createdTime)}</td>
                <td>{device.name}</td>
                <td>{device.type}</td>
                <td>{device.label}</td>
                <td>{device.active ? 'Active' : 'Inactive'}</td>
                <td></td>
                <td>{device.groups.map((group) => group.name)}</td>
                <td>
                  <Row>
                    <Form.Check type="checkbox" id="default" className="col-4" />
                    <Button variant="light" className="col-4">
                      <i class="bi bi-bag-plus-fill"></i>
                    </Button>
                    <Button variant="light" className="col-4" onClick={() => handleDeleteDevice(index)}>
                      <i class="bi bi-trash-fill"></i>
                    </Button>
                  </Row>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <LoadingModal show={showModals.loading} />
      <CustomModal
        show={showModals.status}
        titleText="Delete device status"
        bodyText="Delete device succesfully!"
        onHide={() => setShowModals((values) => ({ ...values, status: false }))}
      />
    </Container>
  );
}

export default DevicesPage;
