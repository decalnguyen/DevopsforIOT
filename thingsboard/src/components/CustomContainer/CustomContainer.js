import { Container } from 'react-bootstrap';

function CustomerContainer({ children }) {
  return <Container style={{ height: '100%', border: '1px solid #ccc', marginTop: '16px' }}>{children}</Container>;
}

export default CustomerContainer;
