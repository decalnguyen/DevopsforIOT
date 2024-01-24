import classNames from 'classnames/bind';
import styles from './ServicePage.module.scss';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row } from 'react-bootstrap';
import CarouselItem from './CarouselItem';
const cx = classNames.bind(styles);
export default function ServicePage() {
  return (
    <section id="service" className={`d-flex ${cx('container')}`}>
      <Container>
        <Row className={cx('rowHeader')}>
          <h2>Service we offer</h2>
        </Row>
        <Row className={cx('rowBody')}>
          <Carousel className={cx('carousel')}>
            <Carousel.Item>
              <CarouselItem image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></CarouselItem>
              <Carousel.Caption>
                <h3 className={cx('header')}>Web Design & Development</h3>
                <p className={cx('content')}>
                  A Website is an extension of yourself and we can help you to express it properly. Your website is your
                  number one marketing asset because we live in a digital age.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <CarouselItem image="https://images.unsplash.com/photo-1518349619113-03114f06ac3a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></CarouselItem>
              <Carousel.Caption>
                <h3 className={cx('header')}>Software Testing Service</h3>
                <p className={cx('content')}>
                  A Website is an extension of yourself and we can help you to express it properly. Your website is your
                  number one marketing asset because we live in a digital age.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <CarouselItem image="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></CarouselItem>
              <Carousel.Caption>
                <h3 className={cx('header')}>Mobile App Development</h3>
                <p className={cx('content')}>
                  A Website is an extension of yourself and we can help you to express it properly. Your website is your
                  number one marketing asset because we live in a digital age.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Row>
      </Container>
    </section>
  );
}
