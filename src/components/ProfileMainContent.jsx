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
    salesThisMonth: 0,
    totalRevenueThisMonth: 0,
  });

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stores/${
            import.meta.env.VITE_STORE_ID
          }/sales?seller=${user.userId}`,
        );
        setSales(response.data.sales);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/sales/metrics/${user.userId}`,
        );
        setMetrics(response.data);
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
        Bienvenido, {user.email}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant='h6'>Ventas Hoy</Typography>
            <Typography variant='h4'>{metrics.salesToday}</Typography>
            <Typography variant='subtitle1'>
              Ingresos: ${metrics.totalRevenueToday?.toLocaleString()}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant='h6'>Ventas Este Mes</Typography>
            <Typography variant='h4'>{metrics.salesThisMonth}</Typography>
            <Typography variant='subtitle1'>
              Ingresos: ${metrics.totalRevenueThisMonth?.toLocaleString()}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant='h6' gutterBottom>
          Tus Ventas
        </Typography>
        <TableContainer component={Paper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Comisión</TableCell>
                <TableCell>Acciones</TableCell>
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
                    ${calculateCommission(sale.totalAmount)}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <Box>
                          {sale.products.map((product) => (
                            <Box key={product._id} sx={{ mb: 1 }}>
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: 50,
                                  height: 50,
                                  marginRight: 8,
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
                      <IconButton size='small'>
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
