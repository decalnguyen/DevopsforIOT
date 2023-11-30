import { MainLayout, LoginLayout } from './layouts';
import { useAuth } from '~/contexts/AuthContext';
function App() {
  const { isAuthenticated } = useAuth();

  return <div className="App">{isAuthenticated ? <MainLayout /> : <LoginLayout />}</div>;
}

export default App;
