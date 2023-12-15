import DataExplorer from '~/components/DataExplorer';
import Header from './Header';
import Sidebar from '../Sidebar';
import { Col, Row } from 'react-bootstrap';
import { DevicesPage } from '../pages';

function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <Row>
        <Col className="col-2 flex-row">
          <Sidebar />
        </Col>
        <Col>{children}</Col>
      </Row>
      {/* <DataExplorer /> */}
    </div>
  );
}

export default MainLayout;
