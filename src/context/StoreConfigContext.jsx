import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const StoreConfigContext = createContext();

export const StoreConfigProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }`;
        const res = await axios.get(url);
        const { data } = res;
        const { palette, images } = data;

        // Creación del tema con colores por defecto en caso de falta de datos
        const theme = createTheme({
          palette: {
            primary: {
              main: palette.primary || '#1976d2',
            },
            secondary: {
              main: palette.secondary || '#dc004e',
            },
            background: {
              default: palette.background || '#ffffff',
            },
            accent: {
              main: palette.additionalAccentColor || '#ff9800',
            },
            text: {
              primary: palette.textPrimary || '#000000',
              contrast: palette.textContrastColor || '#ffffff',
            },
          },
          typography: {
            fontFamily: palette.fontFamily || 'Arial, sans-serif',
          },
        });

        setTheme(theme);
        setImages(images);
        setCategories([
          // { _id: 'all', name: 'Inicio' },
          { _id: 'all', name: 'Todos' },
          ...data.categories,
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchData();
  }, []);

  return (
    <StoreConfigContext.Provider value={{ theme, categories, loading, images }}>
      <ThemeProvider theme={theme || {}}>{children}</ThemeProvider>
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfig = () => {
  return useContext(StoreConfigContext);
};
