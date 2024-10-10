import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useStoreConfig } from '../context/StoreConfigContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import Cart from './Cart';

const StoreHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const {
    images: { smallLogo },
    theme,
  } = useStoreConfig();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { dispatch } = useCart();

  const handleMenu = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      setAuthOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogin = () => {
    setAuthOpen(true);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/profile'); // Redirige a la página de perfil
    handleClose();
  };

  const toggleCartDrawer = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  return (
    <>
      <AppBar
        position='static'
        elevation={0}
        sx={{
          backgroundColor: theme?.palette?.primary?.main,
        }}
      >
        <Toolbar
          sx={{
            width: '80vw',
            marginLeft: '10vw',
          }}
        >
          <Grid
            container
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              variant='h6'
              onClick={handleLogoClick}
              sx={{ cursor: 'pointer' }}
            >
              <img
                src={smallLogo}
                alt='Logo'
                style={{
                  objectFit: 'cover',
                  margin: 10,
                  marginLeft: 20,
                  height: '8vh',
                }}
              />
            </Typography>
            {/* <Grid
            item
            xs={6}
            sx={{
              width: '100%',
            }}
          /> */}
            <Grid
              item
              container
              xs={1}
              sm={2}
              lg={1}
              sx={{ justifyContent: 'space-around' }}
            >
              <IconButton
                size='small'
                aria-label='cart'
                color='inherit'
                onClick={toggleCartDrawer}
              >
                <ShoppingCart />
              </IconButton>
              <IconButton
                size='small'
                aria-label='account of current user'
                onClick={currentUser ? handleProfile : handleLogin}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Cart />
      <AuthModal open={authOpen} handleClose={() => setAuthOpen(false)} />
    </>
  );
};

export default StoreHeader;
