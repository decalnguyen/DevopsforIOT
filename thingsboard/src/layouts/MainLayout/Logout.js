import { useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { LogOut } from 'react-feather';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);
  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('platform');
    localStorage.removeItem('refreshToken');
    navigate('/auth');
  };

  return (
    <>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip style={{ fontSize: '1.6rem' }}>Log out</Tooltip>}
      >
        <LogOut onClick={handleOpen} style={{ cursor: 'pointer' }} />
      </OverlayTrigger>
      <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span style={{ fontSize: '2.0rem', fontWeight: '700' }}>Log out</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span style={{ fontSize: '1.6rem', fontWeight: '300' }}>Are you sure to leave?</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ fontSize: '1.4rem', padding: '4px 12px' }} onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" style={{ fontSize: '1.4rem', padding: '4px 12px' }} onClick={handleLogOut}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Logout;
