import { useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
function DeviceInfoCanvas() {
  const [show, setShow] = useState(false);
  return (
    <Offcanvas show={show} onHide={() => setShow(false)} backdrop="static">
      <Offcanvas.Header closeButton></Offcanvas.Header>
      <Offcanvas.Body></Offcanvas.Body>
    </Offcanvas>
  );
}

export default DeviceInfoCanvas;
