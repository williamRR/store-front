import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthProvider>
    <CartProvider>
      <CssBaseline />
      <ToastContainer
        position='bottom-right'
        hideProgressBar={false}
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        theme='light'
      />
      <Router>
        <CartProvider>
          <App />
        </CartProvider>
      </Router>
    </CartProvider>
  </AuthProvider>,
  // </React.StrictMode>,
);
