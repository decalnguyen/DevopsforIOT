import { useMemo } from 'react';
import { Form, Stack, Table } from 'react-bootstrap';
import CopyButton from '~/components/CustomButton/CopyButton';
import { AddButton, DeleteButton } from '~/components/CustomButton';
import CustomContainer from '~/components/CustomContainer';
import useTemeletry from '~/hooks/useTelemetry';
import { formatTimestamp } from '~/utils';
import SearchButton from '~/components/CustomButton/SearchButton';
import useDeviceRequest from '~/hooks/request/deviceRequest';

function LatestTelemetry({ deviceInfo }) {
  const { deleteEntityTimeSeries } = useDeviceRequest();
  const [telemetry] = useTemeletry({ deviceInfo });
  console.log('telemetry' + telemetry);
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
      {
        title: '',
        component: <></>,
      },
    ];
  }, []);

  const handleDeleteTelemetry = async (index) => {
    const data = {
      entityType: deviceInfo.id.entityType,
      entityId: deviceInfo.id.id,
      keys: telemetry[index].key,
    };
    const response = await deleteEntityTimeSeries(data);
    console.log('response: ' + response);
  };

  return (
    <CustomContainer>
      <Stack direction="horizontal">
        <span>Telemetry</span>
        <div className="ms-auto">
          <AddButton />
          <SearchButton />
        </div>
      </Stack>

      <Table>
        <thead>
          <tr style={{ padding: '4px 4px' }}>
            {elements.map((element, index) => {
              return <th key={index}>{element.component}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {telemetry &&
            telemetry.length > 0 &&
            telemetry.map((attribute, index) => {
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
                  <td>
                    <DeleteButton onClick={() => handleDeleteTelemetry(index)} />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </CustomContainer>
  );
}

export default LatestTelemetry;
