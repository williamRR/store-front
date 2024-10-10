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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Guardar los datos del usuario en LocalStorage después de iniciar sesión o registrarse
  // const storeUserInLocalStorage = (user) => {
  //   localStorage.setItem('user', JSON.stringify(user));
  // };

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        throw new Error('Verifica tu correo electrónico para continuar.');
      }
      // Obtener los custom claims del usuario (incluye el rol)
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role || 'Customer'; // Default a 'Customer' si no hay rol asignado
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/users/${user.email}`,
      );
      const { _id, addresses } = data;
      // Establecer el usuario en el estado local con el rol
      setCurrentUser({
        _id,
        addresses,
        uid: user.uid,
        email: user.email,
        role: role,
        emailVerified: user.emailVerified,
        idToken: idTokenResult.token,
        refreshToken: user.refreshToken,
      });
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      throw new Error('No se pudo iniciar sesión. Verifica tus credenciales.');
    }
  };

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
        `
        ${import.meta.env.VITE_API_URL}/stores/${
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

  // Cerrar sesión
  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem('user'); // Eliminar los datos del LocalStorage
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  // Cargar usuario desde LocalStorage cuando se inicializa el AuthProvider
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Obtener los claims del usuario actual
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || 'Customer';
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/stores/${
            import.meta.env.VITE_STORE_ID
          }/users/${user.email}`,
        );
        const { _id, addresses } = data;
        // Establecer el estado del usuario actual con los claims
        setCurrentUser({
          _id,
          addresses,
          uid: user.uid,
          email: user.email,
          role: role,
          emailVerified: user.emailVerified,
          idToken: idTokenResult.token,
          refreshToken: user.refreshToken,
        });
      } else {
        setCurrentUser(null);
      }
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
    logout,
  };

  return (
    console.log({ currentUser }),
    console.count(),
    (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    )
  );
};
