import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion'; // Para animación
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Google as GoogleIcon } from '@mui/icons-material';

const AuthModal = ({ open, handleClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  const [view, setView] = useState('login'); // 'login', 'register', 'forgotPassword'
  const { login, register, forgotPassword, googleLogin } = useAuth();

  // Estado para manejar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = async (data) => {
    console.log('subtimiti');
    try {
      if (view === 'login') {
        console.log('Iniciar sesión con:', data);
        await login(data.email, data.password);
        toast.success('Inicio de sesión exitoso');
        reset();
        handleClose();
      } else if (view === 'register') {
        await register(data.email, data.password);
        toast.success('Registro exitoso, verifica tu correo');
        setView('login');
      } else if (view === 'forgotPassword') {
        await forgotPassword(data.email);
        toast.success('Correo de recuperación enviado');
        setView('login');
        reset();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.log(error);
    if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
      setError('email', {
        type: 'manual',
        message: 'Este correo ya está registrado',
      });
    } else if (
      error.message.includes('Firebase: Error (auth/invalid-credential).')
    ) {
      setError('email', {
        type: 'manual',
        message: 'Correo o contraseña incorrectos',
      });
      setError('password', {
        type: 'manual',
        message: 'Correo o contraseña incorrectos',
      });
    } else if (
      error.message === 'Verifica tu correo electrónico para continuar.'
    ) {
      setError('email', {
        type: 'manual',
        message: 'Verifica tu casilla de correo',
      });
    } else {
      setError('email', {
        type: 'manual',
        message: 'Error desconocido. Verifica tus datos.',
      });
    }
  };

  const renderForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {view === 'login' && (
        <>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            rules={{ required: 'Correo requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Correo'
                variant='outlined'
                error={!!errors.email}
                helperText={errors.email?.message.toString()}
                fullWidth
                margin='normal'
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            defaultValue=''
            rules={{ required: 'Contraseña requerida' }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Contraseña'
                type={showPassword ? 'text' : 'password'}
                variant='outlined'
                error={!!errors.password}
                helperText={errors.password?.message.toString()}
                fullWidth
                margin='normal'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Button type='submit' variant='contained' color='primary' fullWidth>
            Iniciar Sesión
          </Button>
          <Grid container justifyContent='space-between' marginTop='1rem'>
            <Button onClick={() => setView('register')}>Registrarse</Button>
            <Button onClick={() => setView('forgotPassword')}>
              Recuperar Contraseña
            </Button>
          </Grid>
        </>
      )}
      {view === 'register' && (
        <>
          <Controller
            name='email'
            control={control}
            rules={{ required: 'Correo requerido' }}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                label='Correo'
                error={!!errors.email}
                helperText={errors.email?.message.toString()}
                variant='outlined'
                fullWidth
                margin='normal'
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: 'Contraseña requerida' }}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                label='Contraseña'
                type={showPassword ? 'text' : 'password'}
                variant='outlined'
                fullWidth
                margin='normal'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={handleClickShowPassword}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Button type='submit' variant='contained' color='primary' fullWidth>
            Registrarse
          </Button>
          <Grid container justifyContent='flex-end' marginTop='1rem'>
            <Button onClick={() => setView('login')}>Iniciar Sesión</Button>
          </Grid>
        </>
      )}
      {view === 'forgotPassword' && (
        <>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            rules={{ required: 'Correo requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                label='Correo'
                variant='outlined'
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message.toString()}
                margin='normal'
              />
            )}
          />
          <Button type='submit' variant='contained' color='primary' fullWidth>
            Recuperar Contraseña
          </Button>
          <Grid container justifyContent='flex-end' marginTop='1rem'>
            <Button onClick={() => setView('login')}>Iniciar Sesión</Button>
          </Grid>
        </>
      )}
    </motion.div>
  );

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        handleClose();
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant='h6' align='center' marginBottom='2rem'>
            {view === 'login' && 'Iniciar Sesión'}
            {view === 'register' && 'Registrarse'}
            {view === 'forgotPassword' && 'Recuperar Contraseña'}
          </Typography>
          {renderForm()}
        </form>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant='outlined'
            startIcon={<GoogleIcon />}
            onClick={() => {
              googleLogin();
              handleClose();
              toast.success('Inicio de sesión exitoso');
            }}
            sx={{
              mt: 2,
              color: 'black',
              borderColor: 'black',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Iniciar sesión con Google
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
