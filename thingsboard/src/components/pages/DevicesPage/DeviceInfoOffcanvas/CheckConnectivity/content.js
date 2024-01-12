import { Button, Col, Row, Stack } from 'react-bootstrap';
import CustomContainer from '~/components/CustomContainer';

import styles from './CheckConnectivity.module.scss';
import classNames from 'classnames/bind';
import windowImg from '~/assets/icon/windows-24.png';
import { Icon } from '~/components/Icon';
import { CustomButton } from '~/components/CustomButton';
import CopyInput from './CopyInput';
const cx = classNames.bind(styles);

const Window = () => (
  <div>
    <Icon.WindowsIcon />
    <span style={{ marginLeft: '8px' }}>Windows</span>
  </div>
);

const MacOS = () => (
  <div>
    <Icon.MacIcon />
    <span style={{ marginLeft: '8px' }}>MacOS</span>
  </div>
);

const Linux = () => (
  <div>
    <Icon.LinuxIcon />
    <span style={{ marginLeft: '8px' }}>Linux</span>
  </div>
);

const Docker = () => (
  <div>
    <Icon.DockerIcon />
    <span style={{ marginLeft: '8px' }}>Docker</span>
  </div>
);

export const TRANSPORT = ['HTTP', 'MQTT', 'COAP'];
export const OS = [
  [<Window />, <MacOS />, <Linux />],
  [<Window />, <MacOS />, <Linux />, <Docker />],
  [<Linux />, <Docker />],
];
export const TRANSPORT_VARIANTS = [
  ['HTTP', 'HTTPS'],
  ['MQTT', 'MQTTS'],
  ['COAP', 'COAPS'],
];

export const installContent = [
  [
    <span>Starting Windows 10 b17063, cURL is available by default</span>,
    <span>Starting Mac OS X 10.2 6C115 (Jaguar), cURL is available by default</span>,
    <CopyInput content="sudo apt-get install curl" style={{ color: 'red' }} />,
  ],
  [
    <Row>
      <Col className="col-9">
        <span>Use the instructions to download, install, setup and run mosquitto_pub</span>
      </Col>
      <Col>
        <CustomButton.DocumentationButton
          style={{ marginBottom: '20px' }}
          href="https://thingsboard.io/docs/getting-started-guides/helloworld-pe/?connectdevice=mqtt-windows#step-2-connect-device"
        />
      </Col>
    </Row>,
    <CopyInput content="brew install mosquitto" />,
    <CopyInput content="sudo apt-get install curl mosquitto-clients" />,
    null,
  ],
  [
    <Row>
      <Col className="col-9">
        <span>Use the instructions to download, install, setup and run coap-client</span>
      </Col>
      <Col>
        <CustomButton.DocumentationButton
          style={{ marginBottom: '20px' }}
          href="https://thingsboard.io/docs/pe/user-guide/ssl/coap-access-token/"
        />
      </Col>
    </Row>,
    null,
  ],
];

export const getCommands = (commands, transport, os, transportVariant) => {
  console.log(transport, os, transportVariant);
  if (!commands) return null;
  switch (transport) {
    case 0:
      switch (transportVariant) {
        case 0:
          return commands.http.http;
        case 1:
          return commands.http.https;
        default:
          return null;
      }
    case 1:
      switch (os) {
        case 3:
          switch (transportVariant) {
            case 0:
              return commands.mqtt.docker.mqtt;
            case 1:
              return commands.mqtt.docker.mqtts;
            default:
              return null;
          }
        default:
          switch (transportVariant) {
            case 0:
              return commands.mqtt.mqtt;
            case 1:
              return commands.mqtt.mqtts;
            default:
              return null;
          }
      }
    case 2:
      switch (os) {
        case 1:
          switch (transportVariant) {
            case 0:
              return commands.coap.docker.coap;
            case 1:
              return commands.coap.docker.coaps;
            default:
              return null;
          }
        default:
          switch (transportVariant) {
            case 0:
              return commands.coap.coap;
            case 1:
              return commands.coap.coaps;
            default:
              return null;
          }
      }
    default:
      return null;
  }
};

export const renderCommands = (commands, transport, os, transportVariant) => {
  const content = getCommands(commands, transport, os, transportVariant);
  console.log(content);
  if (content) {
    if (typeof content === 'string') {
      return <CopyInput content={content} />;
    }
    return content.map((item, index) => <CopyInput content={item} key={index} />);
  }
};
