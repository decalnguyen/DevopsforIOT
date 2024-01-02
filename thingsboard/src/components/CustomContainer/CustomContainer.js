import { Container } from 'react-bootstrap';
import styles from './CustomContainer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CustomerContainer({ children, className = '', ...props }) {
  return (
    <Container className={`${cx('wrapper')} ${className}`} {...props}>
      {children}
    </Container>
  );
}

export default CustomerContainer;
