import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './CaseStudiesItem.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
export default function CaseStudiesItem(props) {
  return (
    <Container>
      <Row className={cx('Row')}>
        <Col className={`col-6 ${cx('Col')}`}>
          <div>
            <img className={cx('image')} src={props.image} alt=""></img>
          </div>
        </Col>
        <Col className={`col-6 ${cx('container-content')}`}>
          <h3 className={cx('title')}>{props.title}</h3>
          <p className={cx('description')}>{props.description}</p>
        </Col>
      </Row>
    </Container>
  );
}
