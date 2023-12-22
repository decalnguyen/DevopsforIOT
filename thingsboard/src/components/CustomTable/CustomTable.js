import { Form, Table } from 'react-bootstrap';

import styles from './CustomTable.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CustomTable({ data, columns }) {
  return (
    <Table striped hover style={{ fontSize: '1.4rem' }}>
      <thead>
        <tr style={{ padding: '4px' }}>
          {columns.map((column, index) => {
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
        {data.map((value, out_index) => {
          Object.values(value).map((piece, index) => {
            return (
              <tr>
                <td className={cx('col-padding')}>{piece}</td>
              </tr>
            );
          });
        })}
      </tbody>
    </Table>
  );
}

export default CustomTable;
