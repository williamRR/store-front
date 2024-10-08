import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import axios from 'axios';

const firebaseConfig = {
  apiKey: 'AIzaSyCn5ZgUFZhmVmSNcHSK8sxq4jBIKGD777w',
  authDomain: 'ecommerce-2e3dc.firebaseapp.com',
  projectId: 'ecommerce-2e3dc',
  storageBucket: 'ecommerce-2e3dc.appspot.com',
  messagingSenderId: '916723138356',
  appId: '1:916723138356:web:7837bdedadc5e02b252f61',
  measurementId: 'G-3WMDPN562N',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const AuthContext = createContext();

// Hook para usar el AuthContext en otros componentes
export const useAuth = () => useContext(AuthContext);

// AuthProvider que envuelve tu aplicación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Registrar usuario
  const register = async (email, password) => {
    try {
      // Paso 1: Registrar el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Paso 2: Enviar el correo de verificación (opcional)
      await sendEmailVerification(user);

      // Paso 3: Hacer una solicitud a tu backend para asignar el rol y registrar en tu base de datos
      const newUser = await axios.post(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/register`,
        {
          uid: user.uid, // Usamos el UID generado por Firebase
          email: user.email,
          role: 'Customer', // Rol que quieres asignar
        },
      );

      return newUser; // Retorna la respuesta del backend
    } catch (error) {
      console.log(error);
      setError(error.message);
      throw error;
    }
  };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Obtener los custom claims, incluyendo el rol
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      // Verificar si el correo está verificado
      if (!user.emailVerified) {
        throw new Error(
          'Por favor, verifica tu correo electrónico para continuar.',
        );
      }

      // Obtener el ID token del usuario para futuras autenticaciones
      const idToken = await user.getIdToken();
      const url = `${import.meta.env.VITE_API_URL}/stores/${
        import.meta.env.VITE_STORE_ID
      }/users/${user.email}`;
      const { data } = await axios.get(url);
      console.log(data);
      // Crear el objeto a almacenar con los datos importantes
      const userInfo = {
        _id: data._id,
        email: user.email,
        uid: user.uid,
        role: role, // Añadir el rol del usuario
        emailVerified: user.emailVerified,
        idToken,
        refreshToken: user.refreshToken, // Este es el refresh token que puedes usar para renovar el token de acceso
      };

      // Guardar la información del usuario en Local Storage o Session Storage
      localStorage.setItem('user', JSON.stringify(userInfo)); // O sessionStorage según tus necesidades
      setIsAuthenticated(true);
      setCurrentUser(userInfo); // Establecer el estado del usuario actual
      return userInfo; // Devolver los datos almacenados
    } catch (error) {
      // Asegúrate de manejar el error adecuadamente en tu aplicación
      console.error('Error iniciando sesión:', error.message);
      throw new Error('No se pudo iniciar sesión. Verifica tus credenciales.');
    }
  };

  // Restablecer contraseña
  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email); // Llamada correcta en Firebase v9
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      setIsAuthenticated(false);
      await signOut(auth); // Llamada correcta en Firebase v9
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Verificar si el usuario está autenticado y establecer el estado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // El valor que se expone al resto de la aplicación
  const value = {
    currentUser,
    error,
    register,
    isAuthenticated,

    login,
    forgotPassword,
    sendEmailVerification,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
