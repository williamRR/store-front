import StoreHeader from './StoreHeader';
import Footer from './Footer';
import { LinearProgress } from '@mui/material';
import { useStoreTheme } from '../context/StoreThemeContext';

const Layout = ({ children }) => {
  const { loading } = useStoreTheme();
  return (
    <div>
      <StoreHeader />
      {loading ? <LinearProgress /> : <main>{children}</main>}
      <Footer />
    </div>
  );
};

export default Layout;
