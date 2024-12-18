import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProfileSidebar = () => {
  const { dispatch } = useCart();
  const {
    logout,
    currentUser: { role },
  } = useAuth();
  const navigate = useNavigate();

  // Función para manejar el logout y la navegación
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'CLEAR_CART' });

    logout();
    navigate('/');
  };

  return (
    <Box
      sx={{
        overflow: 'auto',
        padding: 3,
        paddingY: 10,
        bgcolor: 'background.paper',
        height: '100%',
        color: 'text.primary',
      }}
    >
      {/* Sección común para todos los roles */}
      <Typography variant='h6' sx={{ mb: 2 }}>
        General
      </Typography>
      <List>
        <ListItem button onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Mi Perfil' />
        </ListItem>

        <ListItem button onClick={() => navigate('/products')}>
          <ListItemIcon>
            <SupportAgentIcon />
          </ListItemIcon>
          <ListItemText primary='Ir al Punto de Servicio' />
        </ListItem>
      </List>

      {/* Divider para separar secciones */}
      <Divider sx={{ my: 2 }} />

      {/* Opciones para Salesman */}
      {role === 'Salesman' && (
        <>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Vendedor
          </Typography>
          <List>
            <ListItem button onClick={() => navigate('/sales-history')}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary='Historial de Ventas' />
            </ListItem>
            <ListItem button onClick={() => navigate('/ubications')}>
              <ListItemIcon>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText primary='Ubicaciones' />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Opciones para Customer */}
      {role === 'Customer' && (
        <>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Cliente
          </Typography>
          <List>
            <ListItem button onClick={() => navigate('/my-orders')}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary='Mis Compras' />
            </ListItem>

            <ListItem button onClick={() => navigate('/addresses')}>
              <ListItemIcon>
                <LocationOnIcon />
              </ListItemIcon>
              <ListItemText primary='Direcciones' />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Sección para Soporte y Cerrar sesión (disponible para todos los roles) */}
      <Typography variant='h6' sx={{ mb: 2 }}>
        Soporte y Ajustes
      </Typography>
      <List>
        {/* <ListItem button onClick={() => navigate('/support')}>
          <ListItemIcon>
            <SupportAgentIcon />
          </ListItemIcon>
          <ListItemText primary='Soporte' />
        </ListItem> */}

        {/* <ListItem button onClick={() => navigate('/settings')}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Ajustes' />
        </ListItem> */}

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Cerrar Sesión' />
        </ListItem>
      </List>
    </Box>
  );
};

export default ProfileSidebar;
