import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState('');
  const [token, setToken] = useState('');
  const value = {
    isAuthenticated,
    setIsAuthenticated,
    username,
    setUsername,
    platform,
    setPlatform,
    token,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
