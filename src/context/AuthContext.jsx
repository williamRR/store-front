import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../axios.config';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const storedIdToken = localStorage.getItem('idToken');
    if (storedIdToken) {
      const userInfo = decodeToken(storedIdToken);
      if (userInfo && new Date() < new Date(userInfo.exp * 1000)) {
        setAccessToken(localStorage.getItem('accessToken'));
        setUserData(userInfo);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
  }, []);

  const login = async (formData) => {
    try {
      const url = `${urlBase}login`;
      const { data } = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { user, accessToken, idToken, refreshToken } = data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUserData(user);
      setAccessToken(accessToken);
      setIsAuthenticated(true);

      toast.success('Bienvenido ' + user.email);
    } catch (error) {
      let message;
      switch (error.response?.status) {
        case 401:
          message = 'Correo o contraseña incorrectos.';
          break;
        default:
          message = 'Error: ' + error.message;
      }
      toast.error('Error: ' + message);
      throw new Error(message);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const url = `${urlBase}refresh-token`;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const { data } = await apiClient.post(url, { refreshToken });

      const { accessToken, idToken } = data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);

      setAccessToken(accessToken);
      setUserData(decodeToken(idToken));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    }
  };

  useEffect(() => {
    if (accessToken) {
      const decodedToken = decodeToken(accessToken);
      const tokenExpirationTime = decodedToken?.exp * 1000 - Date.now() - 60000; // 1 minuto antes de expirar

      if (tokenExpirationTime > 0) {
        const timer = setTimeout(refreshAccessToken, tokenExpirationTime);
        return () => clearTimeout(timer);
      } else {
        refreshAccessToken();
      }
    }
  }, [accessToken]);

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

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setAccessToken(null);
    setUserData({});
    toast.info('Sesión cerrada.');
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
