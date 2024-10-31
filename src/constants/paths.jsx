import CategoriesSection from '../components/CategoriesSection';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ResetPassword from '../pages/Reset-Password';
import Verify from '../pages/Verify';

export const paths = [
  {
    id: 'landing',
    path: '/',
    name: 'Landing',
    accesible: 'all',
    component: <CategoriesSection />,
  },
  {
    id: 'Verify',
    path: '/verify/:verifyToken',
    name: 'Verify',
    component: <Verify />,
    accesible: 'all',
  },
  {
    id: 'login',
    path: '/login',
    name: 'login',
    component: <Login />,
    accesible: 'all',
  },
  {
    id: 'register',
    path: '/register',
    name: 'Register',
    component: <Register />,
    accesible: 'all',
  },
  {
    id: 'reset-password',
    path: '/reset-password',
    name: 'Reset Password',
    component: <ResetPassword />,
    accesible: 'all',
  },
  {
    id: '404',
    path: '*',
    name: '404',
    accessible: 'all',
    showInSidebar: false,
    crud: false,
    component: <h1>404 Not Found</h1>,
  },
];
