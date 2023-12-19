import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AutoComplete from '~/components/AutoComplete';

function Home() {
  const navigate = useNavigate();

  return <Button onClick={() => navigate('/auth')}>Click here to redirect to login</Button>;
  // return <AutoComplete />;
}

export default Home;
