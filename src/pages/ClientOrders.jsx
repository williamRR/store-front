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
  IconButton,
  Tooltip,
  Pagination,
  List,
  ListItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ClientOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const ordersPerPage = 5; // Cantidad de órdenes por página

  // Llamar al backend con query params para obtener las órdenes paginadas
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Llamada al backend con parámetros de paginación
        const { data } = await axios.get(
          `users/${currentUser._id}/my-orders?page=${page}&limit=${ordersPerPage}`,
        );
        setOrders(data.orders); // Asumimos que el backend devuelve la lista en "orders"
        setTotalPages(Math.ceil(data.total / ordersPerPage)); // Total de páginas basado en el total de órdenes
      } catch (error) {
        setError('No se pudieron cargar las órdenes.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, currentUser._id]);

  // Manejador de cambio de página
  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
    <Box p={4}>
      <Typography variant='h4' gutterBottom color='primary'>
        Mis Órdenes
      </Typography>
      {orders.length === 0 ? (
        <Typography>No tienes órdenes en tu cuenta.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card>
                  <CardContent>
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Typography variant='h6' gutterBottom>
                        Orden: #{order._id}
                      </Typography>
                      <Tooltip title='Ver detalles'>
                        <IconButton color='primary'>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant='body2' gutterBottom>
                      <strong>Total:</strong> {order.totalAmount} CLP
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                      <strong>Estado:</strong> {order.orderStatus}
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                      <strong>Método de pago:</strong> {order.paymentMethod}
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                      <strong>Dirección de envío:</strong>{' '}
                      {order.shippingAddress.street}{' '}
                      {order.shippingAddress.number},{' '}
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.region}
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                      <strong>Productos:</strong>
                    </Typography>
                    <List>
                      {order.products.map((product, index) => (
                        <ListItem key={index}>
                          {product.name} - {product.quantity} x {product.price}{' '}
                          CLP
                        </ListItem>
                      ))}
                    </List>
                    <Typography variant='body2' gutterBottom>
                      <strong>Fecha de la orden:</strong>{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box display='flex' justifyContent='center' mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color='primary'
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ClientOrders;
