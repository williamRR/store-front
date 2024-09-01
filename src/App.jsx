import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
