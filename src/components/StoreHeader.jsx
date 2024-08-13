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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
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
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const {
    images: { smallLogo },
    theme,
  } = useStoreConfig();
  const { isAuthenticated, userData } = useAuth();
  const {
    state: { cart, totalAmount, isOpen },
    dispatch,
  } = useCart();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleProceedToCheckout = () => {
    // Aquí puedes manejar la lógica de la acción de pago dependiendo del método
    console.log('Selected payment method:', paymentMethod);
    setPaymentDialogOpen(false);
    navigate('/checkout');
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

  const toggleCartDrawer = (open) => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const handleRemoveItem = (_id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { _id } });
  };

  const handleIncrement = (_id) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { _id, amount: 1 } });
  };

  const handleDecrement = (_id) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { _id, amount: -1 } });
  };

  const handleQuantityChange = (_id, quantity) => {
    if (quantity < 1) return; // Evitar cantidades negativas o cero
    dispatch({ type: 'SET_QUANTITY', payload: { _id, quantity } });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <>
      <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog}>
        <DialogTitle>Seleccione el método de pago</DialogTitle>
        <DialogContent>
          <RadioGroup
            aria-label='payment-method'
            name='payment-method'
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <FormControlLabel
              value='efectivo'
              control={<Radio />}
              label='Efectivo'
            />
            <FormControlLabel
              value='transbank'
              control={<Radio />}
              label='Transbank'
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog} color='secondary'>
            Cancelar
          </Button>
          <Button
            onClick={handleProceedToCheckout}
            color='primary'
            disabled={!paymentMethod}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

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

      <Drawer anchor='right' open={isOpen} onClose={toggleCartDrawer}>
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
              <ListItem key={item._id} divider>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={item.image} // Asegúrate de que la URL de la imagen esté en el objeto `item`
                    alt={item.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      marginRight: '1rem',
                    }}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price} x ${item.quantity}`}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    type='number'
                    variant='outlined'
                    size='small'
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item._id, parseInt(e.target.value))
                    }
                    sx={{ width: '60px', marginX: '0.5rem' }}
                    inputProps={{ min: 1 }}
                  />
                </Box>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => handleRemoveItem(item._id)}
                  sx={{ marginLeft: '1rem' }}
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
            fullWidth
            color='secondary'
            sx={{ margin: '10px' }}
            onClick={toggleCartDrawer}
          >
            Seguir comprando
          </Button>
          <Button
            variant='contained'
            fullWidth
            color='secondary'
            sx={{ margin: '10px' }}
            onClick={handleClearCart}
          >
            Limpiar Carrito
          </Button>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            sx={{ margin: '10px' }}
            onClick={handleOpenPaymentDialog}
          >
            Pagar
          </Button>
        </Box>
      </Drawer>

      <AuthModal open={authOpen} handleClose={() => setAuthOpen(false)} />
    </>
  );
};

export default StoreHeader;
