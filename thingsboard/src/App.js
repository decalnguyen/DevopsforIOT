import { useAuth } from './contexts/AuthContext';
import { privateRoutes, publicRoutes } from './routes';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';
import { LoadingModal } from './components/Modal';
import { useLoading } from './contexts';

function App() {
  const { isAuthenticated } = useAuth();
  const { loading, setLoading } = useLoading();

  return (
    <div style={{ height: '100px' }}>
      <Routes>
        {publicRoutes.map((route, index) => {
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
        {privateRoutes.map((route, index) => {
          const Page = route.component;
          const Layout = route.layout === null ? Fragment : route.layout;

          return (
            <Route
              isAuthenticated={isAuthenticated}
              key={index}
              path={route.path}
              element={
                isAuthenticated ? (
                  <Layout>
                    <Page />
                  </Layout>
                ) : (
                  <Navigate to="/auth"></Navigate>
                )
              }
            />
          );
        })}
      </Routes>

      <ToastContainer
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <LoadingModal show={loading} />
    </div>
  );
}

export default App;
