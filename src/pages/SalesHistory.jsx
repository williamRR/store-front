import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TablePagination,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para el skeleton
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSales, setTotalSales] = useState(0); // Para paginación
  const [startDate, setStartDate] = useState(''); // Fecha desde
  const [endDate, setEndDate] = useState(''); // Fecha hasta

  const {
    userData: { user },
  } = useAuth();

  useEffect(() => {
    fetchSales();
  }, [page, rowsPerPage, startDate, endDate]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/sales?seller=${user._id}&page=${page + 1}&limit=${rowsPerPage}${
          startDate ? `&startDate=${startDate}` : ''
        }${endDate ? `&endDate=${endDate}` : ''}`,
      );
      const { sales: salesData, totalSales } = response.data;
      setSales(salesData);
      setTotalSales(totalSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Añadir un delay de 500ms
    }
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when changing rows per page
  };

  const handleDateFilter = () => {
    fetchSales();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant='h6' gutterBottom>
        Tus Ventas
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Desde'
            type='date'
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label='Hasta'
            type='date'
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Button variant='contained' onClick={handleDateFilter}>
            Filtrar
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size='small' sx={{ minWidth: 650, padding: '8px' }}>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ color: 'primary.contrastText', padding: '6px' }}>
                Fecha
              </TableCell>
              <TableCell sx={{ color: 'primary.contrastText', padding: '6px' }}>
                Total
              </TableCell>
              <TableCell sx={{ color: 'primary.contrastText', padding: '6px' }}>
                Medio de pago
              </TableCell>
              <TableCell sx={{ color: 'primary.contrastText', padding: '6px' }}>
                Comisión
              </TableCell>
              <TableCell sx={{ color: 'primary.contrastText', padding: '6px' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant='rectangular' height={40} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant='rectangular' height={40} />
                  </TableCell>
                </TableRow>
              </>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  <Typography>No se encontraron ventas</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sales?.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell sx={{ padding: '6px' }}>
                    {new Date(sale.date).toLocaleString('es-CL', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell sx={{ padding: '6px' }}>
                    {formatCurrency(sale.totalAmount)}
                  </TableCell>
                  <TableCell sx={{ padding: '6px' }}>
                    {dictMethod(sale.paymentMethod)}
                  </TableCell>
                  <TableCell sx={{ padding: '6px' }}>
                    {formatCurrency(calculateCommission(sale.totalAmount))}
                  </TableCell>
                  <TableCell sx={{ padding: '6px' }}>
                    <Tooltip
                      title={
                        <Box
                          sx={{
                            padding: 2,
                            minWidth: 250,
                            backgroundColor: 'black',
                          }}
                        >
                          {sale.products.map((product) => (
                            <Box
                              key={product._id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 1,
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: 40,
                                  height: 40,
                                  marginRight: 8,
                                  borderRadius: '4px',
                                }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant='body2'
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {product.name}
                                </Typography>
                                <Typography
                                  variant='body2'
                                  color='text.secondary'
                                >
                                  Cantidad: {product.quantity} | Precio: $
                                  {product.price}
                                </Typography>
                              </Box>
                              <Typography
                                variant='body2'
                                sx={{
                                  marginLeft: 'auto',
                                  fontWeight: 'bold',
                                }}
                              >
                                {formatCurrency(
                                  product.price * product.quantity,
                                )}
                              </Typography>
                            </Box>
                          ))}
                          <Divider sx={{ my: 1 }} />
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 'bold' }}
                            >
                              Total Venta:
                            </Typography>
                            <Typography
                              variant='body2'
                              sx={{
                                fontWeight: 'bold',
                                color: 'green',
                              }}
                            >
                              {formatCurrency(sale.totalAmount)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      arrow
                      placement='top'
                    >
                      <IconButton size='small' color='primary'>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component='div'
          count={totalSales}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>

      {/* Show loading spinner while fetching sales */}
      {/* {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )} */}
    </Box>
  );
};

export default SalesHistory;

export const formatCurrency = (amount) => {
  return `$${amount.toLocaleString('es-CL')} CLP`;
};

const calculateCommission = (totalAmount) => {
  return Math.floor(totalAmount * 0.05).toLocaleString('es-CL');
};

const dictMethod = (method) => {
  switch (method) {
    case 'credit card':
      return 'Transbank';
    case 'cash':
      return 'Efectivo';
    case 'transfer':
      return 'Transferencia';
  }
};
