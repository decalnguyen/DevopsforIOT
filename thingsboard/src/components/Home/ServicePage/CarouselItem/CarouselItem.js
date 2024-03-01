import classNames from 'classnames/bind';
import styles from './CarouselItem.module.scss';
import { Container, Row } from 'react-bootstrap';
const cx = classNames.bind(styles);
export default function CarouselImage(props) {
  return (
    <Container>
      <Row>
        <img className={cx('image')} src={props.image} alt="content" />
      </Row>
    </Container>
  );
}
