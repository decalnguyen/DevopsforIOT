import { Button, Form, Stack, Table } from 'react-bootstrap';
import CustomContainer from '~/components/CustomContainer';
import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import { CustomButton } from '~/components/CustomButton';
import { useMemo, useState } from 'react';
import useAttributes from '~/hooks/useAttribute';
import { formatTimestamp } from '~/utils';
import AddModal from './AddModal';
import MultiSelectPanel from '~/components/MultiSelectPanel';
import { useCheckboxItems, usePagination } from '~/hooks';
import { transform } from '~/utils';
import CopyableElement from './CopyableElement';
import PaginationHandle from '~/components/PaginationHandle';

const cx = classNames.bind(styles);

function Attributes({ deviceInfo }) {
  const [scope, setScope] = useState('CLIENT_SCOPE');
  const { attributes, handleAddAttribute, handleDeleteAttributes } = useAttributes({
    entityType: deviceInfo.id.entityType,
    entityId: deviceInfo.id.id,
    scope,
  });
  const { totalPages, currentPage, setCurrentPage, startIndex, endIndex } = usePagination(
    attributes ? attributes.length : 0,
    10,
  );
  console.log(totalPages);
  const { checkedItems, setCheckedItems, handleCheckboxChange, checkAll, setCheckAll, handleCheckAll } =
    useCheckboxItems(attributes ? attributes?.length : 0);
  // const [showAddModal, setShowAddModal] = useState(false);
  const [isVisible, setVisible] = useState(false);
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
        width: '30%',
      },
      {
        title: 'value',
        component: <span>Value</span>,
        width: '30%',
      },
    ];
  }, [checkAll, handleCheckAll]);

  const getScopeName = () => {
    const firstWord = scope.toLowerCase().replace('_scope', '');
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  };

  const handleDeleteItems = async () => {
    await handleDeleteAttributes({ keys: checkedItems.map((index) => attributes[index].key).join(',') });
    setCheckAll(false);
    setCheckedItems([]);
  };

  return (
    <>
      <CustomContainer style={{ maxHeight: '90%', overflow: 'auto' }}>
        <Stack direction="horizontal">
          {checkedItems?.length === 0 ? (
            <>
              <span className={cx('header-title')}>{getScopeName()} attributes</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>Entity attributes scope</span>
                <Form.Select className={cx('select')} onChange={(e) => setScope(e.target.value)}>
                  <option value="CLIENT_SCOPE">Client attributes</option>
                  <option value="SERVER_SCOPE">Server attributes</option>
                  <option value="SHARED_SCOPE">Shared attributes</option>
                </Form.Select>
              </div>
              <Stack direction="horizontal" className="ms-auto" gap={3}>
                {scope !== 'CLIENT_SCOPE' && (
                  <CustomButton.AddButton className={cx('header-icon')} onClick={() => setVisible(true)} />
                )}
                <CustomButton.SearchButton className={cx('header-icon')} />
              </Stack>
            </>
          ) : (
            <MultiSelectPanel
              title={`${checkedItems?.length} ${checkedItems?.length === 1 ? 'attribute' : 'attributes'} selected`}
              onDeleteItems={handleDeleteItems}
            />
          )}
        </Stack>

        <Table style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {elements.map((element) => (
              <col style={{ width: element.width }}></col>
            ))}
          </colgroup>
          <thead>
            {elements.map((element, index) => {
              return (
                <th key={index} style={{ width: element.width }}>
                  {element.component}
                </th>
              );
            })}
          </thead>
          <tbody>
            {attributes &&
              attributes?.length > 0 &&
              attributes.map((attribute, index) => {
                console.log('attribute: ' + attribute);
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
                      <CopyableElement value={transform(attribute?.key)} />
                    </td>
                    <td>
                      <CopyableElement value={transform(attribute?.value)} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        <AddModal
          deviceInfo={deviceInfo}
          scope={scope}
          title="attributes"
          onSubmit={async (values) => {
            const telemetry = {
              [values.key]: values.value,
            };
            const telemetryObject = {
              entityType: deviceInfo.id.entityType,
              entityId: deviceInfo.id.id,
              telemetry,
              scope,
            };
            handleAddAttribute(telemetryObject);
            setVisible(false);
            // handleAddAttribute(telemetryObject);
          }}
          isVisible={isVisible}
          setVisible={setVisible}
        />
      </CustomContainer>
      <PaginationHandle
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        hr={false}
        paginationStyle={{ marginRight: '10px' }}
        maxNum={totalPages}
        show={attributes && attributes.length > 0}
      />
    </>
  );
}

export default Attributes;
