import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileMainContent = () => {
  const { userData: user } = useAuth();
  const [sales, setSales] = useState([]);
  const [metrics, setMetrics] = useState({
    salesToday: 0,
    totalRevenueToday: 0,
    commissionToday: 0,
    salesThisMonth: 0,
    totalRevenueThisMonth: 0,
    commissionThisMonth: 0,
  });
  const [paymentMethodCounts, setPaymentMethodCounts] = useState({
    cash: { count: 0, totalAmount: 0 },
    'credit card': { count: 0, totalAmount: 0 },
    'debit card': { count: 0, totalAmount: 0 },
    paypal: { count: 0, totalAmount: 0 },
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stores/${
            import.meta.env.VITE_STORE_ID
          }/sales?seller=${user.userId}`,
        );

        const { sales: salesData, paymentMethodCounts: pmCounts } =
          response.data.sales;
        console.log(response.data);
        console.log(salesData);
        // Calcular la comisión de hoy y de este mes
        const today = new Date().toISOString().slice(0, 10);
        const currentMonth = new Date().getMonth();

        let commissionToday = salesData.commissionToday;
        let commissionThisMonth = 0;

        salesData.forEach((sale) => {
          const saleDate = new Date(sale.date);
          const saleTotal = sale.totalAmount;

          // Comisión diaria
          // if (saleDate.toISOString().slice(0, 10) === today) {
          //   commissionToday += Math.floor(salesToday * 0.05);
          // }

          // Comisión mensual
          if (saleDate.getMonth() === currentMonth) {
            commissionThisMonth += Math.floor(saleTotal * 0.05);
          }
        });

        setSales(salesData);
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          // commissionToday,
          commissionThisMonth,
        }));
        setPaymentMethodCounts(pmCounts);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/sales/metrics/${user.userId}`,
        );
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          ...response.data,
        }));
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchSales();
    fetchMetrics();
  }, [user]);

  const calculateCommission = (totalAmount) => {
    return Math.floor(totalAmount * 0.05).toLocaleString('es-CL');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Bienvenid@ {user.email}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant='h6'>Ventas Hoy</Typography>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                {metrics.salesToday}
              </Typography>
              <Typography variant='subtitle1'>
                Ingresos: ${metrics.totalRevenueToday?.toLocaleString()}
              </Typography>
              <Typography variant='subtitle1'>
                Comisión: ${metrics.commissionToday?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Typography variant='h6'>Ventas Este Mes</Typography>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                {metrics.salesThisMonth}
              </Typography>
              <Typography variant='subtitle1'>
                Ingresos: ${metrics.totalRevenueThisMonth?.toLocaleString()}
              </Typography>
              <Typography variant='subtitle1'>
                Comisión: ${metrics.commissionThisMonth?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* New section for payment method counts */}
        <Grid item xs={12}>
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant='h6'>Ventas por Método de Pago</Typography>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size='small'>
                  <TableHead sx={{ bgcolor: 'primary.light' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'primary.contrastText' }}>
                        Método de Pago
                      </TableCell>
                      <TableCell sx={{ color: 'primary.contrastText' }}>
                        Cantidad de Ventas
                      </TableCell>
                      <TableCell sx={{ color: 'primary.contrastText' }}>
                        Total Recaudado
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(paymentMethodCounts).map((method) => (
                      <TableRow key={method}>
                        <TableCell>{method}</TableCell>
                        <TableCell>
                          {paymentMethodCounts[method].count}
                        </TableCell>
                        <TableCell>
                          $
                          {paymentMethodCounts[
                            method
                          ].totalAmount.toLocaleString('es-CL')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant='h6' gutterBottom>
          Tus Ventas
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size='small'>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  Fecha
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  Total
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  Medio de pago
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  Comisión
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell>
                    {new Date(sale.date).toLocaleString('es-CL', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>{sale.total}</TableCell>
                  <TableCell>
                    {sale.paymentMethod === 'credit card' ||
                    sale.paymentMethod === 'debit card'
                      ? 'Transbank'
                      : 'Efectivo'}
                  </TableCell>
                  <TableCell>
                    ${calculateCommission(sale.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <Box>
                          {sale.products.map((product) => (
                            <Box
                              key={product._id}
                              sx={{
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: 50,
                                  height: 50,
                                  marginRight: 8,
                                  borderRadius: '4px',
                                }}
                              />
                              <Typography variant='body2'>
                                {product.name}
                              </Typography>
                            </Box>
                          ))}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ProfileMainContent;
