import DataExplorer from '~/components/DataExplorer';
import Header from './Header';
import Sidebar from '../Sidebar';
import { Col, Row } from 'react-bootstrap';

function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <Row style={{ marginTop: '100px', display: 'flex', flexDirection: 'row', height: '650px' }}>
        <div className="col-2 flex-row">
          <Sidebar />
        </div>
        <div className="col-10" style={{ marginLeft: '-5px' }}>
          {children}
        </div>
      </Row>
      {/* <DataExplorer /> */}
    </div>
  );
}

export default MainLayout;
