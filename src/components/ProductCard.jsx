import { useState } from 'react';
import { useStoreTheme } from '../context/StoreThemeContext';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { capitalizeFirstWord } from './CategoriesSection';
import { useCart } from '../context/CartContext';

const ProductCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { cart, dispatch } = useCart();

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const theme = useStoreTheme();

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <Card
      sx={{
        width: '300px',
        height: '350px',
        overflow: 'hidden',
        margin: '10px',
        display: 'flex',
        padding: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: '30px',
        backgroundColor: 'white',
        borderBottomLeftRadius: '30px',
        position: 'relative',
        transition:
          'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: 'white',
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardActionArea>
        <CardMedia
          component='img'
          height='45%'
          padding='10px'
          width='35%'
          image={item.image}
          alt={item.name}
          sx={{
            borderTopLeftRadius: '20px',
          }}
        />
        <CardContent
          sx={{
            color: theme?.palette?.text.contrast,
          }}
        >
          <Typography
            sx={{
              marginTop: '10px',
              // color: theme?.palette?.text.contrast,
              color: 'black',
            }}
            variant='h5'
            component='div'
            textTransform={'capitalize'}
          >
            {capitalizeFirstWord(item.name)}
          </Typography>
          <Typography
            variant='h5'
            color='text.secondary'
            textTransform={'capitalize'}
          >
            ${item.price}
          </Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        sx={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          color: liked
            ? theme?.palette?.accent.main
            : theme?.palette?.text.primary,
          backgroundColor: hovered
            ? theme?.palette?.background.default
            : 'transparent',
        }}
        onClick={handleLikeClick}
      >
        <FavoriteIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          console.log(item);
          addToCart(item);
        }}
        sx={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          backgroundColor: hovered
            ? theme?.palette?.background.default
            : 'transparent',
        }}
      >
        <ShoppingCartIcon />
      </IconButton>
    </Card>
  );
};

export default ProductCard;
