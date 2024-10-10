import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

const FlowSuccess = () => {
  const navigate = useNavigate();

  // Función para redirigir al usuario a otra parte de la tienda
  const handleContinueShopping = () => {
    navigate('/'); // Redirigir a la página principal o de productos
  };

  const handleViewReceipt = () => {
    // Aquí puedes implementar la lógica para ver o descargar el recibo de pago
    console.log('Ver recibo de pago');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        backgroundColor: '#f4f6f8',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          textAlign: 'center',
          maxWidth: 500,
        }}
      >
        {/* Icono de éxito */}
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4caf50' }} />

        {/* Mensaje de éxito */}
        <Typography variant='h4' gutterBottom sx={{ marginTop: 2 }}>
          ¡Pago exitoso!
        </Typography>
        <Typography variant='body1' sx={{ marginBottom: 2 }}>
          Gracias por tu compra. Hemos procesado tu pago exitosamente. Te
          enviaremos un correo con los detalles de la transacción.
        </Typography>

        {/* Botón para ver el recibo */}
        <Button
          variant='outlined'
          sx={{ marginTop: 2 }}
          onClick={handleViewReceipt}
        >
          Ver recibo de pago
        </Button>

        {/* Botón para continuar comprando */}
        <Button
          variant='contained'
          color='primary'
          sx={{ marginTop: 2 }}
          onClick={handleContinueShopping}
        >
          Continuar comprando
        </Button>
      </Paper>
    </Box>
  );
};

export default FlowSuccess;
