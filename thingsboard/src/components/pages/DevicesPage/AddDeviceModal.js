import { Button, Col, Container, FloatingLabel, Form, Modal, ModalBody, Row } from 'react-bootstrap';
import styles from './DevicesPage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { createNewDevice, getDeviceProfiles, getOwnerInfos } from '~/services/request';
import { useAuth } from '~/contexts/AuthContext';
import { LoadingModal, StatusModal } from '~/components/Modal';
import AutoComplete from '~/components/AutoComplete';
import { useAddDeviceModal } from '~/hooks/useAddDeviceModalSuggestions';
import { deviceRequest } from '~/services/requests';

const cx = classNames.bind(styles);

function AddDeviceModal({ showModal, setShowModal, onNewDeviceAdded }) {
  const [inputs, setInputs] = useState({});
  const { platform } = useAuth();
  const [showModals, setShowModals] = useState({});
  const [status, setStatus] = useState('');
  const [suggestions, setSuggestions] = useAddDeviceModal();
  const [showSuggestions, setShowSuggestions] = useState({});
  const { createNewDevice } = deviceRequest();
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    const inputValue = type === 'checkbox' ? checked : value;
    setInputs((values) => ({ ...values, [name]: inputValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('input:', inputs);
    setShowModals((values) => ({ ...values, loading: true }));
    const token = localStorage.getItem('token');
    const data = {
      deviceInfo: {
        name: inputs.name,
        description: inputs.description,
        label: inputs.label,
        deviceProfileId: suggestions.devicesProfileInfo.find((element) => element.name === inputs.deviceProfile).id,
        ownerId: suggestions.ownersInfo.find((element) => element.name === inputs.owners).id,
      },
      token: token,
      platform: platform,
      entityGroupId: suggestions.groupsInfo.find((element) => element.name === inputs.groups).id.id,
    };
    const response = await createNewDevice(data);
    setShowModals((values) => ({ ...values, loading: false }));

    if (response) {
      setStatus('Add device sucessfully');
      onNewDeviceAdded();
    } else setStatus('Add device failed. Seems like this device has already been added');

    setShowModals((values) => ({ ...values, status: true }));
    // setShowModals((values) => ({ ...values, status: false }));

    console.log('response:', response);
  };

  const handleHideForm = () => {
    setInputs({});
    setShowModal(false);
  };

  return (
    <Container>
      <Modal show={showModal} style={{ backgroundColor: 'transparent' }} centered onHide={handleHideForm} animation>
        <Modal.Header closeButton className={cx('modal-header')}>
          <Modal.Title style={{ color: 'white' }}>Add new device</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <Row>
            <Col className="col-2">Device details</Col>
            <Col className={cx('divider')}></Col>
            <Col className="col-2">Credentials</Col>
          </Row>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group>
              <FloatingLabel controlId="floatingName" label="Name*" className={`mb-3 ${cx('floating-label')}`}>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="name@example.com"
                  required
                  className={cx('modal-input')}
                  value={inputs.name}
                  onChange={handleChange}
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingLabel" label="Label" className={cx('floating-label')}>
                <Form.Control
                  name="label"
                  type="text"
                  placeholder="Label"
                  className={cx('modal-input')}
                  value={inputs.label}
                  onChange={handleChange}
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingDeviceProfile" label="Device profile*" className={cx('floating-label')}>
                <Form.Control
                  autoComplete="off"
                  name="deviceProfile"
                  type="text"
                  placeholder="Password"
                  required
                  className={cx('modal-input')}
                  onClick={() => setShowSuggestions((values) => ({ ...values, devicesProfileInfo: true }))}
                  value={inputs.deviceProfile}
                  onChange={handleChange}
                />
                <AutoComplete
                  suggestions={
                    suggestions.devicesProfileInfo &&
                    suggestions.devicesProfileInfo?.length > 0 &&
                    suggestions.devicesProfileInfo.map((profile) => profile.name)
                  }
                  show={showSuggestions.devicesProfileInfo}
                  onHide={() => setShowSuggestions((values) => ({ ...values, devicesProfileInfo: false }))}
                  onItemClick={setInputs}
                  field="deviceProfile"
                ></AutoComplete>
              </FloatingLabel>
              <Form.Check
                name="isGateway"
                label="Is Gateway"
                className={cx('modal-check')}
                value={inputs.isGateway || false}
                onChange={handleChange}
              ></Form.Check>

              <Container className={cx('second-wrapper')}>
                <Container style={{ paddingBottom: '32px' }}>
                  <Row>
                    <span className={cx('second-title')}>Owners and group</span>
                  </Row>
                  <FloatingLabel label="Owner*" className={cx('floating-label')}>
                    <Form.Control
                      autoComplete="off"
                      name="owners"
                      type="text"
                      placeholder="Owner*"
                      required
                      className={cx('modal-input')}
                      value={inputs.owners}
                      onClick={() => setShowSuggestions((values) => ({ ...values, ownersInfo: true }))}
                    />
                    {/* </AutoComplete> */}
                  </FloatingLabel>
                  <AutoComplete
                    suggestions={
                      suggestions.ownersInfo &&
                      suggestions.ownersInfo?.length > 0 &&
                      suggestions.ownersInfo.map((owner) => owner.name)
                    }
                    show={showSuggestions.ownersInfo}
                    onItemClick={setInputs}
                    onHide={() => setShowSuggestions((values) => ({ ...values, ownersInfo: false }))}
                    field="owners"
                  ></AutoComplete>
                  <FloatingLabel label="Group" className={cx('floating-label')}>
                    <Form.Control
                      autoComplete="off"
                      name="group"
                      type="text"
                      placeholder="Something"
                      required
                      className={cx('modal-input')}
                      value={inputs.groups}
                      onChange={handleChange}
                      onClick={() => setShowSuggestions((values) => ({ ...values, groupsInfo: true }))}
                    />
                  </FloatingLabel>
                  <AutoComplete
                    suggestions={
                      suggestions.groupsInfo &&
                      suggestions.groupsInfo?.length > 0 &&
                      suggestions.groupsInfo.map((group) => group.name)
                    }
                    show={showSuggestions.groupsInfo}
                    onItemClick={setInputs}
                    onHide={() => setShowSuggestions((values) => ({ ...values, groupsInfo: false }))}
                    field="groups"
                  ></AutoComplete>
                  <FloatingLabel label="Description" className={cx('floating-label')}>
                    <Form.Control
                      name="description"
                      type="text"
                      placeholder="Something"
                      required
                      className={cx('modal-input')}
                      value={inputs.description}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Container>
              </Container>

              <div className={cx('divider')}></div>

              <Col className={`col-4 ms-auto ${cx('modal-footer')}`}>
                <Button
                  className="ms-auto col-6"
                  variant="light"
                  style={{ marginRight: '8px' }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button className="ms-auto col-5" variant="success" type="submit">
                  Add
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </ModalBody>
      </Modal>

      <LoadingModal show={showModals.loading} />

      <StatusModal
        show={showModals.status}
        titleText="Create device status!"
        bodyText={status}
        onHide={() => setShowModals((values) => ({ ...values, status: false }))}
      />
    </Container>
  );
}

export default AddDeviceModal;
