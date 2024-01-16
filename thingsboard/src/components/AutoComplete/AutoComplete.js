import { useRef } from 'react';
import { useOutsideAlerter } from '~/hooks';

import styles from './AutoComplete.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function AutoComplete({ show, field, suggestions, onHide, onItemClick }) {
  const autoCompleteRef = useRef(null);
  useOutsideAlerter(autoCompleteRef, onHide);
  return (
    <div style={{ position: 'relative' }} ref={autoCompleteRef}>
      {show && suggestions && suggestions?.length > 0 && (
        <div className={cx('wrapper')}>
          {suggestions.map((fruit, index) => (
            <div
              className={cx('item')}
              key={index}
              style={{ width: '100%', padding: '16px' }}
              onClick={() => {
                onItemClick((values) => {
                  return { ...values, [field]: suggestions[index] };
                });
                onHide();
              }}
            >
              {fruit}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutoComplete;
