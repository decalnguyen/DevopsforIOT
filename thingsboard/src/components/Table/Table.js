import { useState } from 'react';
import styles from './Table.module.scss';
import classNames from 'classnames/bind';
import { formatAttributes, formatTimeSeries } from '~/utils/dataUtils';
const cx = classNames.bind(styles);

function Table({ data, type }) {
  const formattedData = type === 'attribute' ? formatAttributes(data) : formatTimeSeries(data);
  const [activeRow, setActiveRow] = useState();
  const handleActive = (index) => {
    setActiveRow(index);
  };

  return (
    <table className={cx('wrapper')}>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {formattedData &&
          formattedData.map((key, index) => {
            return (
              <tr
                key={index}
                onClick={() => handleActive(index)}
                className={index === activeRow ? cx('active-row') : ''}
              >
                <td>{key['key']}</td>
                <td>{key['value']}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default Table;
