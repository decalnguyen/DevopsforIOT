import { Badge, Button, Col, Form, Row, Table } from 'react-bootstrap';
import { formatTimestamp } from '~/utils';

import styles from './DevicesPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DevicesTable({ devicesInfo, checkBoxHandler, handleDeleteDevice, setShowCanvas }) {
  const columnsInfo = [
    {
      width: '3%',
    },
    {
      name: 'Created time',
      width: '15%',
    },
    {
      name: 'Name',
      width: '8%',
    },
    {
      name: 'Device Profile',
      width: '10%',
    },
    {
      name: 'Label',
      width: '8%',
    },
    {
      name: 'State',
      width: '6%',
    },
    {
      name: 'Customer name',
      width: '12%',
    },
    {
      name: 'Group',
      width: '8%',
    },
    {
      name: 'Is Gateway',
      width: '12%',
    },
  ];
  const { checkedItems, setCheckedItems, handleCheckboxChange, checkAll, setCheckAll, handleCheckAll } =
    checkBoxHandler;

  return (
    <Table striped hover style={{ fontSize: '1.4rem' }}>
      <thead>
        <tr style={{ padding: '4px 4px' }}>
          {columnsInfo.map((column, index) => {
            if (index === 0) {
              return (
                <th style={{ width: column.width }} className={cx('col-padding')}>
                  <Form.Check type="checkbox" id={index} checked={checkAll} onChange={() => handleCheckAll()} />
                </th>
              );
            } else {
              return (
                <th style={{ width: column.width }} className={cx('col-padding')}>
                  {column.name}
                </th>
              );
            }
          })}
        </tr>
      </thead>
      <tbody>
        {devicesInfo &&
          devicesInfo.length > 0 &&
          devicesInfo.map((device, index) => {
            return (
              <tr style={{ cursor: 'pointer' }} onClick={() => setShowCanvas({ index, show: true })}>
                <td className={cx('col-padding')}>
                  <Form.Check
                    type="checkbox"
                    key={index}
                    onClick={(e) => e.stopPropagation()}
                    checked={checkedItems.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td className={cx('col-padding')}>{formatTimestamp(device.createdTime)}</td>
                <td className={cx('col-padding')}>{device.name}</td>
                <td className={cx('col-padding')}>{device.type}</td>
                <td className={cx('col-padding')}>{device.label}</td>
                <td className={cx('col-padding')}>
                  <Badge pill bg="danger">
                    {device.active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className={cx('col-padding')}></td>
                <td className={cx('col-padding')}>
                  {device.groups.map((group) => (
                    <Badge pill bg="secondary">
                      {group.name}
                    </Badge>
                  ))}
                </td>
                <td className={cx('col-padding')}>
                  <Row>
                    <Form.Check type="checkbox" id="default" className="col-4" />
                    <Button variant="pill" className="col-3">
                      <i class="bi bi-bag-plus-fill" style={{ fontSize: '1.4rem' }}></i>
                    </Button>
                    <Button variant="pill" className="col-3" onClick={() => handleDeleteDevice(index)}>
                      <i class="bi bi-trash-fill" style={{ fontSize: '1.4rem' }}></i>
                    </Button>
                  </Row>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}

export default DevicesTable;
