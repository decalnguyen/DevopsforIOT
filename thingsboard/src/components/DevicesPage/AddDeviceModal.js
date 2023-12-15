import { Button, Col, Container, FloatingLabel, Form, Modal, ModalBody, Row } from 'react-bootstrap';
import styles from './DevicesPage.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { createNewDevice } from '~/services/request';
import { useAuth } from '~/contexts/AuthContext';
import LoadingModal from '../LoadingModal';
import CustomModal from '../Modal/Modal';

const cx = classNames.bind(styles);

function AddDeviceModal({ showModal, setShowModal, onNewDeviceAdded }) {
  const [inputs, setInputs] = useState({});
  const { platform, token } = useAuth();
  const [showModals, setShowModals] = useState({});
  const [status, setStatus] = useState('');
  console.log('token from add device modal: ', token);
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    const inputValue = type === 'checkbox' ? checked : value;
    setInputs((values) => ({ ...values, [name]: inputValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('input:', inputs);
    setShowModals((values) => ({ ...values, loading: true }));
    const data = {
      name: inputs.name,
      label: inputs.label,
      description: inputs.description,
      token: token,
      platform: platform,
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

  return (
    <Container>
      <Modal show={showModal} centered onHide={() => setShowModal(false)} animation>
        <Modal.Header closeButton className={cx('modal-header')}>
          <Modal.Title>Add new device</Modal.Title>
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
                  name="deviceProfile"
                  type="text"
                  placeholder="Password"
                  required
                  className={cx('modal-input')}
                  value={inputs.deviceProfile}
                  onChange={handleChange}
                />
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
                      name="owners"
                      type="text"
                      placeholder="Something"
                      required
                      className={cx('modal-input')}
                      value={inputs.owners}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Group" className={cx('floating-label')}>
                    <Form.Control
                      name="group"
                      type="text"
                      placeholder="Something"
                      required
                      className={cx('modal-input')}
                      value={inputs.group}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
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

      <CustomModal
        show={showModals.status}
        titleText="Create device status!"
        bodyText={status}
        onHide={() => setShowModals((values) => ({ ...values, status: false }))}
      />
    </Container>
  );
}

export default AddDeviceModal;
