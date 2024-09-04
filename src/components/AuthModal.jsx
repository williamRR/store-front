import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AuthModal = ({ open, handleClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();
  const [view, setView] = useState('login'); // 'login', 'register', 'forgotPassword'
  const { login, register, forgotPassword } = useAuth();

  const onSubmit = async (data) => {
    try {
      if (view === 'login') {
        await login(data);

        handleClose();
      } else if (view === 'register') {
        const resp = await register(data);
        if (resp.success) {
          setView('login');
          reset();
        } else {
          toast.error(resp.message);
        }
      } else if (view === 'forgotPassword') {
        await forgotPassword(data);
      }
      handleClose();
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: 'Credenciales inválidas',
      });
      setError('password', {
        type: 'manual',
        message: 'Credenciales inválidas',
      });
      console.error('Error handling submit:', error);
    }
  };

  const renderForm = () => {
    switch (view) {
      case 'login':
        return (
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
                  type='password'
                  variant='outlined'
                  error={!!errors.password}
                  helperText={errors.password?.message.toString()}
                  fullWidth
                  margin='normal'
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
        );
      case 'register':
        return (
          <>
            <Controller
              name='email '
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
                  type='password'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                />
              )}
            />
            <Controller
              name='confirmPassword'
              control={control}
              defaultValue=''
              rules={{ required: 'Confirmar contraseña requerida' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Confirmar Contraseña'
                  type='password'
                  variant='outlined'
                  fullWidth
                  margin='normal'
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
        );
      case 'forgotPassword':
        return (
          <>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{ required: 'Correo requerido' }}
              helpertext='Correo requerido'
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
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
      </Box>
    </Modal>
  );
};

export default AuthModal;
