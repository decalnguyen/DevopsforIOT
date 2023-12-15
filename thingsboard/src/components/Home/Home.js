import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Home() {
  const navigate = useNavigate();

  return <Button onClick={() => navigate('/auth')}>Click here to redirect to login</Button>;
}

export default Home;
