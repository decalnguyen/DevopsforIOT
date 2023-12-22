import { Button, Form, Stack, Table } from 'react-bootstrap';
import CustomContainer from '~/components/CustomContainer';

import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import CustomButton from '~/components/CustomButton';
import { useMemo, useState } from 'react';
import useAttributes from '~/hooks/useAttribute';
import { formatTimestamp } from '~/utils';
import CopyButton from '~/components/CustomButton/CopyButton';

const cx = classNames.bind(styles);

function Attributes({ deviceInfo }) {
  const [scope, setScope] = useState('CLIENT_SCOPE');
  const elements = useMemo(() => {
    return [
      {
        title: 'select',
        component: <Form.Check type="checkbox"></Form.Check>,
      },
      {
        title: 'lastUpdateTime',
        component: <span>Last Update Time</span>,
      },
      {
        title: 'key',
        component: <span>Key</span>,
      },
      {
        title: 'value',
        component: <span>Value</span>,
      },
    ];
  }, []);

  const [attributes, setAttributes] = useAttributes({
    entityType: deviceInfo.id.entityType,
    entityId: deviceInfo.id.id,
    scope,
  });

  return (
    <CustomContainer>
      <Stack direction="horizontal">
        <span style={{ fontSize: '1.8rem', padding: '16px' }}> attributes</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Entity attributes scope</span>
          <Form.Select className={cx('select')} onChange={(e) => setScope(e.target.value)}>
            <option value="CLIENT_SCOPE">Client attributes</option>
            <option value="SERVER_SCOPE">Server attributes</option>
            <option value="SHARED_SCOPE">Shared attributes</option>
          </Form.Select>
        </div>
        <Stack direction="horizontal" className="ms-auto" gap={3}>
          <button variant="light" style={{ borderRadius: '50%' }}>
            <i class="bi bi-plus" style={{ fontSize: '2rem' }}></i>
          </button>
          <button variant="light" style={{ borderRadius: '50%' }}>
            <i class="bi bi-arrow-clockwise" style={{ fontSize: '2rem' }}></i>
          </button>
          <button variant="light" style={{ borderRadius: '50%' }}>
            <i class="bi bi-search" style={{ fontSize: '2rem' }}></i>
          </button>
        </Stack>
      </Stack>

      <Table>
        <thead>
          {elements.map((element, index) => {
            return <th key={index}>{element.component}</th>;
          })}
        </thead>
        <tbody>
          {attributes &&
            attributes.length > 0 &&
            attributes.map((attribute, index) => {
              console.log('attribute: ' + attribute);
              return (
                <tr>
                  <td>
                    <Form.Check></Form.Check>
                  </td>
                  <td>{formatTimestamp(attribute.lastUpdateTs)}</td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      {attribute.key}
                      <CopyButton textToCopy={attribute.key} />
                    </Stack>
                  </td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      {typeof attribute.value === 'boolean' ? (attribute.value ? 'true' : 'false') : attribute.value}
                      <CopyButton textToCopy={attribute.value} />
                    </Stack>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </CustomContainer>
  );
}

export default Attributes;
