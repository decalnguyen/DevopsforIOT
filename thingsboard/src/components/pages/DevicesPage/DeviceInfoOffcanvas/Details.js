import { useMemo, useState } from 'react';
import { Button, Container, FloatingLabel, Form, Modal, Stack } from 'react-bootstrap';

import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import usedeviceRequest from '~/services/requests/deviceRequest';
import { toast } from 'react-toastify';
import { EditButton } from '~/components/CustomButton/CustomButton';
import CheckConnectivity from './CheckConnectivity/CheckConnectivity';
import { deviceRequest } from '~/services/requests';
import { useLoading } from '~/contexts';

const cx = classNames.bind(styles);

const modalButton = ['Manage credentials', 'Manage owners and groups', 'Check connectivity'];
// In the future, if there are more components that suits all these button, we can create an array of modals that can be rendered
const { deleteDevice } = deviceRequest();
const { getDeviceCredentialsByDeviceId } = usedeviceRequest();

const confirmToDeleteDevice = () => {};

function Details({ deviceInfo, onHide }) {
  const { setLoading } = useLoading();
  const [isEditMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(Array(modalButton.length).fill(false)); // showModal is an array that manages the open/close state of many modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const inputs = useMemo(() => {
    return (
      deviceInfo && [
        {
          label: 'name',
          value: deviceInfo.name && deviceInfo.name,
        },
        {
          label: 'Device profile*',
          value: deviceInfo.type && deviceInfo.type,
        },
        {
          label: 'Label',
          value: deviceInfo.label && deviceInfo.label,
        },
        {
          label: 'Assigned firmware',
          value: deviceInfo.firmwareId && deviceInfo.firmwareId,
          help: 'Choose firmware that will be distributed to the devices',
        },
        {
          label: 'Assigned software',
          value: deviceInfo.softwareId && deviceInfo.softwareId,
          help: 'Choose software that will be distributed to the devices',
        },
        {
          label: 'Is Gateway',
          value: 'false',
        },
        {
          label: 'Description',
          value: deviceInfo.description && deviceInfo.description,
        },
        {
          label: 'Groups',
          value: deviceInfo.groups && deviceInfo.groups?.length > 0 && deviceInfo.groups.map((group) => group.name),
        },
      ]
    );
  }, [deviceInfo]);
  const handleToggleModal = (index) => {
    setShowModal((prev) => prev.map((item, _index) => (_index === index ? !item : item)));
  };
  const handleDeleteDevice = async () => {
    setShowConfirmModal(true);
    try {
      setLoading(true);
      await deleteDevice({ deviceId: deviceInfo?.id.id });
      setLoading(false);
      onHide();
      toast.success('Device deleted successfully', { autoClose: '1000' });
    } catch (e) {
      toast.error('Device deletion failed', { autoClose: '1000' });
    }
  };
  return (
    <div style={{ position: 'relative' }}>
      <EditButton onClick={() => setEditMode((prev) => !prev)} className={cx('edit-btn')} />
      {!isEditMode && (
        <div>
          <Stack direction="horizontal" gap={5} style={{ marginTop: '16px' }}>
            {modalButton.map((item, index) => (
              <Button className={cx('primary-btn')} key={index} onClick={() => handleToggleModal(index)}>
                {item}
              </Button>
            ))}
            <Button className={cx('primary-btn')} key="delete" onClick={handleDeleteDevice}>
              Delete device
            </Button>
          </Stack>
          <Stack direction="horizontal" gap={5} style={{ marginTop: '16px' }}>
            <Button
              className={cx('sec-btn')}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(deviceInfo.id.id);
                  toast.success('Copy device id sucesfully', { autoClose: 1000 });
                } catch (e) {
                  toast.error('Cannot copy device id', { autoClose: 1000 });
                }
              }}
            >
              <i class="bi bi-clipboard-fill"></i>
              <span style={{ marginLeft: '12px' }}>Copy device Id</span>
            </Button>
            <Button
              className={cx('sec-btn')}
              onClick={async () => {
                const response = await getDeviceCredentialsByDeviceId({ deviceId: deviceInfo.id.id });
                const accessToken = response.credentialsId;
                try {
                  await navigator.clipboard.writeText(accessToken);
                  toast.success('Copy access token sucesfully', { autoClose: 1000 });
                } catch (e) {
                  toast.error('Cannot copy access token', { autoClose: 1000 });
                }
              }}
            >
              <i class="bi bi-clipboard-fill"></i>
              <span style={{ marginLeft: '12px' }}>Copy access token</span>
            </Button>
          </Stack>
        </div>
      )}
      <Form style={{ marginTop: '16px' }}>
        <Stack gap={2}>
          {inputs &&
            inputs?.length > 0 &&
            inputs.map((input, index) => {
              return (
                <div style={{ padding: '7px 0', fontSize: '1.4rem' }}>
                  <FloatingLabel label={input.label} key={index} style={{ backgroundColor: 'transparent' }}>
                    <Form.Control
                      value={input.value}
                      placeholder=""
                      style={{ backgroundColor: isEditMode ? '#e0f2f1' : '#eee', height: '55px', fontSize: '1.4rem' }}
                      disabled={!isEditMode}
                    ></Form.Control>
                    <Form.Text muted>{input.help}</Form.Text>
                  </FloatingLabel>
                </div>
              );
            })}
        </Stack>
      </Form>
      <Modal show={showConfirmModal}>
        <Modal.Header closeButton>Are you sure?</Modal.Header>
      </Modal>

      <CheckConnectivity isVisible={showModal[2]} onHide={() => handleToggleModal(2)} deviceInfo={deviceInfo} />
    </div>
  );
}

export default Details;
