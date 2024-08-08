import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error(
        `Ocurrió un error al iniciar sesión: ${JSON.stringify(error)}`,
      );
    }
  };
  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Inicio de Sesión
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
            Iniciar Sesión
          </Button>
          <Typography variant='body2' color='textSecondary' align='center'>
            ¿No tienes una cuenta?{' '}
            <Button
              sx={{ textTransform: 'none' }}
              color='primary'
              onClick={() => navigate('/register')}
            >
              Regístrate
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

export default Login;
