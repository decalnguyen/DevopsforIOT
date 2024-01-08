import Header from './Header';
import { useAuth } from '~/contexts/AuthContext';
import { useState } from 'react';
import { Container } from 'react-bootstrap';

import styles from './DevicesPage.module.scss';
import classNames from 'classnames/bind';
import { LoadingModal, StatusModal } from '../Modal';
import DevicesTable from './DevicesTable';
import DeviceInfoCanvas from './DeviceInfoOffcanvas/DeviceInfoCanvas';
import { deviceRequest, devicesInfoRequest } from '~/services/requests';
import { useCheckboxItems, useDevicesInfo } from '~/hooks';
import { getLocalStorageItems } from '~/utils';
import MultiSelectPanel from '../MultiSelectPanel';
import CustomContainer from '../CustomContainer';
import PaginationHandle from '../PaginationHandle';

const cx = classNames.bind(styles);

function DevicesPage() {
  const { token, platform } = getLocalStorageItems();
  const [showModals, setShowModals] = useState({});
  const [showCanvas, setShowCanvas] = useState({});
  const [status, setStatus] = useState('');
  const { devicesInfo, setDevicesInfo } = useDevicesInfo();

  const { checkedItems, setCheckedItems, handleCheckboxChange, checkAll, setCheckAll, handleCheckAll } =
    useCheckboxItems(devicesInfo ? devicesInfo.length : 0);
  const { getDevicesInfo } = devicesInfoRequest();
  const { deleteDevice } = deviceRequest();

  const handleNewDeviceAdded = async () => {
    const updatedDevicesInfo = await getDevicesInfo({ token, platform });

    setDevicesInfo(updatedDevicesInfo);
  };

  const handleDeleteDevice = async (index) => {
    if (checkedItems.length === 0) {
      const deviceId = devicesInfo[index].id.id;
      setShowModals((values) => ({ ...values, loading: true }));
      const response = await deleteDevice({ platform, token, deviceId });
      setShowModals((values) => ({ ...values, loading: false }));

      if (response.status === 200) {
        setStatus('Delete device succesfully');
        setShowModals((values) => ({ ...values, status: true }));
        const newDevicesInfo = await getDevicesInfo({});
        setDevicesInfo(newDevicesInfo);
      }
    } else {
      const devicesToDelete = checkedItems.map((index) => devicesInfo[index]);
      const deletePromises = devicesToDelete.map(async (device) => {
        const deviceId = device.id.id;
        try {
          const response = await deleteDevice({ deviceId });
          if (response.status === 200) return true;
        } catch (e) {
          return false;
        }
      });
      setShowModals((values) => ({ ...values, loading: true }));
      setShowModals((values) => ({ ...values, loading: false }));
      const newDevicesInfo = await getDevicesInfo({});
      setDevicesInfo(newDevicesInfo);
    }
  };

  return (
    <CustomContainer>
      {checkedItems.length === 0 ? (
        <Header onNewDeviceAdded={handleNewDeviceAdded} />
      ) : (
        <div className={cx('header-wrapper')}>
          <MultiSelectPanel
            onDeleteItems={handleDeleteDevice}
            title={`${checkedItems.length} ${checkedItems.length === 1 ? 'device' : 'devices'} selected`}
          />
        </div>
      )}
      <div className={cx('divider')}></div>
      <DevicesTable
        devicesInfo={devicesInfo}
        handleDeleteDevice={handleDeleteDevice}
        setShowCanvas={setShowCanvas}
        checkBoxHandler={{ checkedItems, setCheckedItems, handleCheckboxChange, checkAll, setCheckAll, handleCheckAll }}
      />
      <LoadingModal show={showModals.loading} />
      <StatusModal
        show={showModals.status}
        titleText="Delete device status"
        bodyText="Delete device succesfully!"
        onHide={() => setShowModals((values) => ({ ...values, status: false }))}
      />

      <DeviceInfoCanvas
        deviceInfo={devicesInfo[showCanvas.index]}
        onHide={() => setShowCanvas((values) => ({ ...values, show: false }))}
        show={showCanvas.show}
      />

      <PaginationHandle />
    </CustomContainer>
  );
}

export default DevicesPage;
