import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
const ProductCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const { dispatch } = useCart();

  const capitalize = (str) => {
    if (!str) return '';
    return str
      .toLowerCase() // Convierte todo a minúsculas
      .split(' ') // Divide el string en palabras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
      .join(' '); // Une las palabras nuevamente
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  function formatPrice(price) {
    const strPrice = price.toString();

    return strPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const imageSrc = item.image ? item.image : 'https://via.placeholder.com/150';

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '48%', md: '30%', lg: '20%' }, // Ajusta el ancho dependiendo del tamaño de la pantalla
        maxWidth: 180, // Ancho máximo reducido
        minWidth: 180, // Ancho mínimo reducido
        margin: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        backgroundColor: 'white',
        position: 'relative',
        transition:
          'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          backgroundColor: '#f9f9f9',
        },
        boxShadow: 2,
      }}
    >
      <CardActionArea>
        <CardMedia
          component='img'
          image={imageSrc}
          alt={capitalize(item.name)}
          sx={{
            width: '100%',
            height: 120,
            objectFit: 'contain',
            backgroundColor: '#fff',
          }}
        />
        <CardContent sx={{ textAlign: 'center', padding: 0.5 }}>
          <Typography
            sx={{ marginTop: 0.5, fontSize: '0.9rem', fontWeight: 'bold' }}
            variant='subtitle1'
            component='div'
            color='primary.main'
            // noWrap
          >
            {capitalize(item.name)}
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ marginBottom: 0.5, fontSize: '0.8rem' }}
          >
            ${formatPrice(item.price || 0)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        onClick={() => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
          dispatch({ type: 'TOGGLE_CART' });
        }}
        sx={{
          position: 'absolute',
          bottom: 5,
          // marginTop: '40px',
          right: 5,
          backgroundColor: 'transparent',
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>
    </Card>
  );
};

export default ProductCard;
