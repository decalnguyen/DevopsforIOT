import CustomSpinner from '../CustomSpinner';
import styles from './Modal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function LoadingModal({ show }) {
  return show ? (
    <div className={cx('loading-backdrop')}>
      <CustomSpinner />
      <p>Loading...</p>
    </div>
  ) : null;
}

export default LoadingModal;
