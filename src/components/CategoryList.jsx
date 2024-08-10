import { Box, Typography, Grid } from '@mui/material';
import { useStoreConfig } from '../context/StoreConfigContext';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const { categories, theme } = useStoreConfig();
  const navigate = useNavigate();

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Box
      sx={{
        overflowX: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: '100vw',
        // backgroundColor: theme.palette.background,
        padding: '1rem 0',
      }}
    >
      <Grid container spacing={2} justifyContent='center'>
        {categories.map((category) => (
          <Grid item key={category._id}>
            <Typography
              onClick={() => navigate(`/products?category=${category._id}`)}
              sx={{
                cursor: 'pointer',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.contrast,
                padding: '0.5rem 1rem',
                // borderRadius: '20px',
                textAlign: 'center',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.palette.accent.main,
                },
              }}
            >
              {capitalize(category.name)}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryList;
