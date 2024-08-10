import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

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
const urlBase = `${import.meta.env.VITE_API_URL}/auth/store/${
  import.meta.env.VITE_STORE_ID
}/`;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken'),
  );

  const login = async (formData) => {
    try {
      const url = `${urlBase}login`;
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

  const register = async (formData) => {
    try {
      const url = `${urlBase}register`;
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return {
        success: true,
        message: 'Registro exitoso. Ahora puede iniciar sesión.',
      };
    } catch (error) {
      return { success: false, message: 'Error: ' + error.message };
    }
  };

  const forgotPassword = async (formData) => {
    try {
      const url = `${urlBase}forgot-password`;
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Correo de recuperación enviado.');
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
      value={{
        userData,
        isAuthenticated,
        login,
        logout,
        register,
        forgotPassword,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
