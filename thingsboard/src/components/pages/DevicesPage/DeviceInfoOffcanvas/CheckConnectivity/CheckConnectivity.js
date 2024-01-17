import { CloseButton } from '~/components/CustomButton/CustomButton';
import CustomModal from '~/components/CustomModal';

import styles from './CheckConnectivity.module.scss';
import classNames from 'classnames/bind';
import { Button, Col, Container, Row, Stack } from 'react-bootstrap';
import CustomContainer from '~/components/CustomContainer';
import { useEffect, useState } from 'react';
import { deviceConnectivityRequest } from '~/services/requests';
import { TRANSPORT, OS, install, renderCommands, TRANSPORT_VARIANTS, installContent } from './content';
const cx = classNames.bind(styles);
const { getDevicePublishTelemetryCommands } = deviceConnectivityRequest();

function CheckConnectivity({ isVisible, onHide, deviceInfo }) {
  const [commands, setCommands] = useState();
  const [transport, setTransport] = useState(0);
  const [os, setOs] = useState(() => Array.from({ length: OS.length }, () => 0));
  const [transportVariant, setTransportVariant] = useState(() =>
    Array.from({ length: TRANSPORT_VARIANTS.length }, () => 0),
  );
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDevicePublishTelemetryCommands(deviceInfo?.id?.id);
      console.log(data);
      setCommands(data);
    };
    fetchData();
  }, [deviceInfo?.id?.id]);

  return (
    <CustomModal isVisible={isVisible} style={{ width: '50%', maxHeight: '70%', overflowY: 'auto' }}>
      <div>
        <div className={cx('header-wrapper')}>
          <span className={cx('header-title')}>Check connectivity</span>
          <CloseButton onClick={onHide} className={cx('close-btn')} />
        </div>

        <Container>
          <Container className={cx('transport-wrapper')}>
            <Row>
              {TRANSPORT.map((item, index) => (
                <Col
                  className={cx('tab-wrapper', { active: index === transport })}
                  key={`transport-${index}`}
                  onClick={() => setTransport(index)}
                >
                  {item}
                </Col>
              ))}
            </Row>
          </Container>

          <p className={cx('instruction-text')}>
            Use the following instructions for sending telemetry on behalf of the device using shell
          </p>

          <Container>
            <Row>
              {OS[transport].map((item, index) => (
                <Col
                  className={cx('os-wrapper', { active: index === os[transport] })}
                  key={`os-${index}`}
                  onClick={() => setOs((prev) => prev.map((value, idx) => (idx === transport ? index : value)))}
                >
                  {item}
                </Col>
              ))}
            </Row>
          </Container>

          <CustomContainer className={cx('install-text')}>
            {installContent[transport][os[transport]] && (
              <div style={{ marginLeft: '6px', marginTop: '12px' }}>
                <strong>Install necessary client tools</strong>
                <div>{installContent[transport][os[transport]]}</div>
              </div>
            )}
          </CustomContainer>

          <CustomContainer className={cx('install-text')} style={{ paddingBottom: '6px' }}>
            <Stack direction="horizontal" style={{ marginLeft: '6px', marginTop: '12px' }}>
              <strong>Execute the following command</strong>
              <div className="ms-auto">
                <Row>
                  {TRANSPORT_VARIANTS[transport].map((item, index) => (
                    <Col
                      className={cx('tab-wrapper', { active: transportVariant[transport] === index })}
                      key={`transportVariants-${index}`}
                      onClick={() =>
                        setTransportVariant((prev) => prev.map((value, idx) => (idx === transport ? index : value)))
                      }
                    >
                      {item}
                    </Col>
                  ))}
                </Row>
              </div>
            </Stack>
            <div style={{ textAlign: 'center' }}>
              {renderCommands(commands, transport, os[transport], transportVariant[transport])}
            </div>
          </CustomContainer>
        </Container>

        {/* <div style={{ paddingBottom: '16px' }}></div> */}
        <Stack>
          <Button className="ms-auto" style={{ marginRight: '12px', marginTop: '16px' }} onClick={onHide}>
            <strong style={{ fontSize: '1.6rem' }}>Close</strong>
          </Button>
        </Stack>
        <div style={{ paddingBottom: '16px' }}></div>
      </div>
    </CustomModal>
  );
}

export default CheckConnectivity;
