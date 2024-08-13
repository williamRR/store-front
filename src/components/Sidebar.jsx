import { Box, Typography, Divider, Chip } from '@mui/material';
import { useStoreConfig } from '../context/StoreConfigContext';

const Sidebar = ({ setFilters, availableTags, availableBrands, filters }) => {
  const { categories } = useStoreConfig();

  // Función para convertir el texto a Title Case
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCategoryClick = (categoryId) => {
    setFilters({
      category: categoryId,
      tags: [],
      brand: null,
      query: '',
    });
  };

  const handleTagClick = (tag) => {
    setFilters((prevFilters) => {
      const tags = [...prevFilters.tags, tag];
      return { ...prevFilters, tags };
    });
  };

  const handleBrandClick = (brand) => {
    setFilters((prevFilters) => ({ ...prevFilters, brand }));
  };

  const selectedTagIds = filters.tags.map((tag) => tag._id);
  const selectedBrandId = filters.brand ? filters.brand._id : null;

  return (
    <Box
      sx={{
        width: '240px',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#f7f7f7',
        padding: '1rem',
      }}
    >
      <Typography variant='h6' gutterBottom>
        Categorías
      </Typography>
      <Box>
        {categories.map((category) => (
          <Typography
            key={category._id}
            variant='body2' // Reducir el tamaño del texto para hacerlo más compacto
            gutterBottom
            sx={
              category._id === filters.category
                ? {
                    fontWeight: 'bold',
                    backgroundColor: 'primary.light',
                    padding: '0.5rem',
                    color: 'white',
                    borderRadius: '5px',
                  }
                : {
                    cursor: 'pointer',
                    backgroundColor: 'silver',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    '&:hover': {
                      color: 'secondary.main',
                      backgroundColor: 'primary.light',
                    },
                  }
            }
            onClick={() => handleCategoryClick(category._id)}
          >
            {toTitleCase(category.name)}
          </Typography>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant='h6' gutterBottom>
        Nuestras Marcas
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {availableBrands
          .filter((brand) => brand._id !== selectedBrandId)
          .map((brand) => (
            <Chip
              sx={{
                borderRadius: '0px',
                textTransform: 'capitalize',
                fontSize: '0.875rem',
              }}
              key={brand._id}
              label={toTitleCase(brand.name)} // Aplicar Title Case
              variant='outlined'
              onClick={() => handleBrandClick(brand)}
              clickable
            />
          ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant='h6' gutterBottom>
        Filtros rápidos
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {availableTags
          .filter((tag) => !selectedTagIds.includes(tag._id))
          .map((tag) => (
            <Chip
              sx={{
                textTransform: 'capitalize',
                fontSize: '0.875rem',
              }}
              key={tag._id}
              label={toTitleCase(tag.name)} // Aplicar Title Case
              variant='outlined'
              onClick={() => handleTagClick(tag)}
              clickable
            />
          ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
