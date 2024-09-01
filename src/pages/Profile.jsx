import React from 'react';
import { Box, Grid } from '@mui/material';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileMainContent from '../components/ProfileMainContent';

const Profile = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <ProfileSidebar />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          // marginLeft: 240, // para asegurar que el contenido principal no quede debajo del sidebar
        }}
      >
        <ProfileMainContent />
      </Box>
    </Box>
  );
};

export default Profile;
