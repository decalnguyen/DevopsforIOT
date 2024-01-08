import { routes } from './routes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div style={{ height: '100px' }}>
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

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
