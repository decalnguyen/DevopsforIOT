import classNames from 'classnames/bind';
import styles from './LoginForm.module.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { Col, Row, Form, Button, FloatingLabel, Nav, Container } from 'react-bootstrap';
import { StatusModal } from '../Modal';
import { authRequest } from '~/services/requests';
const cx = classNames.bind(styles);

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [_platform, set_Platform] = useState('');
  const { setIsAuthenticated, setPlatform } = useAuth();
  const { authenticate } = authRequest();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { token, refreshToken } = await authenticate({ username, password, platform: _platform });
    if (token) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('platform', _platform);
      localStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);
      setPlatform(_platform);
      navigate('/devices');
    } else {
      setShowModal(true);
      setUsername('');
      setPassword('');
      setPlatform('');
    }
  };
  return (
    <Container style={{ marginTop: '180px' }}>
      <Row className={`justify-content-center mt-5 ${cx('wrapper')}`}>
        <Col xs={12} md={10} style={{ paddingBottom: '32px' }}>
          <Nav fill variant="pills" activeKey={'Sign In'} defaultActiveKey="/home" className={cx('nav')}>
            <Nav.Item>
              <Nav.Link href="/home" eventKey={'Sign In'}>
                Sign In
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/home" eventKey={'Sign Up'}>
                Sign Up
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Form className={cx('form')} onSubmit={(e) => handleSubmit(e)}>
            <Form.Group controlId="formBasicEmail" className={cx('input')}>
              <FloatingLabel controlId="floatingEmail" label="Email" className={cx('input')}>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ height: '50px', fontSize: '1.5rem', lineHeight: '1rem' }}
                  required
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <FloatingLabel controlId="floatingPassword" label="Password" className={cx('input')}>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ height: '50px', fontSize: '1.5rem' }}
                />
                <Form.Text id="passwordHelpBlock" muted>
                  Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces,
                  special characters, or emoji.
                </Form.Text>
              </FloatingLabel>
            </Form.Group>

            <Form.Select size="lg" className={cx('select')} onChange={(e) => set_Platform(e.target.value)} required>
              <option value="">Choose Platform</option>
              <option value="thingsboard.cloud">thingsboard.cloud</option>
              <option value="demo.thingsboard.io">demo.thingsboard.io</option>
            </Form.Select>

            <Button variant="outline-success" type="submit" block className={cx('submit-btn')}>
              Login
            </Button>

            <StatusModal
              show={showModal}
              titleText="Authentication failed"
              bodyText="Your email/password/platform is not valid. Please try again"
              onHide={() => setShowModal(false)}
              style={{ fontSize: '1.6rem' }}
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
