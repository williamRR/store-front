// src/axiosConfig.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Usa la base URL de tu API
});

// Interceptor de respuesta para manejar el token expirado
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response.data.error === 'Token expired'
    ) {
      try {
        const { data } = await apiClient.post(
          `/auth/store/${import.meta.env.VITE_STORE_ID}/refresh-token`,
          {
            refreshToken: localStorage.getItem('refreshToken'),
          },
        );

        // Guardar los nuevos tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('idToken', data.idToken);

        // Actualiza el header Authorization y reintenta la solicitud original
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Deslogear al usuario o redirigir a la página de login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
