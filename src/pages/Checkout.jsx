import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Autocomplete,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [shippingType, setShippingType] = useState('pickup'); // Opciones de envío

  const { currentUser } = useAuth();
  const {
    state: { cart, totalAmount },
  } = useCart();

  // Cargar datos iniciales de contacto y direcciones
  useEffect(() => {
    if (currentUser) {
      setContactInfo({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
      });
    }
    fetchAddresses();
  }, [currentUser]);

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

  // Manejar cambios en los datos de contacto
  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  // Manejar selección de dirección en Autocomplete
  const handleAddressSelect = (event, value) => {
    setSelectedAddress(value);
  };

  // Manejar cambios en el tipo de envío
  const handleShippingTypeChange = (event) => {
    setShippingType(event.target.value);
  };

  // Calcular costo de envío
  useEffect(() => {
    setShippingCost(
      shippingType === 'pickup' || totalAmount > 30000 ? 0 : 5000,
    );
  }, [totalAmount, shippingType]);

  const handleFlowPayment = async () => {
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

      // Enviar información completa del pedido
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
          shippingAddress:
            shippingType === 'pickup' ? 'Retiro en tienda' : selectedAddress,
          contactInfo,
          details,
          payments: [{ paymentTypeId: 10, amount: totalAmount / 1.19 }],
        },
      );

      window.location.href = response.data.paymentUrl;
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      alert('Hubo un problema con el pago. Inténtalo de nuevo.');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
      <Typography variant='h4' gutterBottom color='primary' align='center'>
        Checkout
      </Typography>

      {/* Datos del Usuario */}
      <Box component='form' noValidate autoComplete='off' sx={{ mt: 3 }}>
        <Typography variant='h6' gutterBottom color='secondary'>
          Datos del Usuario
        </Typography>
        <TextField
          label='Nombre'
          name='name'
          fullWidth
          margin='normal'
          value={contactInfo.name}
          onChange={handleContactChange}
          required
        />
        <TextField
          label='Teléfono'
          name='phone'
          fullWidth
          margin='normal'
          value={contactInfo.phone}
          onChange={handleContactChange}
          required
        />
        <TextField
          label='Correo Electrónico'
          name='email'
          fullWidth
          margin='normal'
          value={contactInfo.email}
          onChange={handleContactChange}
          required
        />

        {/* Opciones de tipo de envío */}
        <FormControl component='fieldset' sx={{ mt: 2 }}>
          <FormLabel component='legend' color='primary'>
            Tipo de Envío
          </FormLabel>
          <RadioGroup
            aria-label='tipo de envío'
            name='shippingType'
            value={shippingType}
            onChange={handleShippingTypeChange}
          >
            <FormControlLabel
              value='pickup'
              control={<Radio color='primary' />}
              label='Retiro en tienda'
            />
            <FormControlLabel
              value='delivery'
              control={<Radio color='primary' />}
              label='Despacho a domicilio ($5.000), exclusivo SANTIAGO, gratis sobre $30.000'
            />
            <FormControlLabel
              value='mail'
              control={<Radio color='primary' />}
              label='Correos de Chile (PRECIO POR PAGAR)'
            />
          </RadioGroup>
        </FormControl>

        {/* Autocomplete para seleccionar dirección */}
        {shippingType === 'delivery' && (
          <Autocomplete
            options={addresses}
            getOptionLabel={(option) =>
              `${option.street.toUpperCase()} ${
                option.number
              }, ${option.city.toUpperCase()}, ${option.region.toUpperCase()}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label='Seleccionar dirección'
                variant='outlined'
                fullWidth
                required
              />
            )}
            value={selectedAddress}
            onChange={handleAddressSelect}
            sx={{ margin: '10px 0' }}
          />
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Resumen del Carrito */}
      <Box>
        <Typography variant='h6' gutterBottom color='secondary'>
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
          <Typography variant='h6' color='primary'>
            Total:
          </Typography>
          <Typography variant='h6' color='primary'>
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
        disabled={
          !contactInfo.name ||
          !contactInfo.phone ||
          (!selectedAddress && shippingType === 'delivery')
        }
      >
        Confirmar Compra
      </Button>
    </Box>
  );
};

export default Checkout;
