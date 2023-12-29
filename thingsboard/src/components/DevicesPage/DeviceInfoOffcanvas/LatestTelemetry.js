import { useMemo, useState } from 'react';
import { Form, Stack, Table } from 'react-bootstrap';
import { CustomButton } from '~/components/CustomButton';
import CustomContainer from '~/components/CustomContainer';
import useTemeletry from '~/hooks/useTelemetry';
import { formatTimestamp } from '~/utils';
import { telemetryRequest } from '~/services/requests';

import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import AddModal from './AddModal';
import { useCheckboxItems } from '~/hooks';
import MultiSelectPanel from './MultiSelectPanel';

const cx = classNames.bind(styles);

function LatestTelemetry({ deviceInfo }) {
  const { deleteEntityTimeSeries, postTelemetry } = telemetryRequest();
  const [telemetry] = useTemeletry({ deviceInfo });
  const [showAddModal, setShowAddModal] = useState(false);
  const { checkedItems, setCheckedItems, handleCheckboxChange, checkAll, setCheckAll, handleCheckAll } =
    useCheckboxItems(telemetry ? telemetry.length : 0);
  const elements = useMemo(() => {
    return [
      {
        title: 'select',
        component: <Form.Check checked={checkAll} onChange={() => handleCheckAll()} type="checkbox"></Form.Check>,
        width: '10%',
      },
      {
        title: 'lastUpdateTime',
        component: <span>Last Update Time</span>,
        width: '30%',
      },
      {
        title: 'key',
        component: <span>Key</span>,
        width: '10%',
      },
      {
        title: 'value',
        component: <span>Value</span>,
        width: '40%',
      },
      {
        title: '',
        component: <></>,
        width: '10%',
      },
    ];
  }, [checkAll, handleCheckAll]);

  const handleDeleteTelemetry = async (index) => {
    const data = {
      entityType: deviceInfo.id.entityType,
      entityId: deviceInfo.id.id,
      keys: telemetry[index].key,
    };
    const response = await deleteEntityTimeSeries(data);
    console.log('response: ' + response);
  };

  const handleDeleteItems = async () => {
    const keys = checkedItems.map((index) => telemetry[index].key).join(',');
    await deleteEntityTimeSeries({ entityType: deviceInfo.id.entityType, entityId: deviceInfo.id.id, keys });
    setCheckedItems([]);
    setCheckAll(false);
  };
  return (
    <CustomContainer>
      <Stack direction="horizontal">
        {checkedItems.length === 0 ? (
          <>
            <span className={cx('header-title')}>Telemetry</span>
            <div className="ms-auto">
              <CustomButton.AddButton className={cx('header-icon')} onClick={() => setShowAddModal(true)} />
              <CustomButton.SearchButton className={cx('header-icon')} />
            </div>
          </>
        ) : (
          <MultiSelectPanel title={`${checkedItems.length} telemetry selected`} onDeleteItems={handleDeleteItems} />
        )}
      </Stack>

      <Table>
        <thead>
          <tr style={{ padding: '4px 4px' }}>
            {elements.map((element, index) => {
              return (
                <th key={index} style={{ width: element.width }}>
                  {element.component}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {telemetry &&
            telemetry.length > 0 &&
            telemetry.map((attribute, index) => {
              return (
                <tr>
                  <td>
                    <Form.Check
                      key={index}
                      checked={checkedItems.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    ></Form.Check>
                  </td>
                  <td>{formatTimestamp(attribute.lastUpdateTs)}</td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      {attribute.key}
                      <CustomButton.CopyButton textToCopy={attribute.key} />
                    </Stack>
                  </td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      {typeof attribute.value === 'boolean' ? (attribute.value ? 'true' : 'false') : attribute.value}
                      <CustomButton.CopyButton textToCopy={attribute.value} />
                    </Stack>
                  </td>
                  <td>
                    <CustomButton.DeleteButton onClick={() => handleDeleteTelemetry(index)} />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>

      {showAddModal && (
        <AddModal
          deviceInfo={deviceInfo}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          title="telemetry"
          onSubmit={async (values) => {
            const telemetry = {
              [values.key]: values.value,
            };
            const telemetryObject = {
              entityType: deviceInfo.id.entityType,
              entityId: deviceInfo.id.id,
              telemetry,
            };
            postTelemetry(telemetryObject);

            setShowAddModal(false);
          }}
        />
      )}
    </CustomContainer>
  );
}

export default LatestTelemetry;
