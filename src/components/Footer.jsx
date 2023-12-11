import React from 'react';
import { Typography, Container, Grid, Link } from '@mui/material';
import { useStoreTheme } from '../context/StoreThemeContext';

const Footer = () => {
  const { theme, styleData } = useStoreTheme();
  const { name, direction, phone, email } = styleData;
  return (
    <footer
      style={{
        backgroundColor: theme?.palette?.primary?.main,
        color: theme?.palette?.primary?.contrastText,
        padding: '2rem 0',
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>{name}</Typography>
            <Typography variant='body2'>{direction}</Typography>
            <Typography variant='body2'>Teléfono: {phone}</Typography>
            <Typography variant='body2'>Correo: {email}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Enlaces</Typography>
            <Typography variant='body2'>
              <Link href='/terminos'>Términos y Condiciones</Link>
            </Typography>
            <Typography variant='body2'>
              <Link href='/contacto'>Contacto</Link>
            </Typography>
            <Typography variant='body2'>
              <Link href='/acerca'>Acerca de Nosotros</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant='h6'>Redes Sociales</Typography>
            {/* Agrega tus enlaces de redes sociales aquí */}
            <Typography variant='body2'>
              <Link href='#' target='_blank' rel='noopener noreferrer'>
                Facebook
              </Link>
            </Typography>
            <Typography variant='body2'>
              <Link href='#' target='_blank' rel='noopener noreferrer'>
                Twitter
              </Link>
            </Typography>
            <Typography variant='body2'>
              <Link href='#' target='_blank' rel='noopener noreferrer'>
                Instagram
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
