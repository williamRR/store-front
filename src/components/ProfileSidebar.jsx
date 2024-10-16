import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const ProfileSidebar = () => {
  const { logout } = useAuth();
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
        <ListItem button onClick={() => navigate('/profile')}>
          <ListItemIcon sx={{}}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Inicio' />
        </ListItem>

        <ListItem button onClick={() => navigate('/sales-history')}>
          <ListItemIcon sx={{}}>
            <HistoryIcon />
          </ListItemIcon>
          <ListItemText primary='Ver Historial de Ventas' />
        </ListItem>

        {/* <ListItem button onClick={() => navigate('/profile')}>
          <ListItemIcon sx={{}}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Cambiar mis Datos' />
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
*/}
        <ListItem
          button
          onClick={() => {
            localStorage.removeItem('token');
            logout();
            navigate('/');
          }}
        >
          <ListItemIcon sx={{}}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Cerrar Sesión' />
        </ListItem>

        <ListItem button onClick={() => navigate('/products')}>
          <ListItemIcon sx={{}}>
            <StorefrontIcon />
          </ListItemIcon>
          <ListItemText primary='Ir al Punto de Servicio' />
        </ListItem>
      </List>
    </Box>
  );
};

export default ProfileSidebar;
