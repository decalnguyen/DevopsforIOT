import { useNavigate } from 'react-router-dom';
import { Button, Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Footer from './Footer';
import About from './About';
import CaseStudies from './CaseStudies';
import ServicePage from './ServicePage';
const cx = classNames.bind(styles);
function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div className={cx('wrapper')}>
        <div className={` ${cx('container')}`}>
          <div className="w-90 h-90">
            <img
              className={cx('logoImage')}
              src="https://plus.unsplash.com/premium_photo-1688678097473-2ce11d23e30c?q=80&w=1270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="logo"
            />
          </div>
          <div className="d-flex flex-row justify-content-evenly">
            <Nav.Link className={cx('navItem')} href="#service">
              Service
            </Nav.Link>
            <Nav.Link className={cx('navItem')} href="#aboutus">
              About us
            </Nav.Link>
            <Nav.Link className={cx('navItem')} href="#casestudies">
              Case Studies
            </Nav.Link>
          </div>
          <div class={cx('ButtonWrapper')}>
            <Button className={cx('button')} onClick={() => navigate('/auth')}>
              Click here to redirect to login
            </Button>
          </div>
        </div>
      </div>
      <div className={`d-flex flex-row ${cx('page1')}`}>
        <div className={cx('Slogan')}>
          <p className={`fw-normal ${cx('span2')}`}>
            Great <span className={`fw-bold ${cx('span1')}`}>Product</span> is{' '}
            <span className={`fw-bold ${cx('span2')}`}>
              <br></br> built by great
            </span>
            <span className={`fw-bold ${cx('span1')}`}> teams</span>
          </p>
          <p className={cx('p1')}>
            We help build and manage a team of world-class developers to bring<br></br> your vision to life
          </p>
        </div>
        <img
          className={`${cx('image1')}`}
          src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
      </div>
      <ServicePage></ServicePage>
      <About></About>
      <CaseStudies></CaseStudies>
      <Footer></Footer>
    </div>
  );
}
export default Home;
