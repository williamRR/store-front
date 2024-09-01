import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileMainContent = () => {
  const { userData: user } = useAuth();
  console.log(useAuth());
  const [metrics, setMetrics] = useState({
    salesToday: 0,
    totalRevenueToday: 0,
    salesThisMonth: 0,
    totalRevenueThisMonth: 0,
  });

  useEffect(() => {
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

    fetchMetrics();
  }, [user]);

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
    </Box>
  );
};

export default ProfileMainContent;
