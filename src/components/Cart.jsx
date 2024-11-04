import {
  Typography,
  Drawer,
  Box,
  List,
  ListItem,
  Button,
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
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { InputAdornment } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import apiClient from '../axios.config';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../axios.config';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    state: { isOpen, cart, totalAmount },
    dispatch,
  } = useCart();
  const [authOpen, setAuthOpen] = useState(false);

  const { currentUser, isAuthenticated, accessToken } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { addresses = [] } = currentUser || {};
  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
  };
  const handleAddressSelect = (event, value) => {
    setSelectedAddress(value);
  };
  const navigate = useNavigate();

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const toggleCartDrawer = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const handleRemoveItem = (_id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { _id } });
    toast.info('Producto eliminado del carrito');
  };

  const handleQuantityChange = (_id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'SET_QUANTITY', payload: { _id, quantity } });
    toast.info('Cantidad actualizada');
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCartLogic = () => {
    const isCartEmpty = cart.length === 0;
    const isUser = currentUser.role === 'Customer';
    const hasSelectedAddress = selectedAddress != null;

    const isPayButtonEnabled =
      !isCartEmpty && (isUser ? hasSelectedAddress : true);
    return isPayButtonEnabled;
  };
  const handleProceedToCheckout = async () => {
    setLoading(true);
    const details = cart.map((item) => ({
      image: item.image,
      comment: item.name,
      netUnitValue: item.price / 1.19,
      price: item.price,
      quantity: item.quantity,
      taxId: '[1]',
      product: item._id,
    }));

    let paymentType = 1;
    if (paymentMethod === 'transbank') paymentType = 2;
    if (paymentMethod === 'transfer') paymentType = 3;
    const body = {
      documentTypeId: import.meta.env.VITE_NODE_ENV === 'dev' ? 10 : 1,
      emissionDate: Math.floor(new Date().getTime() / 1000),
      details,
      declareSii: 1,
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
        { saleData: body, userId: currentUser._id },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      dispatch({ type: 'CLEAR_CART' });
      setPaymentDialogOpen(false);
      dispatch({ type: 'TOGGLE_CART' });
      setReceipt(response.data);
      setPdfModalOpen(true);
      toast.success(`Compra realizada con éxito: ${response.data._id}`);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error('Error al procesar la compra');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const handlePriceChange = (_id, price) => {
    if (price < 0) return;
    dispatch({
      type: 'UPDATE_PRICE',
      payload: { _id, price: parseFloat(price) },
    });
  };

  return (
    <>
      {/* Dialog for PDF receipt */}
      <Dialog
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
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

      {/* Dialog for Payment Method Selection */}
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
            disabled={!paymentMethod || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Continuar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cart Drawer */}
      <Drawer anchor='right' open={isOpen} onClose={toggleCartDrawer}>
        <Box
          sx={{
            width: 450,
            padding: '0.5rem',
          }}
          role='presentation'
        >
          <Typography variant='h6' gutterBottom>
            Carrito de Compras
          </Typography>

          <List>
            {cart?.map((item) => (
              <ListItem key={item._id} divider sx={{ padding: '0.5rem 0' }}>
                <Grid
                  container
                  justifyContent={'space-evenly'}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Grid item xs={1} sx={{ marginRight: '1rem', width: '50px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='body2'>{item.name}</Typography>
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
                      inputProps={{ min: 0, step: 0.01 }}
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
            sx={{ fontWeight: 'bold', color: 'green', textAlign: 'right' }}
          >
            Total: ${totalAmount}
          </Typography>

          {!currentUser ? (
            <>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                disabled={!cart.length}
                sx={{ margin: '10px 0' }}
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
              onClick={
                currentUser.role === 'Salesman'
                  ? handleOpenPaymentDialog
                  : () => navigate('/checkout')
              }
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
