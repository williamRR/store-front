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
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { formatCurrency } from '../pages/SalesHistory';

const ProfileMainContent = () => {
  const {
    userData: { user },
  } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para el skeleton
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
          }/sales?seller=${user._id}`,
        );

        const { sales: salesData, paymentMethodCounts: pmCounts } =
          response.data.sales;

        const today = new Date().toISOString().slice(0, 10);
        const currentMonth = new Date().getMonth();
        let commissionThisMonth = 0;

        salesData.forEach((sale) => {
          const saleDate = new Date(sale.date);
          const saleTotal = sale.totalAmount;

          // Comisión mensual
          if (saleDate.getMonth() === currentMonth) {
            commissionThisMonth += Math.floor(saleTotal * 0.05);
          }
        });

        setSales(salesData);
        setMetrics((prevMetrics) => ({
          ...prevMetrics,
          commissionThisMonth,
        }));
        setPaymentMethodCounts(pmCounts);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Stop loading after fetching sales
      }
    };

    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/sales/metrics/${user._id}`,
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Bienvenid@ {user?.email}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant='h6'>Ventas Hoy</Typography>
              {loading ? (
                <>
                  <Skeleton variant='text' width={100} height={50} />
                  <Skeleton variant='text' width={150} />
                  <Skeleton variant='text' width={150} />
                </>
              ) : (
                <>
                  <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                    {metrics.salesToday}
                  </Typography>
                  <Typography variant='subtitle1'>
                    Ingresos: {formatCurrency(metrics.totalRevenueToday)}
                  </Typography>
                  <Typography variant='subtitle1'>
                    Comisión: {formatCurrency(metrics.commissionToday)}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Typography variant='h6'>Ventas Este Mes</Typography>
              {loading ? (
                <>
                  <Skeleton variant='text' width={100} height={50} />
                  <Skeleton variant='text' width={150} />
                  <Skeleton variant='text' width={150} />
                </>
              ) : (
                <>
                  <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                    {metrics.salesThisMonth}
                  </Typography>
                  <Typography variant='subtitle1'>
                    Ingresos: {formatCurrency(metrics.totalRevenueThisMonth)}
                  </Typography>
                  <Typography variant='subtitle1'>
                    Comisión: {formatCurrency(metrics.commissionThisMonth)}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Ventas por Método de Pago */}
        {/* <Grid item xs={12}>
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
                    {loading ? (
                      <>
                        <TableRow>
                          <TableCell colSpan={3}>
                            <Skeleton variant='rectangular' height={40} />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3}>
                            <Skeleton variant='rectangular' height={40} />
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      Object.keys(paymentMethodCounts).map((method) => (
                        <TableRow key={method}>
                          <TableCell>{dictMethod(method)}</TableCell>
                          <TableCell>
                            {paymentMethodCounts[method].count}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(
                              paymentMethodCounts[method].totalAmount,
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default ProfileMainContent;
