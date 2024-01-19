import styles from './CaseStudies.module.scss';
import classNames from 'classnames/bind';
import CaseStudiesItem from './CaseStudiesItem';
import { Container, Row } from 'react-bootstrap';
import { CaseStudiesList } from './CaseStudiesList';
const cx = classNames.bind(styles);

export default function CaseStudies() {
  return (
    <section id="casestudies" className={`${cx('section')}`}>
      <Container>
        <Row className={`d-flex align-content-center ${cx('title')}`}>
          <h2>Case Studies</h2>
        </Row>
        {CaseStudiesList.map((item, index) => (
          <CaseStudiesItem
            key={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
          ></CaseStudiesItem>
        ))}
        ;
      </Container>
    </section>
  );
}
