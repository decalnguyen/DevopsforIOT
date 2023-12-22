import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('');
  const [devicesInfo, setDevicesInfo] = useState([]);
  const [token, setToken] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const value = {
    isAuthenticated,
    setIsAuthenticated,
    username,
    setUsername,
    platform,
    setPlatform,
    token,
    setToken,
    devicesInfo,
    setDevicesInfo,
    showLoadingModal,
    setShowLoadingModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
