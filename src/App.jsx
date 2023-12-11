import { ThemeProvider } from '@mui/system';
import { useStoreTheme } from './context/StoreThemeContext.jsx';
import { Grid } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { paths } from './constants/paths.jsx';
import { useAuth } from '../../store-admin/src/context/AuthContext';
import Layout from './components/Layout.jsx';
function App() {
  return <Content />;
}

export default App;

const Content = () => {
  return (
    // <Grid item xs={12}>
    <Routes>
      {paths.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={<RouterHack route={route} />}
        />
      ))}
    </Routes>
    // </Grid>
  );
};

const RouterHack = ({ route }) => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    userData: { roles },
  } = useAuth();

  return <Layout>{route.component}</Layout>;
};

// if (route.accessible === 'all') {
//   return (
//     <Suspense fallback={<CircularProgress />}>{route.component}</Suspense>
//   );
// }

// if (!isAuthenticated && route.accessible === 'unauthenticated') {
//   return (
//     <Suspense fallback={<CircularProgress />}>{route.component}</Suspense>
//   );
// }
// if (
//   !isAuthenticated &&
//   route.accessible !== 'unauthenticated' &&
//   route.accessible !== 'all'
// ) {
//   navigate('/forbidden');
// }
// if (route.accessible === 'unauthenticated') {
//   navigate('/');
//   return null;
// }

// if (route.accessible?.includes(roles)) {
//   if (route.crud)
//     return (
//       <h1>hola</h1>
//       // <MainPanel
//       //   entity={route.entity}
//       //   name={route.name}
//       //   headers={route.headers}
//       // />
//     );
//   else
//     return (
//       <Suspense fallback={<CircularProgress />}>{route.component}</Suspense>
//     );
// } else {
//   navigate('/forbidden');
//   return null;
// }
// };
