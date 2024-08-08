import React from 'react';
import StoreHeader from './StoreHeader';
import Footer from './Footer';
import { LinearProgress } from '@mui/material';
import { useStoreTheme } from '../context/StoreThemeContext';

const Layout = ({ toggleDrawer, isOpen, children }) => {
  const { loading } = useStoreTheme();

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <StoreHeader toggleDrawer={toggleDrawer} isOpen={isOpen} />
      {/* {loading ? (
        <LinearProgress />
      ) : ( */}
      <main style={{ flex: 1 }}>{children}</main>
      {/* )} */}
      <Footer />
    </div>
  );
};

export default Layout;
