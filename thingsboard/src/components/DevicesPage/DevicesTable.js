import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { formatTimestamp } from '~/utils';

import styles from './DevicesPage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function DevicesTable({ devicesInfo, handleDeleteDevice }) {
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

  return (
    <Table stripped hover style={{ fontSize: '1.4rem' }}>
      <thead>
        <tr style={{ padding: '4px 4px' }}>
          {columnsInfo.map((column, index) => {
            if (index === 0) {
              return (
                <th style={{ width: column.width }} className={cx('col-padding')}>
                  <Form.Check type="checkbox" id={index} />
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
        {devicesInfo.map((device, index) => {
          return (
            <tr style={{ cursor: 'pointer' }}>
              <td className={cx('col-padding')}>
                <Form.Check type="checkbox" id="default" />
              </td>
              <td className={cx('col-padding')}>{formatTimestamp(device.createdTime)}</td>
              <td className={cx('col-padding')}>{device.name}</td>
              <td className={cx('col-padding')}>{device.type}</td>
              <td className={cx('col-padding')}>{device.label}</td>
              <td className={cx('col-padding')}>{device.active ? 'Active' : 'Inactive'}</td>
              <td className={cx('col-padding')}></td>
              <td className={cx('col-padding')}>{device.groups.map((group) => group.name)}</td>
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
