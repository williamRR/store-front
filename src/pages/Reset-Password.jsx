import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    // Aquí puedes manejar el envío de los datos
    console.log({ email, password });
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
          Restablecer contraseña
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
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Restablecer contraseña
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
              onClick={() => navigate('/forgot-password')}
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

export default ResetPassword;
