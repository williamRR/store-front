import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const { dispatch } = useCart();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/products/${productId}`;
        const { data } = await axios.get(url);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    console.log(product),
    (
      <Box sx={{ padding: '20px' }}>
        <Grid container spacing={4}>
          {/* Imagen del Producto */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <img
                src={product?.image}
                alt={product?.name}
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  maxHeight: '500px',
                  borderRadius: '8px',
                }}
              />
            </Card>
          </Grid>

          {/* Información del Producto */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 2 }}>
              <CardContent>
                <Typography variant='h4' gutterBottom color='primary.main'>
                  {product?.name}
                </Typography>

                <Typography variant='subtitle1' color='text.secondary'>
                  {product?.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Precio */}
                <Typography
                  variant='h5'
                  color='secondary.main'
                  sx={{ fontWeight: 'bold' }}
                >
                  ${product?.price?.toLocaleString('es-CL')}
                </Typography>

                {/* Categoría */}
                <Typography variant='subtitle2' sx={{ mt: 1 }}>
                  Categoría:{' '}
                  <Chip
                    label={JSON.stringify(product?.category)}
                    color='primary'
                  />
                </Typography>

                {/* Marca */}
                <Typography variant='subtitle2' sx={{ mt: 1 }}>
                  Marca:{' '}
                  <Chip
                    label={JSON.stringify(product?.brand)}
                    color='secondary'
                  />
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Información adicional */}
                {/* <Stack direction='row' spacing={2}>
                  <Chip
                    label={`Ventas: ${product?.salesCount}`}
                    color='primary'
                  />
                  <Chip
                    label={`Recaudado: $${product?.totalRevenue?.toLocaleString(
                      'es-CL',
                    )}`}
                    color='secondary'
                  />
                </Stack> */}

                {/* Botón Añadir al Carrito */}
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<ShoppingCartIcon />}
                  size='large'
                  sx={{ mt: 3, width: '100%', fontWeight: 'bold' }}
                  onClick={() => {
                    dispatch({ type: 'ADD_TO_CART', payload: product });
                    dispatch({ type: 'TOGGLE_CART' });
                  }}
                >
                  Añadir al Carrito
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sección de Información Adicional */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 2 }}>
              <CardContent>
                <Typography variant='h5' gutterBottom>
                  Detalles del Producto
                </Typography>
                <Typography variant='body1'>
                  SKU: {product?.sku || 'No disponible'}
                </Typography>
                <Typography variant='body1'>
                  Precio Neto: ${product?.netPrice?.toLocaleString('es-CL')}
                </Typography>
                <Typography variant='body1'>
                  Costo Unitario: $
                  {product?.COSTO_UNITARIO?.toLocaleString('es-CL')}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Actualizado el:{' '}
                  {new Date(product?.updatedAt)?.toLocaleDateString('es-CL')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  );
};

export default ProductDetail;
