import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('');
  const [devicesInfo, setDevicesInfo] = useState([]);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const value = {
    isAuthenticated,
    setIsAuthenticated,
    username,
    setUsername,
    platform,
    setPlatform,
    devicesInfo,
    setDevicesInfo,
    showLoadingModal,
    setShowLoadingModal,
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(token ? true : false);
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
