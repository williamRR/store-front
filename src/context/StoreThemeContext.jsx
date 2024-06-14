import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useEffect, useState } from 'react';

const contrastColor = (hexColor) => {
  // Función para calcular el color de contraste
  // Puedes personalizar esta función según tus necesidades
  // Aquí hay un ejemplo simple
  const threshold = 128; // Umbral para determinar el color de contraste

  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > threshold ? '#000000' : '#ffffff';
};

const StoreThemeContext = createContext();

export const StoreThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [styleData, setStyleData] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const styleData = await res.json();
        const { palette } = styleData;
        const theme = createTheme({
          palette: {
            primary: {
              main: palette.primaryColor,
            },
            secondary: {
              main: palette.secondaryColor,
            },
            third: {
              main: palette.thirdColor,
            },
            background: {
              default: palette.backgroundColor,
            },
            accent: {
              main: palette.additionalAccentColor,
            },
            text: {
              primary: palette.textColor,
              contrast: palette.textContrastColor,
            },
          },
          typography: {
            fontFamily: palette.fontFamily || 'Arial, sans-serif',
          },
        });
        setTheme(theme);
        setCategories(
          [{ _id: 'home', name: 'Inicio' }]
            .concat({ _id: 'allProducts', name: 'Todos' })
            .concat(styleData.categories),
        );
        setStyleData(styleData);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <StoreThemeContext.Provider
      value={{ theme, styleData, categories, loading }}
    >
      {/* Usa ThemeProvider de Material-UI para aplicar el tema */}
      <ThemeProvider theme={theme ? theme : {}}>{children}</ThemeProvider>
    </StoreThemeContext.Provider>
  );
};

export const useStoreTheme = () => {
  return useContext(StoreThemeContext);
};
