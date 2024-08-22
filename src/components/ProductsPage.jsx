import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  debounce,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import ProductCard from './ProductCard';
import TagsBanner from './TagsBanner';
import { useLocation } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]); //
  const [grouping, setGrouping] = useState('grouped'); // Default to grouped
  const {
    category: { _id: categoryId },
  } = useLocation().state || {}; // Get category from location state
  const handleGroupingChange = (event) => {
    setGrouping(event.target.value);
  };

  useEffect(() => {
    if (categoryId) {
      setFilters({
        category: categoryId,
        tags: [],
        brand: null,
        query: '',
      });
    }
  }, [categoryId]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 25, // Número de productos por página
    sort: 'name', // Campo por el cual ordenar
    order: 'asc', // Orden ascendente o descendente
  });

  const [filters, setFilters] = useState({
    category: null,
    tags: [],
    brand: null, // New filter for brands
    query: '',
  });

  const handleSearchChange = debounce((event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      query: event.target.value,
    }));
  }, 500);

  const handleLimitChange = (newLimit) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      limit: newLimit,
    }));
  };

  const handleSortChange = (newSort) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      sort: newSort,
    }));
  };

  const handleOrderChange = (newOrder) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      order: newOrder,
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/get-products`;
        const res = await axios.post(url, {
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
          sort: pagination.sort,
          order: pagination.order,
          grouping, // Add grouping to the request body
        });
        const { data } = res;
        setAvailableTags(data.availableFilters.tags);
        setAvailableBrands(data.availableFilters.brands);
        setProducts(data.products);
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalPages: data.totalPages,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters,
    pagination.page,
    pagination.limit,
    pagination.sort,
    pagination.order,
    grouping, // Add grouping as a dependency
  ]);

  const handlePageChange = (event, value) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: value,
    }));
  };

  const removeTag = (tagId) => {
    if (tagId === filters.brand?._id) {
      removeBrand();
      return;
    }
    setFilters((prevFilters) => {
      const tags = prevFilters.tags.filter((tag) => tag._id !== tagId);
      return { ...prevFilters, tags };
    });
  };

  const clearAllTags = () => {
    setFilters((prevFilters) => ({ ...prevFilters, tags: [] }));
  };

  const removeBrand = () => {
    setFilters((prevFilters) => ({ ...prevFilters, brand: null }));
  };

  return (
    <div style={{ display: 'flex', width: '90vw', marginLeft: '5vw' }}>
      <Sidebar
        setFilters={setFilters}
        availableTags={availableTags}
        availableBrands={availableBrands}
        filters={filters}
      />
      <main
        style={{
          marginLeft: '240px',
          padding: '20px',
          // flexGrow: 1,
          // marginTop: '70px',
          maxWidth: '70vw',
        }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          sx={{
            position: 'absolute',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            width: '60vw', // Ajusta según sea necesario
            zIndex: 1,
            padding: '8px', // Agrega padding para mejorar el aspecto
          }}
          mb={2}
        >
          <TextField
            size='small'
            label='Buscar'
            variant='outlined'
            onChange={handleSearchChange}
            sx={{ flexShrink: 1, minWidth: '150px', marginRight: '8px' }} // Fija un ancho mínimo y márgenes
          />

          <FormControl
            variant='outlined'
            size='small'
            sx={{ minWidth: 120, marginRight: '8px', flexShrink: 1 }}
          >
            <InputLabel id='limit-select-label'>Página</InputLabel>
            <Select
              labelId='limit-select-label'
              value={pagination.limit}
              onChange={(event) => handleLimitChange(event.target.value)}
              label='Items per page'
            >
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <RadioGroup
            row
            value={grouping}
            onChange={handleGroupingChange}
            sx={{ marginRight: '8px' }}
          >
            <FormControlLabel
              value='grouped'
              control={<Radio />}
              label='Agrupados'
            />
            <FormControlLabel
              value='ungrouped'
              control={<Radio />}
              label='Desagrupados'
            />
          </RadioGroup>
          <FormControl
            variant='outlined'
            size='small'
            sx={{ minWidth: 120, marginRight: '8px', flexShrink: 1 }}
          >
            <InputLabel id='sort-select-label'>Criterio</InputLabel>
            <Select
              labelId='sort-select-label'
              value={pagination.sort}
              onChange={(event) => handleSortChange(event.target.value)}
              label='Criterio'
            >
              <MenuItem value='name'>Nombre</MenuItem>
              <MenuItem value='price'>Precio</MenuItem>
              <MenuItem value='date'>Reciente</MenuItem>
              <MenuItem value='popularity'>Popularidad</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant='outlined'
            size='small'
            sx={{ minWidth: 120, marginRight: '8px', flexShrink: 1 }}
          >
            <InputLabel id='order-select-label'>Orden</InputLabel>
            <Select
              labelId='order-select-label'
              value={pagination.order}
              onChange={(event) => handleOrderChange(event.target.value)}
              label='Order'
            >
              <MenuItem value='asc'>Ascendente</MenuItem>
              <MenuItem value='desc'>Descendente</MenuItem>
            </Select>
          </FormControl>

          {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '300px', // Ancho fijo para la paginación
            flexShrink: 0,
          }}
        > */}
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            variant='outlined'
            size='small'
            siblingCount={1}
            boundaryCount={1}
            showLastButton
            onChange={handlePageChange}
            color='secondary'
          />
        </Box>

        <TagsBanner
          filters={filters.tags.concat(filters.brand || [])}
          removeTag={removeTag}
          clearAllTags={() => {
            removeBrand();
            clearAllTags();
          }}
        />

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh', // Adjust height as needed
            }}
          >
            <CircularProgress size={200} />
          </Box>
        ) : (
          <Grid container justifyContent={'flex-start'}>
            {products.map((product) => (
              <ProductCard item={product} key={product._id} />
            ))}
          </Grid>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
