import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import { Box } from '@mui/material';

const PrivateRoute = ({ element: Component }) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Box sx={{ display: 'flex' }}>
      <ProfileSidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Component />
      </Box>
    </Box>
  ) : (
    <Navigate to='/' />
  );
};

export default PrivateRoute;
