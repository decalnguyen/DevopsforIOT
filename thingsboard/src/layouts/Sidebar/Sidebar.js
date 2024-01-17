import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import './Sidebar.css';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const navItems = [
  { Icon: <i className="bi bi-cpu-fill"></i>, text: 'Devices', to: '/devices' },
  { Icon: <i className="bi bi-grid-fill"></i>, text: 'Dashboard', to: '/dashboard' },
];

const Sidebar = () => {
  const [active, setActive] = useState(0);

  const handleTabSelect = (index) => {
    setActive(index);
  };

  return (
    <Container style={{ backgroundColor: '', width: '100%', height: '100%' }} className={`col-3 ${cx('sidebar')}`}>
      <Nav className="flex-column">
        {navItems.map((item, index) => (
          <Nav.Item
            className={cx('item', { active: index === active })}
            key={index}
            onClick={() => handleTabSelect(index)}
          >
            <Nav.Link as={Link} to={item.to} className="flex-row">
              <span className={cx('icon')}>{item.Icon}</span>
              <span className={cx('text')}> {item.text}</span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Container>
  );
};

export default Sidebar;
