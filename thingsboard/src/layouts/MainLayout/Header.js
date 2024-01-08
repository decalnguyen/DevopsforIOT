import { Navbar, Container } from 'react-bootstrap';

import styles from './MainLayout.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import config from '~/config';

const cx = classNames.bind(styles);

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className={cx('header-wrapper')}>
      <Container>
        <Navbar.Brand as={Link} to={config.routes.home}>
          <img
            src={process.env.PUBLIC_URL + '/logo192.png'}
            alt="green stream"
            style={{ width: '50px', height: '50px' }}
          />
          <span style={{ fontSize: '1.7rem', marginLeft: '16px' }}>GreenStream</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav"></Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
