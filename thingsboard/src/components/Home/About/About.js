import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './About.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
export default function About() {
  return (
    <section id="aboutus">
      <Container className={cx('container')}>
        <Row className={`${cx('Row')}`}>
          <Col className={`Col-6 ${cx('Col')}`}>
            <h2>About us</h2>
            <p>
              We add development capacity to tech teams. Our value isn’t limited to building teams but is equally
              distributed across the project lifecycle. We are a custom software development company that guarantees the
              successful delivery of your project.
            </p>
          </Col>
          <Col className={`Col-6 $cx{'Col'}`}>
            <div className={cx('containerImage')}>
              <img
                src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              ></img>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
