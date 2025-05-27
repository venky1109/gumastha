import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(() => token ? jwtDecode(token) : null);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
