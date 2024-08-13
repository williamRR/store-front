import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  TextField,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  // Función para capitalizar la primera letra de cada palabra
  const capitalize = (str) => {
    if (!str) return '';
    return str
      .toLowerCase() // Convierte todo a minúsculas
      .split(' ') // Divide el string en palabras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza la primera letra de cada palabra
      .join(' '); // Une las palabras nuevamente
  };

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const addToCart = (product) => {
    const productWithQuantity = {
      ...product,
      quantity: parseInt(quantity, 10),
    };
    dispatch({ type: 'ADD_TO_CART', payload: productWithQuantity });
  };

  const imageSrc = item.image ? item.image : 'https://via.placeholder.com/150';

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '48%', md: '32%', lg: '18%' }, // Ancho flexible para diferentes tamaños de pantalla
        maxWidth: 200, // Ancho máximo reducido
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardActionArea>
        <CardMedia
          component='img'
          image={imageSrc}
          alt={capitalize(item.name)}
          sx={{
            width: '100%',
            height: 120, // Altura reducida para hacerlo más compacto
            objectFit: 'cover',
          }}
        />
        <CardContent sx={{ textAlign: 'center', padding: 1 }}>
          <Typography
            sx={{ marginTop: 0.5 }}
            variant='h6' // Título más pequeño
            component='div'
            color='primary.main'
          >
            {capitalize(item.name)}
          </Typography>

          <Typography
            variant='body1' // Precio con tamaño reducido
            color='text.secondary'
            sx={{ marginBottom: 0.5 }}
          >
            ${item.price}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              type='number'
              InputProps={{ inputProps: { min: 1 } }}
              value={quantity}
              onChange={handleQuantityChange}
              size='small'
              sx={{ width: 50, marginRight: 0.5 }} // Campos más pequeños
            />
            <Typography variant='body2'>Units</Typography>
          </Box>
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
          right: 5,
          backgroundColor: hovered ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
        }}
      >
        <ShoppingCartIcon />
      </IconButton>
    </Card>
  );
};

export default ProductCard;
