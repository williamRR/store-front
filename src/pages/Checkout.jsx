import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Autocomplete,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);

  const handleFlowPayment = async () => {
    // setLoading(true);
    try {
      const details = cart.map((item) => ({
        image: item.image,
        name: item.name,
        comment: item.name,
        netUnitValue: item.price / 1.19,
        price: item.price,
        quantity: item.quantity,
        taxId: '[1]',
        product: item._id,
      }));
      // Realizas la llamada a tu backend para crear la transacción en Flow
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/sales/${
          import.meta.env.VITE_STORE_ID
        }/webpay`,
        {
          totalAmount: totalAmount + shippingCost,
          customer: currentUser._id,
          currency: 'CLP',
          description: 'Compra en tu tienda',
          email: currentUser.email,
          shippingAddress: selectedAddress,
          details,
          payments: [
            {
              paymentTypeId: 10,
              amount: totalAmount / 1.19,
            },
          ],
          cart,
        },
      );

      // Redirigir a la URL de Flow para completar el pago
      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      alert('Hubo un problema con el pago. Inténtalo de nuevo.');
    } finally {
      // setLoading(false);
    }
  };

  const { currentUser } = useAuth();

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${currentUser._id}/addresses`,
      );
      setAddresses(response.data); // Establecer las direcciones recibidas desde el backend
    } catch (error) {
      console.error('Error al obtener las direcciones:', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Manejar selección de dirección en Autocomplete
  const handleAddressSelect = (event, value) => {
    setSelectedAddress(value);
  };

  const {
    state: { cart, totalAmount },
  } = useCart();

  // Calcular costo de envío
  useEffect(() => {
    if (totalAmount > 30000) {
      setShippingCost(0); // Envío gratuito
    } else {
      setShippingCost(5000); // Costo fijo para envíos dentro de Santiago
    }
  }, [totalAmount]);

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
      <Typography variant='h4' gutterBottom>
        Checkout
      </Typography>

      {/* Datos del Usuario */}
      <Box component='form' noValidate autoComplete='off' sx={{ mt: 3 }}>
        <Typography variant='h6' gutterBottom>
          Datos del Usuario
        </Typography>
        <TextField
          label='Nombre'
          fullWidth
          margin='normal'
          defaultValue={currentUser.name}
        />
        <TextField
          label='Teléfono'
          fullWidth
          margin='normal'
          defaultValue={currentUser.phone}
        />

        {/* Autocomplete para seleccionar dirección */}
        <Autocomplete
          options={addresses}
          getOptionLabel={(option) =>
            `${option.street} ${option.number}, ${option.city}, ${option.region}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label='Seleccionar dirección'
              variant='outlined'
              fullWidth
            />
          )}
          value={selectedAddress}
          onChange={handleAddressSelect}
          sx={{ margin: '10px 0' }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Resumen del Carrito */}
      <Box>
        <Typography variant='h6' gutterBottom>
          Resumen del Carrito
        </Typography>
        <List>
          {cart.map((item) => (
            <ListItem key={item.id} disableGutters>
              <ListItemText
                primary={`${item.name} x${item.quantity}`}
                secondary={`$${item.price.toLocaleString()} cada uno`}
              />
              <Typography variant='body2'>
                ${(item.price * item.quantity).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />

        {/* Total y Costo de Envío */}
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='body1'>Subtotal:</Typography>
          <Typography variant='body1'>
            ${totalAmount.toLocaleString()}
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='body1'>Costo de Envío:</Typography>
          <Typography variant='body1'>
            ${shippingCost > 0 ? shippingCost.toLocaleString() : 'Gratis'}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='h6'>Total:</Typography>
          <Typography variant='h6'>
            ${(totalAmount + shippingCost).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Botón de Confirmar Compra */}
      <Button
        variant='contained'
        color='primary'
        onClick={handleFlowPayment}
        fullWidth
        sx={{ mt: 3 }}
        disabled={!selectedAddress}
      >
        Confirmar Compra
      </Button>
    </Box>
  );
};

export default Checkout;
