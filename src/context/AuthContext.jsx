// AuthContext.js
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
import { toast } from 'react-toastify';

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken'),
  );
  const login = async (formData) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/login`;
      const { data } = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsAuthenticated(true);
      const { accessToken, idToken, refreshToken } = data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('refreshToken', refreshToken);
      const userInfo = decodeToken(idToken);
      setUserData(userInfo);
      setAccessToken(accessToken);
      toast.success('Bienvenido ' + userInfo.name);
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('idToken')) {
      const userInfo = decodeToken(localStorage.getItem('idToken'));
      setAccessToken(accessToken);
      setUserData(userInfo);
      setIsAuthenticated(true);
    } else {
      logout();
    }
  }, [localStorage.getItem('idToken')]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setAccessToken(null);
    setUserData({});
  };

  return (
    <AuthContext.Provider
      value={{ userData, isAuthenticated, login, logout, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
