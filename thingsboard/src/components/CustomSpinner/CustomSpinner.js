import styles from './CustomSpinner.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CustomSpinner() {
  return <div className={cx('loading-spinner')}></div>;
}

export default CustomSpinner;
