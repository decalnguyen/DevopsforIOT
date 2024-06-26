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
import { useCheckboxItems, usePagination } from '~/hooks';
import MultiSelectPanel from '~/components/MultiSelectPanel';
import CopyableElement from './CopyableElement';
import PaginationHandle from '~/components/PaginationHandle';

const cx = classNames.bind(styles);

function LatestTelemetry({ deviceInfo }) {
  const { deleteEntityTimeSeries, postTelemetry } = telemetryRequest();
  const [telemetry] = useTemeletry({ deviceInfo });
  const [isVisible, setVisible] = useState(false);
  const { totalPages, currentPage, setCurrentPage, startIndex, endIndex } = usePagination(
    telemetry ? telemetry.length : 0,
    10,
  );
  console.log(currentPage);
  const { checkedItems, setCheckedItems, handleCheckboxChange, checkAll, setCheckAll, handleCheckAll } =
    useCheckboxItems(telemetry ? telemetry?.length : 0);
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
        width: '15%',
      },
      {
        title: 'key',
        component: <span>Key</span>,
        width: '30%',
      },
      {
        title: 'value',
        width: '30%',
        component: <span>Value</span>,
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
    <>
      <CustomContainer style={{ maxHeight: '90%', overflow: 'auto' }}>
        <Stack direction="horizontal">
          {checkedItems?.length === 0 ? (
            <>
              <span className={cx('header-title')}>Telemetry</span>
              <div className="ms-auto">
                <CustomButton.AddButton className={cx('header-icon')} onClick={() => setVisible(true)} />
                <CustomButton.SearchButton className={cx('header-icon')} />
              </div>
            </>
          ) : (
            <MultiSelectPanel title={`${checkedItems?.length} telemetry selected`} onDeleteItems={handleDeleteItems} />
          )}
        </Stack>

        <Table style={{ tableLayout: 'fixed', overflow: 'hidden' }}>
          <colgroup>
            {elements.map((element) => (
              <col style={{ width: element.width }}></col>
            ))}
          </colgroup>
          <tr style={{ padding: '4px 4px' }}>
            {elements.map((element, index) => {
              return <th key={index}>{element.component}</th>;
            })}
          </tr>
          <tbody>
            {telemetry &&
              telemetry?.length > 0 &&
              telemetry.slice(startIndex, endIndex).map((attribute, index) => {
                return (
                  <tr>
                    <td>
                      <Form.Check
                        key={index}
                        checked={checkedItems.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      ></Form.Check>
                    </td>
                    <td>
                      <p className={global['text-overflow']}>{formatTimestamp(attribute.lastUpdateTs)}</p>
                    </td>
                    <td>
                      <CopyableElement value={attribute?.key} />
                    </td>
                    <td>
                      <CopyableElement value={attribute?.value} />
                    </td>
                    <td>
                      <CustomButton.DeleteButton onClick={() => handleDeleteTelemetry(index)} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        <AddModal
          deviceInfo={deviceInfo}
          isVisible={isVisible}
          setVisible={setVisible}
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

            setVisible(false);
          }}
        />
      </CustomContainer>

      <PaginationHandle
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hr={false}
        paginationStyle={{ marginRight: '10px' }}
        maxNum={totalPages}
        show={telemetry && telemetry.length > 0}
      />
    </>
  );
}

export default LatestTelemetry;
