import React, { useEffect, useState } from 'react';
import axios from '../axios.config';
import { useAuth } from '../context/AuthContext';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';

const ClientOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`users/${currentUser._id}/my-orders`);
        setOrders(data);
      } catch (error) {
        setError('No se pudieron cargar las órdenes.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser._id]);

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='100vh'
      >
        <Alert severity='error'>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ width: '80vw' }}>
      <Typography variant='h4' gutterBottom>
        Mis Órdenes
      </Typography>
      {orders.length === 0 ? (
        <Typography>No tienes órdenes en tu cuenta.</Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <Card>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    Orden: #{order._id}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Total:</strong> {order.totalAmount} CLP
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Estado:</strong> {order.orderStatus}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Método de pago:</strong> {order.paymentMethod}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Dirección de envío:</strong>{' '}
                    {order.shippingAddress.street}{' '}
                    {order.shippingAddress.number}, {order.shippingAddress.city}
                    , {order.shippingAddress.region}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Fecha de la orden:</strong>{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ClientOrders;
