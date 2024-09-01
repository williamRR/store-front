import React from 'react';
import { List, ListItem, ListItemText, Drawer, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        <ListItem button onClick={() => navigate('/perfil/change-password')}>
          <ListItemText primary='Cambiar Contraseña' />
        </ListItem>
        {/* Agregar más opciones según sea necesario */}
      </List>
    </Box>
  );
};

export default ProfileSidebar;
