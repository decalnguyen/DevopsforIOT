import { Button, Modal } from 'react-bootstrap';

function StatusModal(modalInfo) {
  const {
    show = false,
    onHide,
    titleText,
    bodyText,
    backdrop = 'static',
    keyboard = false,
    style,
    centered,
  } = modalInfo;
  return (
    <Modal style={style} show={show} onHide={onHide} backdrop={backdrop} keyboard={keyboard} centered={centered} props>
      <Modal.Header closeButton>
        <Modal.Title>{titleText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StatusModal;
