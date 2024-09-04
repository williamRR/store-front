import {
  Typography,
  Drawer,
  Box,
  List,
  ListItem,
  Button,
  Divider,
  TextField,
  IconButton,
  DialogActions,
  Radio,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  Grid,
} from '@mui/material';
import { InputAdornment } from '@mui/material';

import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import apiClient from '../axios.config';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
  const {
    state: { isOpen, cart, totalAmount },
    dispatch,
  } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { userData, isAuthenticated, accessToken } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    setAuthOpen(true);
    handleClose();
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const toggleCartDrawer = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const handleRemoveItem = (_id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { _id } });
  };

  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleQuantityChange = (_id, quantity) => {
    if (quantity < 1) return; // Evitar cantidades negativas o cero
    dispatch({ type: 'SET_QUANTITY', payload: { _id, quantity } });
    toast('Cantidad actualizada');
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleProceedToCheckout = async () => {
    const details = cart.map((item) => ({
      comment: item.name,
      netUnitValue: item.price / 1.19,
      price: item.price,
      quantity: item.quantity,
      taxId: '[1]',
      product: item._id,
    }));
    let paymentType = 1;
    if (paymentMethod === 'transbank') {
      paymentType = 2;
    }
    if (paymentMethod === 'transfer') {
      paymentType = 3;
    }
    const body = {
      documentTypeId: 10,
      emissionDate: Math.floor(new Date().getTime() / 1000),
      declareSii: 1,
      details: details,
      payments: [
        {
          paymentTypeId: paymentType,
          amount: totalAmount / 1.19,
        },
      ],
    };
    try {
      const response = await apiClient.post(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/sales`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      dispatch({ type: 'CLEAR_CART' });
      setPaymentDialogOpen(false);
      dispatch({ type: 'TOGGLE_CART' });
      setReceipt(response.data); // Guardar la boleta en el estado
      setPdfModalOpen(true); // Abrir el modal con el PDF
      toast.success(userData.accessToken);
      toast.success(`Compra realizada con éxito: ${response.data._id}`);
    } catch (error) {
      console.error('Error al procesar la compra:', error);

      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error('Error al procesar la compra');
      }
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'CLP',
      // minimumFractionDigits: 2,
    });
  };

  const handlePriceChange = (_id, price) => {
    if (price < 0) return; // Evitar precios negativos
    dispatch({
      type: 'UPDATE_PRICE',
      payload: { _id, price: parseFloat(price) },
    });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const capitalizeString = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <Dialog
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        // maxWidth='xs'
        fullWidth
      >
        <DialogTitle>Boleta Generada</DialogTitle>
        <DialogContent>
          {receipt && (
            <iframe
              src={receipt.urlPdf}
              title='Boleta PDF'
              width='100%'
              height='600px'
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfModalOpen(false)} color='primary'>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

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
            <FormControlLabel
              value='transfer'
              control={<Radio />}
              label='Transferencia (16.387.103-3)'
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
      <Drawer anchor='right' open={isOpen} onClose={toggleCartDrawer}>
        <Box
          sx={{
            width: 450, // Hacemos el Drawer más pequeño
            padding: '0.5rem', // Reducimos el padding
          }}
          role='presentation'
        >
          <Typography variant='h6' gutterBottom>
            Carrito de Compras
          </Typography>
          <List>
            {cart?.map((item) => (
              <ListItem
                key={item._id}
                divider
                sx={{ padding: '0.5rem 0' }} // Menos padding en los ListItems
              >
                <Grid
                  container
                  justifyContent={'space-evenly'}
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <Grid
                    item
                    xs={1}
                    sx={{
                      marginRight: '1rem',
                      width: '50px',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '40px', // Reducimos el tamaño de la imagen
                        height: '40px',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} sx={{ minWidth: '1px' }}>
                    <Typography variant='body2'>
                      {capitalizeString(item.name)}
                    </Typography>
                    <Typography variant='caption'>
                      Cantidad: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={7} container justifyContent={'space-around'}>
                    <TextField
                      type='number'
                      sx={{ width: '50%' }}
                      variant='outlined'
                      size='small'
                      value={item.price}
                      onChange={(e) =>
                        handlePriceChange(item._id, parseFloat(e.target.value))
                      }
                      inputProps={{
                        min: 0,
                        step: 0.01,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>$</InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      type='number'
                      sx={{ width: '25%' }}
                      variant='outlined'
                      size='small'
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, parseInt(e.target.value))
                      }
                      inputProps={{ min: 1 }}
                    />
                    <IconButton
                      color='secondary'
                      size='small'
                      onClick={() => handleRemoveItem(item._id)}
                      sx={{ width: '10%' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 'bold', color: 'green', textAlign: 'right' }} // Más estilo
          >
            Total: ${formatCurrency(totalAmount)}
          </Typography>{' '}
          <Button
            variant='contained'
            fullWidth
            color='secondary'
            size='small'
            sx={{ margin: '10px 0' }}
            onClick={toggleCartDrawer}
          >
            Seguir comprando
          </Button>
          <Button
            variant='contained'
            fullWidth
            color='secondary'
            size='small'
            sx={{ margin: '10px 0' }}
            onClick={handleClearCart}
          >
            Limpiar Carrito
          </Button>
          {!isAuthenticated && !showLoginForm ? (
            <>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                disabled={!cart.length}
                sx={{
                  margin: '10px 0',
                  transition: 'transform 0.3s ease',
                  transform: showLoginForm
                    ? 'translateX(-150%)'
                    : 'translateX(0)',
                }}
                onClick={() => setAuthOpen(true)}
              >
                Iniciar Sesión
              </Button>
              <Typography variant='body2' textAlign='center'>
                Debes iniciar sesión para pagar
              </Typography>
            </>
          ) : (
            <Button
              variant='contained'
              color='primary'
              fullWidth
              disabled={!cart.length}
              sx={{ margin: '10px 0' }}
              onClick={handleOpenPaymentDialog}
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

export default Cart;
