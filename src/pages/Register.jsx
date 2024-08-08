import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        email,
        password,
      });
      toast.success('Por favor, revisa tu casilla de correo electrónico');
      navigate('/'); // Redirige al login después del registro exitoso
    } catch (error) {
      toast.error(`Ocurrió un error al intentar registrarte: ${error.message}`);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <ToastContainer />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Registro de nuevo usuario
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Registro
          </Button>
          <Typography variant='body2' color='textSecondary' align='center'>
            ¿Ya tienes una cuenta?{' '}
            <Button
              sx={{ textTransform: 'none' }}
              color='primary'
              onClick={() => navigate('/login')}
            >
              Inicia Sesión
            </Button>
          </Typography>
          <Typography variant='body2' color='textSecondary' align='center'>
            ¿Olvidaste tu contraseña?{' '}
            <Button
              sx={{ textTransform: 'none' }}
              color='primary'
              onClick={() => navigate('/reset-password')}
            >
              Recupérala
            </Button>
          </Typography>
          <Typography variant='body2' color='textSecondary' align='center'>
            ¿Quieres ver los términos y condiciones?{' '}
            <Button
              sx={{ textTransform: 'none' }}
              color='primary'
              onClick={() => navigate('/terms-and-conditions')}
            >
              Términos y Condiciones
            </Button>
          </Typography>
          <Typography variant='body2' color='textSecondary' align='center'>
            ¿Quieres ver la tienda?{' '}
            <Button
              sx={{ textTransform: 'none' }}
              color='primary'
              onClick={() => navigate('/')}
            >
              Ir a la tienda
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
