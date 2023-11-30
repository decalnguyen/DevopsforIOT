import { useState } from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Input({ Icon, label, placeholder = 'Enter something...', onChange, ...props }) {
  const [text, setText] = useState('');

  return (
    <div className={cx('wrapper')} {...props}>
      <input
        value={text}
        className={cx('input')}
        placeholder={placeholder}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
      />
      <div className={cx('icon')}>{Icon}</div>
    </div>
  );
}

export default Input;
