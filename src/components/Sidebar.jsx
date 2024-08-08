import { Box, Typography, Divider, Chip } from '@mui/material';
import { useStoreConfig } from '../context/StoreConfigContext';

const Sidebar = ({ setFilters, availableTags, availableBrands, filters }) => {
  const { categories } = useStoreConfig();

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleCategoryClick = (categoryId) => {
    setFilters({
      category: categoryId,
      tags: [],
      brand: null, // New filter for brands
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
    setFilters((prevFilters) => ({ ...prevFilters, brand })); // Asigna directamente la marca seleccionada
  };

  const selectedTagIds = filters.tags.map((tag) => tag._id);
  const selectedBrandId = filters.brand ? filters.brand._id : null; // Marca seleccionada

  return (
    <Box
      sx={{
        width: '240px',
        position: 'fixed',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#f7f7f7',
        padding: '1rem',
      }}
    >
      <Typography variant='h6' gutterBottom>
        Categorías
      </Typography>
      {categories.map((category) => (
        <Typography
          key={category._id}
          variant='body1'
          gutterBottom
          sx={
            category._id === filters.category
              ? {
                  fontWeight: 'bold',
                  backgroundColor: 'primary.light',
                  padding: '1rem',
                  borderRadius: '5px',
                }
              : {
                  cursor: 'pointer',
                  backgroundColor: 'silver',

                  padding: '1rem',
                  borderRadius: '5px',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }
          }
          onClick={() => handleCategoryClick(category._id)}
        >
          {capitalize(category.name)}
        </Typography>
      ))}
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
              }}
              key={brand._id}
              label={brand.name}
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
              key={tag._id}
              label={tag.name}
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
