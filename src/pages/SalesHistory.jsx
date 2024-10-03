import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TablePagination,
  IconButton,
  Divider,
  Skeleton,
  TextField, // Importar TextField para el filtro de fechas
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  ArrowDownward,
  ArrowUpward,
} from '@mui/icons-material';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSales, setTotalSales] = useState(0);
  const [sort, setSort] = useState('date');
  const [order, setOrder] = useState('desc');

  // Estado para el filtro de fechas
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Estados para las nuevas métricas
  const [totalSalesAmount, setTotalSalesAmount] = useState(null);
  const [totalCommissions, setTotalCommissions] = useState(null);

  const {
    userData: { user },
  } = useAuth();

  useEffect(() => {
    fetchSales();
  }, [page, rowsPerPage, sort, order, startDate, endDate]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/saleman-sales?seller=${user._id}&page=${
          page + 1
        }&limit=${rowsPerPage}&sort=${sort}&order=${order}&startDate=${startDate}&endDate=${endDate}`,
      );
      const {
        sales: salesData,
        totalSales,
        totalSalesAmount,
        totalCommissions,
      } = response.data;
      setSales(salesData);
      setTotalSales(totalSales);
      setTotalSalesAmount(totalSalesAmount);
      setTotalCommissions(totalCommissions);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (property) => {
    const isAsc = sort === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSort(property);
  };

  // Funciones para manejar el cambio de fechas
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <Box sx={{ mt: 4, width: '90%' }}>
      <Typography variant='h6' gutterBottom>
        Historial de Ventas
      </Typography>

      {/* Filtro de fechas */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <TextField
          label='Fecha inicio'
          type='date'
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label='Fecha fin'
          type='date'
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      {/* Resumen de ventas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {loading ? (
                <Skeleton variant='rectangular' height={80} />
              ) : (
                <>
                  <Typography variant='h6' color='textSecondary' gutterBottom>
                    Total de Ventas
                  </Typography>
                  <Typography variant='h4'>{totalSales}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {loading ? (
                <Skeleton variant='rectangular' height={80} />
              ) : (
                <>
                  <Typography variant='h6' color='textSecondary' gutterBottom>
                    Total Ingresos
                  </Typography>
                  <Typography variant='h4'>
                    {totalSalesAmount ? formatCurrency(totalSalesAmount) : '—'}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {loading ? (
                <Skeleton variant='rectangular' height={80} />
              ) : (
                <>
                  <Typography variant='h6' color='textSecondary' gutterBottom>
                    Total Comisiones
                  </Typography>
                  <Typography variant='h4'>
                    {totalCommissions ? formatCurrency(totalCommissions) : '—'}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size='small' sx={{ minWidth: 650, padding: '8px' }}>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell
                sx={{ color: 'primary.contrastText', padding: '6px' }}
                onClick={() => handleSortChange('date')}
              >
                Fecha
                <IconButton>
                  {sort === 'date' && order === 'asc' ? (
                    <ArrowUpward fontSize='small' sx={{ color: 'white' }} />
                  ) : sort === 'date' && order === 'desc' ? (
                    <ArrowDownward fontSize='small' sx={{ color: 'white' }} />
                  ) : null}
                </IconButton>
              </TableCell>
              <TableCell
                sx={{ color: 'primary.contrastText', padding: '6px' }}
                onClick={() => handleSortChange('totalAmount')}
              >
                Total
                <IconButton>
                  {sort === 'totalAmount' && order === 'asc' ? (
                    <ArrowUpward fontSize='small' sx={{ color: 'white' }} />
                  ) : sort === 'totalAmount' && order === 'desc' ? (
                    <ArrowDownward fontSize='small' sx={{ color: 'white' }} />
                  ) : null}
                </IconButton>
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
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton variant='rectangular' height={40} />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  <Typography>No se encontraron ventas</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
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
                    {/* {formatCurrency(calculateCommission(sale.totalAmount))} */}
                    {formatCurrency(sale.commission)}
                  </TableCell>
                  <TableCell sx={{ padding: '6px', display: 'flex', gap: 1 }}>
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
                    {/* Nuevo botón para abrir el PDF de la boleta */}
                    <Tooltip title='Ver Boleta' arrow placement='top'>
                      <IconButton
                        size='small'
                        color='primary'
                        onClick={() => window.open(sale.urlPdf, '_blank')}
                      >
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
    </Box>
  );
};

export default SalesHistory;

// Función de formato de moneda
const formatCurrency = (amount) => {
  // Redondear hacia abajo (sin centavos)
  const roundedAmount = Math.floor(amount);

  return `$${roundedAmount.toLocaleString('es-CL')} CLP`;
};

// Función para calcular la comisión
const calculateCommission = (totalAmount) => {
  return Math.floor(totalAmount * 0.05).toLocaleString('es-CL');
};

// Función para traducir el método de pago
const dictMethod = (method) => {
  switch (method) {
    case 'credit card':
      return 'Transbank';
    case 'cash':
      return 'Efectivo';
    case 'transfer':
      return 'Transferencia';
    default:
      return method;
  }
};
