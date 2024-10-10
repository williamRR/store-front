import { Route, Routes } from 'react-router-dom';
import StoreHeader from './components/StoreHeader';
import CategoryList from './components/CategoryList';
import AdCarousel from './components/AdCarousel';
import { CircularProgress, Box } from '@mui/material';
import {
  StoreConfigProvider,
  useStoreConfig,
} from './context/StoreConfigContext';
import ProductsPage from './components/ProductsPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import SalesHistory from './pages/SalesHistory';
import PrivateRoute from './components/PrivateRoute'; // Importa tu componente PrivateRoute
import ProductDetail from './pages/ProductDetail';
import Addresses from './pages/Addresses';
import FlowSuccess from './pages/FlowSuccess';

function AppContent() {
  const { loading } = useStoreConfig();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <StoreHeader />
      <Routes>
        {/* Rutas públicas */}
        <Route
          path='/'
          element={
            <>
              <CategoryList />
              <AdCarousel />
            </>
          }
        />
        <Route path='/login' element={<Login />} />
        <Route path='/products' element={<ProductsPage />} />

        {/* Rutas privadas */}
        <Route path='/profile' element={<PrivateRoute element={Profile} />} />
        <Route
          path='/sales-history'
          element={<PrivateRoute element={SalesHistory} />}
        />
        <Route
          path='/addresses'
          element={<PrivateRoute element={Addresses} />}
        />
        <Route
          path='/flow-success'
          element={<PrivateRoute element={FlowSuccess} />}
        />
        <Route path='/product/:productId' element={<ProductDetail />} />
        <Route path='*' element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <StoreConfigProvider>
      <AppContent />
    </StoreConfigProvider>
  );
}

export default App;
