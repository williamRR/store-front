import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  MonetizationOn,
  TrendingUp,
  Today,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileMainContent = () => {
  const { currentUser: user } = useAuth();

  const [loading, setLoading] = useState(true); // Estado para el skeleton
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalSales: 0,
    comission: 0,
    commissionToday: 0,
    averageSale: 0,
    totalSalesToday: 0,
    totalRevenueToday: 0,
    averageSaleToday: 0,
  });

  useEffect(() => {
    if (user.role === 'Customer') return; // Solo para vendedores
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stores/${
            import.meta.env.VITE_STORE_ID
          }/own-sales?seller=${user._id}`,
        );
        setMetrics(response.data); // Actualizar con los datos del API
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false); // Desactivar skeleton al finalizar la carga
      }
    };
    fetchMetrics();
  }, [user]);

  // Componente para mostrar una métrica
  const MetricCard = ({ title, value, subtitle, icon }) => (
    <Card sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <CardContent>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box>
            <Typography variant='h6' gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton variant='text' width={150} height={40} />
            ) : (
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                {value}
              </Typography>
            )}
            {loading ? (
              <Skeleton variant='text' width={100} />
            ) : (
              <Typography variant='subtitle1' sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (user.role === 'Customer') return <CustomerMainProfile />; // Ocultar contenido para clientes
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Bienvenid@ {user?.name}
      </Typography>

      <Grid container spacing={4}>
        {/* Ventas Hoy */}
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title='Ventas Hoy'
            value={metrics.totalSalesToday}
            subtitle={`Ingresos: ${metrics.totalRevenueToday}`}
            icon={<Today sx={{ fontSize: 50 }} />}
          />
        </Grid>

        {/* Comisión Hoy */}
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title='Comisión Hoy'
            value={metrics.commissionToday}
            subtitle='Comisión generada hoy'
            icon={<AccountBalanceWallet sx={{ fontSize: 50 }} />}
          />
        </Grid>

        {/* Promedio de Venta Hoy */}
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title='Promedio de Venta Hoy'
            value={metrics.averageSaleToday}
            subtitle='Promedio de venta por transacción'
            icon={<TrendingUp sx={{ fontSize: 50 }} />}
          />
        </Grid>

        {/* Divider for clean layout */}
        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
        </Grid>

        {/* Ingresos Totales */}
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title='Ingresos Totales'
            value={metrics.totalRevenue}
            subtitle={`Total de Ventas: ${metrics.totalSales}`}
            icon={<MonetizationOn sx={{ fontSize: 50 }} />}
          />
        </Grid>

        {/* Comisión Total */}
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title='Comisión Total'
            value={metrics.comission}
            subtitle='Comisión acumulada'
            icon={<AccountBalanceWallet sx={{ fontSize: 50 }} />}
          />
        </Grid>

        {/* Promedio por Venta General */}
        <Grid item xs={12} md={6} lg={4}>
          <MetricCard
            title='Promedio por Venta General'
            value={`$${Math.round(metrics.averageSale).toLocaleString(
              'es-CL',
            )} CLP`} // Formato sin decimales
            subtitle='Promedio histórico por venta'
            icon={<TrendingUp sx={{ fontSize: 50 }} />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const CustomerMainProfile = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Bienvenid@ Cliente
      </Typography>
      <Typography variant='body1'>
        En esta sección podrás ver tus compras, direcciones y otros detalles de
        tu perfil.
      </Typography>
    </Box>
  );
};

export default ProfileMainContent;
