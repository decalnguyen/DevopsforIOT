import classNames from 'classnames/bind';
import styles from './DevicesPage.module.scss';
import { Form, Col, Container, Row, Button } from 'react-bootstrap';
import AddDeviceModal from './AddDeviceModal';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Header({ onNewDeviceAdded }) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };
  const headerRightItems = [
    { Icon: <i className="bi bi-plus-lg"></i>, text: 'Add device', onClick: handleShowModal },
    { Icon: <i className="bi bi-arrow-clockwise"></i>, text: 'Refresh' },
    { Icon: <i className="bi bi-search"></i>, text: 'Search devices' },
  ];
  return (
    <Container>
      <Row className={`p-3 ${cx('header-wrapper')}`}>
        <Col className="" style={{ paddingBottom: '9px' }}>
          <span className={cx('header-text')}>Devices</span>
        </Col>
        <Col className="col-2">
          <Row className="justify-content-evenly">
            {headerRightItems.map((item) => {
              return (
                <Button className={`${cx('right-item')}`} onClick={item.onClick}>
                  {item.Icon}
                </Button>
              );
            })}
          </Row>
        </Col>
      </Row>

      <AddDeviceModal showModal={showModal} setShowModal={setShowModal} onNewDeviceAdded={onNewDeviceAdded} />
    </Container>
  );
}

export default Header;
