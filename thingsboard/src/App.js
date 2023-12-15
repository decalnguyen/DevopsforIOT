import { MainLayout, LoginLayout } from './layouts';
import Home from '~/components/Home';
import { routes } from './routes';
import { useAuth } from '~/contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react';
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => {
          const Page = route.component;
          const Layout = route.layout === null ? Fragment : route.layout;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
