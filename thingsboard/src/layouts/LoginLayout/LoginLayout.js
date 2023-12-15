import Login from '~/components/Login';
import { Row, Col, Container } from 'react-bootstrap';
import styles from './LoginLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function LoginLayout() {
  return (
    <Row className={cx('wrapper')}>
      <Col className="col-4"></Col>
      <Col className="col-4 me-auto">
        <Login />
      </Col>
    </Row>
  );
}

export default LoginLayout;
