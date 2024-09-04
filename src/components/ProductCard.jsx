import React, { useState, useCallback } from 'react';
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
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const { dispatch } = useCart();

  const capitalize = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPrice = (price) => {
    const strPrice = price.toString();
    return strPrice.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const imageSrc = item.image ? item.image : 'https://via.placeholder.com/150';

  const handleAddToCart = useCallback(() => {
    console.log('Adding to cart:', item);
    dispatch({ type: 'ADD_TO_CART', payload: item });
    dispatch({ type: 'TOGGLE_CART' });
  }, [item]);

  return (
    <Card
      sx={{
        width: { xs: '45%', sm: '26%', md: '15%' },
        margin: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
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
        onClick={handleAddToCart}
        sx={{
          position: 'absolute',
          bottom: 5,
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
