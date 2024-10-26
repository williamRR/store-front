import { createContext, useContext, useState, useEffect } from 'react';
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

    const { _id, addresses } = data;

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

  // Registro de usuario
  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await sendEmailVerification(user); // Enviar correo de verificación

      // Registrar usuario en el backend y asignar rol
      await axios.post(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/register`,
        {
          uid: user.uid,
          email: user.email,
          role: 'Customer', // Rol inicial para el usuario registrado
        },
      );
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
    forgotPassword,
  };

  return (
    console.log(value),
    (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>)
  );
};
