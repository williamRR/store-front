import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  signInWithPopup,
} from 'firebase/auth';
import axios from 'axios';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      await logout(); // Desautenticar si no está verificado
      throw new Error('Verifica tu correo electrónico para continuar.');
    }
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role || 'Customer'; // Rol predeterminado si no hay claim asignado
    console.log('Role:', role);
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/stores/${
        import.meta.env.VITE_STORE_ID
      }/${role}/${user.email}`,
    );

    const { _id = '', addresses = [] } = data;

    const userData = {
      _id,
      addresses,
      uid: user.uid,
      email: user.email,
      role,
      emailVerified: user.emailVerified,
      idToken: idTokenResult.token,
      refreshToken: user.refreshToken,
    };

    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Persistencia de usuario
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idTokenResult = await user.getIdTokenResult(); // Obtén el token y el rol
      const role = idTokenResult.claims.role || 'Customer'; // Rol predeterminado

      // Llama al endpoint de backend con el token de Google para obtener más datos
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/${role}/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${idTokenResult.token}`,
          },
        },
      );

      const { _id = '', addresses = [] } = data; // Datos adicionales del backend

      // Crea el objeto de usuario con los datos de Firebase y el backend
      const userData = {
        _id,
        addresses,
        uid: user.uid,
        email: user.email,
        role,
        emailVerified: user.emailVerified,
        idToken: idTokenResult.token,
        refreshToken: user.refreshToken,
      };

      setCurrentUser(userData); // Guarda el usuario en el estado
      localStorage.setItem('user', JSON.stringify(userData)); // Persistencia de usuario en localStorage

      console.log('Usuario autenticado y registrado exitosamente');
    } catch (error) {
      console.error('Error en la autenticación o registro:', error);
    }
  };

  // Registro de usuario
  const register = async (email, password) => {
    try {
      // Registrar usuario en el backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/store/${
          import.meta.env.VITE_STORE_ID
        }/create-user`,
        {
          password,
          email,
        },
      );

      // Iniciar sesión para enviar el correo de verificación
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Enviar el correo de verificación
      await sendEmailVerification(user);

      console.log('Correo de verificación enviado');
    } catch (error) {
      console.log(error);
      setError(error.message);
      throw error;
    }
  };

  // Recuperación de contraseña
  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error enviando correo de recuperación:', error);
      setError(error.message);
      throw new Error('No se pudo enviar el correo de recuperación.');
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      localStorage.removeItem('user');
      setCurrentUser({});
      signOut(auth)
        .then(() => {
          console.log('Sesión cerrada');
        })
        .catch((error) => {
          console.log(error);
        });
      setCurrentUser(null);

      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      logout();
    }
  }, [currentUser]);
  // Mantener sesión y recuperar usuario de LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setCurrentUser(JSON.parse(storedUser));

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const role = idTokenResult.claims.role || 'Customer';

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/stores/${
            import.meta.env.VITE_STORE_ID
          }/${role}/${user.email}`,
        );

        const { _id, addresses } = data;

        setCurrentUser({
          _id,
          addresses,
          uid: user.uid,
          email: user.email,
          role,
          emailVerified: user.emailVerified,
          idToken: idTokenResult.token,
          refreshToken: user.refreshToken,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    setLoading(false);
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    error,
    register,
    login,
    logout,
    googleLogin,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
