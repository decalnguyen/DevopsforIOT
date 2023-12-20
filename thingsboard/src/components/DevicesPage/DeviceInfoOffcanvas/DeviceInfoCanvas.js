import { useMemo, useState } from 'react';
import { Button, Container, Nav, Offcanvas, Row, Stack } from 'react-bootstrap';
import Details from './Details';

import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import Attributes from './Attributes';
import LatestTelemetry from './LatestTelemetry';

const cx = classNames.bind(styles);

function DeviceInfoCanvas({ deviceInfo, onHide }) {
  const [show, setShow] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const handleSelectTab = (selectedTab) => setActiveTab(selectedTab);

  // const tabs = useMemo(() => {
  //   return ['Details', 'Attributes', 'Latest telemetry', 'Alarms', 'Events', 'Relations'];
  // }, []);

  const tabs = useMemo(() => {
    return [
      {
        title: 'Details',
        component: <Details deviceInfo={deviceInfo} />,
      },
      {
        title: 'Attributes',
        component: <Attributes deviceInfo={deviceInfo} />,
      },
      {
        title: 'Latest telemetry',
        component: <LatestTelemetry deviceInfo={deviceInfo} />,
      },
      {
        title: 'Alarms',
        component: <div></div>,
      },
      {
        title: 'Events',
        component: <div></div>,
      },
      {
        title: 'Relations',
        component: <div></div>,
      },
    ];
  }, [deviceInfo]);

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      backdrop="static"
      style={{ height: '100vh', width: '50%', overflowY: 'auto' }}
    >
      <Offcanvas.Header className={cx('header')} closeButton>
        <Offcanvas.Title>
          <span style={{ fontSize: '2rem' }}>{deviceInfo && deviceInfo.name}</span>
          <br />
          <span style={{ fontWeight: '100' }}>Device Details</span>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div style={{ borderBottom: '1px solid #ccc' }}>
          <Nav
            variant="underline"
            activeKey={tabs[activeTab].title}
            onSelect={handleSelectTab}
            style={{ color: 'red' }}
          >
            {tabs.map((tab, index) => {
              return (
                <Nav.Item key={index} style={{ fontSize: '1.7rem', padding: '0 16px', color: 'red' }}>
                  <Nav.Link eventKey={index}>{tab.title}</Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </div>

        <Container style={{ height: '90%' }}>{tabs[activeTab].component}</Container>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default DeviceInfoCanvas;
