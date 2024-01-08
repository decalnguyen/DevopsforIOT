import { Button, Form, Stack, Table } from 'react-bootstrap';
import CustomContainer from '~/components/CustomContainer';
import global from '~/components/GlobalStyles/GlobalStyles.module.scss';
import styles from './DeviceInfoOffcanvas.module.scss';
import classNames from 'classnames/bind';
import { CustomButton } from '~/components/CustomButton';
import { useMemo, useState } from 'react';
import useAttributes from '~/hooks/useAttribute';
import { formatTimestamp } from '~/utils';
import AddModal from './AddModal';
import MultiSelectPanel from '~/components/MultiSelectPanel';
import { useCheckboxItems } from '~/hooks';

const cx = classNames.bind(styles);

function Attributes({ deviceInfo }) {
  const [scope, setScope] = useState('CLIENT_SCOPE');
  const { attributes, handleAddAttribute, handleDeleteAttributes } = useAttributes({
    entityType: deviceInfo.id.entityType,
    entityId: deviceInfo.id.id,
    scope,
  });
  const { checkedItems, setCheckedItems, handleCheckboxChange, checkAll, setCheckAll, handleCheckAll } =
    useCheckboxItems(attributes ? attributes.length : 0);
  const [showAddModal, setShowAddModal] = useState(false);
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
    <CustomContainer>
      <Stack direction="horizontal">
        {checkedItems.length === 0 ? (
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
                <CustomButton.AddButton className={cx('header-icon')} onClick={() => setShowAddModal(true)} />
              )}
              <CustomButton.SearchButton className={cx('header-icon')} />
            </Stack>
          </>
        ) : (
          <MultiSelectPanel
            title={`${checkedItems.length} ${checkedItems.length === 1 ? 'attribute' : 'attributes'} selected`}
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
            attributes.length > 0 &&
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
                  <td>{formatTimestamp(attribute.lastUpdateTs)}</td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      {attribute.key}
                      <CustomButton.CopyButton textToCopy={attribute.key} />
                    </Stack>
                  </td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      <p className={global['text-overflow']}>
                        {typeof attribute.value === 'boolean' ? (attribute.value ? 'true' : 'false') : attribute.value}
                      </p>
                      <CustomButton.CopyButton textToCopy={attribute.value} />
                    </Stack>
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
            setShowAddModal(false);
            // handleAddAttribute(telemetryObject);
          }}
        />
      )}
    </CustomContainer>
  );
}

export default Attributes;
