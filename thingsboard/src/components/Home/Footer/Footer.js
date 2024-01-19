import { Container, Row, Col } from 'react-bootstrap';
import styles from './Footer.module.scss';
import classNames from 'classnames/bind';
import { WindowsIcon } from '~/components/Icon/Icon';
import { FaFacebook, FaInstagram, FaTwitter, FaFacebookMessenger } from 'react-icons/fa';
const cx = classNames.bind(styles);
export default function Footer() {
  return (
    <div className={cx('container')}>
      <Container>
        <Row>
          <Col>
            <WindowsIcon></WindowsIcon>
            <p className={cx('content1')}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.{' '}
            </p>
            <div>
              <ul className={`d-flex flex-row`}>
                <li>
                  <FaFacebook />
                </li>
                <li>
                  <FaInstagram />
                </li>
                <li>
                  <FaTwitter />
                </li>
                <li>
                  <FaFacebookMessenger />
                </li>
              </ul>
            </div>
          </Col>
          <Col className="d-flex flex-column">
            <p className={cx('title')}>Links</p>
            <a href="#Service" className={cx('content')}>
              Service
            </a>
            <a href="#aboutus" className={cx('content')}>
              About us
            </a>
            <a href="#casestudies" className={cx('content')}>
              Case studies
            </a>
          </Col>
          <Col>
            <p className={cx('title')}>Contact us</p>
            <p className={cx('content')}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            <p className={cx('content')}>+841234567890</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
