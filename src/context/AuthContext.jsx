import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../axios.config';

const AuthContext = createContext();

function decodeToken(token) {
  if (!token) return null; // Ensure token exists
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
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
      console.log('userInfo', userInfo);
      if (userInfo && new Date() < new Date(userInfo.exp * 1000)) {
        setAccessToken(localStorage.getItem('accessToken'));
        setUserData(userInfo);
        setIsAuthenticated(true);
      } else {
        logout(); // Automatically log out if token is invalid/expired
      }
    } else {
      // setLoading(false);
    }
  }, []);

  const login = async (formData) => {
    try {
      const url = `${urlBase}login`;
      const { data } = await apiClient.post(url, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { accessToken, idToken, refreshToken } = data;
      const user = decodeToken(idToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUserData(user);
      setAccessToken(accessToken);
      setIsAuthenticated(true);
      toast.success(`Bienvenido ${user.user.name}`);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const url = `${urlBase}refresh-token`;
      const { data } = await apiClient.post(url, { refreshToken });

      const { accessToken, idToken } = data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);

      setAccessToken(accessToken);
      setUserData(decodeToken(idToken));
      setIsAuthenticated(true);
    } catch (error) {
      handleAuthError(error, true);
    }
  };

  useEffect(() => {
    if (accessToken) {
      const decodedToken = decodeToken(accessToken);
      const tokenExpirationTime = decodedToken?.exp * 1000 - Date.now() - 60000;

      if (tokenExpirationTime > 0) {
        const timer = setTimeout(refreshAccessToken, tokenExpirationTime);
        return () => clearTimeout(timer);
      } else {
        refreshAccessToken(); // Immediately refresh if token expired
      }
    }
  }, [accessToken]);

  const register = async (formData) => {
    try {
      const url = `${urlBase}register`;
      await apiClient.post(url, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return {
        success: true,
        message: 'Registro exitoso. Ahora puede iniciar sesión.',
      };
    } catch (error) {
      return { success: false, message: `Error: ${error.message}` };
    }
  };

  const forgotPassword = async (formData) => {
    try {
      const url = `${urlBase}forgot-password`;
      await apiClient.post(url, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Correo de recuperación enviado.');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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

  const handleAuthError = (error) => {
    console.error('Authentication error:', error);
    switch (error.response?.status) {
      case 401:
        toast.error('Credenciales inválidas.');
        break;
      case 403:
        toast.error('Acceso denegado.');
        break;
      default:
        toast.error('Error de autenticación.');
        break;
    }
    throw error;
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
