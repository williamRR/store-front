import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { StoreThemeProvider } from './context/StoreThemeContext.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../../store-admin/src/context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import RightSidebar from './components/RightSidebar.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <StoreThemeProvider>
        <CssBaseline />
        <ToastContainer
          position='top-right'
          autoClose={4000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
        <Router>
          <CartProvider>
            <RightSidebar />
            <App />
          </CartProvider>
        </Router>
        {/* </Container> */}
      </StoreThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
