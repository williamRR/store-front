import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import HistoryIcon from '@mui/icons-material/History';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import InventoryIcon from '@mui/icons-material/Inventory';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfileSidebar = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        overflow: 'auto',
        padding: 3,
        paddingY: 10,
        // bgcolor: 'primary.main',
        height: '100%',
        color: 'BLACK',
      }}
    >
      <List>
        <ListItem button onClick={() => navigate('/products')}>
          <ListItemIcon sx={{}}>
            <StorefrontIcon />
          </ListItemIcon>
          <ListItemText primary='Ir al Punto de Servicio' />
        </ListItem>

        <ListItem button onClick={() => navigate('/profile')}>
          <ListItemIcon sx={{}}>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary='Cambiar mis Datos' />
        </ListItem>

        <ListItem button onClick={() => navigate('/perfil/sales-history')}>
          <ListItemIcon sx={{}}>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary='Ver Historial de Ventas' />
        </ListItem>

        <ListItem button onClick={() => navigate('/perfil/sales-reports')}>
          <ListItemIcon sx={{}}>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary='Ver Informes de Ventas' />
        </ListItem>

        <ListItem button onClick={() => navigate('/perfil/support')}>
          <ListItemIcon sx={{}}>
            <SupportAgentIcon />
          </ListItemIcon>
          <ListItemText primary='Soporte' />
        </ListItem>

        <ListItem button onClick={() => navigate('/logout')}>
          <ListItemIcon sx={{}}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Cerrar Sesión' />
        </ListItem>
      </List>
    </Box>
  );
};

export default ProfileSidebar;
