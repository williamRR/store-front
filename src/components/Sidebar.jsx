import { Box, Typography, Divider, Chip, Grid } from '@mui/material';
import { useStoreConfig } from '../context/StoreConfigContext';

const Sidebar = ({
  setFilters,
  availableTags,
  availableBrands,
  filters,
  setPagination,
}) => {
  const { categories } = useStoreConfig();

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
    setPagination((prevPagination) => ({ ...prevPagination, page: 1 }));
  };

  const handleTagClick = (tag) => {
    setFilters((prevFilters) => {
      const tags = [...prevFilters.tags, tag];
      return { ...prevFilters, tags };
    });
    setPagination((prevPagination) => ({ ...prevPagination, page: 1 }));
  };

  const handleBrandClick = (brand) => {
    setFilters((prevFilters) => ({ ...prevFilters, brand }));
    setPagination((prevPagination) => ({ ...prevPagination, page: 1 }));
  };

  const selectedTagIds = filters.tags.map((tag) => tag._id);
  const selectedBrandId = filters.brand ? filters.brand._id : null;

  return (
    <Grid
      container
      direction={'column'}
      sx={{
        backgroundColor: 'third.main',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <Typography variant='h6' gutterBottom sx={{ fontSize: '1rem' }}>
        Categorías
      </Typography>
      {categories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => (
          <Typography
            key={category._id}
            variant='body2'
            gutterBottom
            sx={
              category._id === filters.category
                ? {
                    fontWeight: 'bold',
                    backgroundColor: 'primary.light',
                    padding: '0.3rem 0.5rem',
                    color: 'white',
                    borderRadius: '5px',
                  }
                : {
                    cursor: 'pointer',
                    backgroundColor: 'silver',
                    padding: '0.3rem 0.5rem',
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

      <Divider sx={{ my: 2 }} />

      <Typography variant='h6' gutterBottom sx={{ fontSize: '1rem' }}>
        Nuestras Marcas
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {availableBrands
          .filter((brand) => brand._id !== selectedBrandId)
          .map((brand) => (
            <Chip
              sx={{
                borderRadius: '0px',
                textTransform: 'capitalize',
                fontSize: '0.75rem',
              }}
              key={brand._id}
              label={toTitleCase(brand.name)}
              variant='outlined'
              onClick={() => handleBrandClick(brand)}
              clickable
            />
          ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant='h6' gutterBottom sx={{ fontSize: '1rem' }}>
        Filtros rápidos
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {availableTags
          .filter((tag) => !selectedTagIds.includes(tag._id))
          .map((tag) => (
            <Chip
              sx={{
                textTransform: 'capitalize',
                fontSize: '0.75rem',
              }}
              key={tag._id}
              label={toTitleCase(tag.name)}
              variant='outlined'
              onClick={() => handleTagClick(tag)}
              clickable
            />
          ))}
      </Box>
    </Grid>
  );
};

export default Sidebar;
