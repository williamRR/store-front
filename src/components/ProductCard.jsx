import { useState } from 'react';
import { useStoreTheme } from '../context/StoreThemeContext';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

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
  const muiTheme = useTheme();

  return (
    <Card
      sx={{
        width: '200px',
        height: '350px',
        overflow: 'hidden',
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: '30px',
        backgroundColor: theme?.palette?.primary.main,
        borderBottomLeftRadius: '30px',
        position: 'relative',
        transition:
          'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: theme?.palette?.background.default,
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      <CardActionArea>
        <CardMedia
          component='img'
          height='50%'
          padding='10px'
          width='50%'
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
            {item.name}
          </Typography>
          <Typography
            variant='body2'
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
