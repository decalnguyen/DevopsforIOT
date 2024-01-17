import styles from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Footer({ children, style }) {
  return (
    <div className={cx('wrapper')} style={style}>
      {children}
    </div>
  );
}

export default Footer;
