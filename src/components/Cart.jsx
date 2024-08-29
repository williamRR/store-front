import {
  Typography,
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
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {
  const {
    state: { isOpen, cart, totalAmount },
    dispatch,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
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
      netUnitValue: item.price,
      quantity: item.quantity,
      taxId: '[1]',
      product: item._id,
    }));

    const body = {
      documentTypeId: 10,
      emissionDate: Math.floor(new Date().getTime() / 1000),
      expirationDate: Math.floor(new Date().getTime() / 1000),
      declareSii: 1,
      details: details,
      payments: [
        {
          paymentTypeId: paymentMethod === 'efectivo' ? 1 : 2,
          amount: totalAmount,
        },
      ],
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/sales`,
        body,
      );
      dispatch({ type: 'CLEAR_CART' });
      setPaymentDialogOpen(false);
      dispatch({ type: 'TOGGLE_CART' });
      setReceipt(response.data); // Guardar la boleta en el estado
      setPdfModalOpen(true); // Abrir el modal con el PDF
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

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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
            width: 350,
            padding: '1rem',
          }}
          role='presentation'
        >
          <Typography variant='h6' gutterBottom>
            Carrito de Compras
          </Typography>
          <List>
            {cart?.map((item) => (
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
    </>
  );
};

export default Cart;
