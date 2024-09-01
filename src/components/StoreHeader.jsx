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
  const { isAuthenticated, logout } = useAuth();
  const { dispatch } = useCart();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // const [paymentMethod, setPaymentMethod] = useState('');
  // const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleOpenPaymentDialog = () => {
  //   setPaymentDialogOpen(true);
  // };

  // const handleClosePaymentDialog = () => {
  //   setPaymentDialogOpen(false);
  // };

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

  const toggleCartDrawer = (open) => {
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
            width: '90vw',
            marginLeft: '5vw',
          }}
        >
          <Grid
            container
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              variant='h6'
              component='div'
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
            <Grid
              item
              xs={6}
              sx={{
                width: '100%',
              }}
            />
            <Grid item container xs={1} sx={{ justifyContent: 'space-around' }}>
              <IconButton
                size='large'
                aria-label='cart'
                color='inherit'
                onClick={toggleCartDrawer}
              >
                <ShoppingCart />
              </IconButton>
              <IconButton
                size='large'
                aria-label='account of current user'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {!isAuthenticated && (
                  <MenuItem onClick={handleLogin}>Iniciar Sesión</MenuItem>
                )}
                {isAuthenticated && (
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                )}
              </Menu>
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
