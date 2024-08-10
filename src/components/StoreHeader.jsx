import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Grid,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useStoreConfig } from '../context/StoreConfigContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const StoreHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const {
    images: { smallLogo },
    theme,
  } = useStoreConfig();
  const { isAuthenticated, userData } = useAuth();

  const { roles } = userData || {};
  const {
    state: { cart, totalAmount },
    dispatch,
  } = useCart();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
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
    navigate('/');
    handleClose();
  };

  const toggleCartDrawer = (open) => () => {
    setCartOpen(open);
  };

  const handleRemoveItem = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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
            ></Grid>
            <Grid item container xs={1} sx={{ justifyContent: 'space-around' }}>
              <IconButton
                size='large'
                aria-label='cart'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                color='inherit'
                onClick={toggleCartDrawer(true)}
              >
                <ShoppingCart />
              </IconButton>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={() => setAuthOpen(true)}
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
      <Drawer anchor='right' open={cartOpen} onClose={toggleCartDrawer(false)}>
        <Box
          sx={{
            width: 350,
            padding: '1rem',
          }}
          role='presentation'
        >
          <Typography variant='h6' gutterBottom>
            Carrito de Compras
          </Typography>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={item.name}
                  secondary={`$${item.price}`}
                />
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Eliminar
                </Button>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ marginY: '1rem' }} />
          <Typography variant='h6'>Total: ${totalAmount}</Typography>
          <Button
            variant='contained'
            color='secondary'
            sx={{ marginTop: '1rem' }}
            onClick={handleClearCart}
          >
            Limpiar Carrito
          </Button>
          {roles && roles?.includes('salesman') && (
            <Button
              variant='contained'
              color='primary'
              sx={{ marginTop: '1rem' }}
              onClick={() => navigate('/admin')}
            >
              Pagar
            </Button>
          )}
          {isAuthenticated && (
            <Button
              variant='contained'
              color='primary'
              sx={{ marginTop: '1rem' }}
              onClick={handleClearCart}
            >
              Pagar
            </Button>
          )}
        </Box>
      </Drawer>
      <AuthModal open={authOpen} handleClose={() => setAuthOpen(false)} />
    </>
  );
};

export default StoreHeader;
