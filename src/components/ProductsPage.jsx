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
import { useAuth } from '../context/AuthContext'; // Ajustar la ruta si es necesario

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [grouping, setGrouping] = useState('grouped');
  const {
    category: { _id: categoryId },
  } = useLocation().state || {};

  const handleGroupingChange = (event) => {
    setGrouping(event.target.value);
  };

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 25,
    sort: 'name',
    order: 'asc',
  });

  const [filters, setFilters] = useState({
    category: null,
    tags: [],
    brand: null,
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

  // 1. useEffect para actualizar los filtros cuando cambia categoryId
  useEffect(() => {
    if (categoryId) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        category: categoryId,
        tags: [],
        brand: null,
        query: '',
      }));
    }
  }, [categoryId]);

  // 2. useEffect para obtener los productos cuando cambian los filtros o la paginación
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
          grouping,
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

    if (
      filters.category ||
      filters.tags.length > 0 ||
      filters.brand ||
      filters.query !== ''
    ) {
      fetchProducts();
    }
  }, [
    filters,
    pagination.page,
    pagination.limit,
    pagination.sort,
    pagination.order,
    grouping,
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
        setPagination={setPagination}
      />
      <main
        style={{
          marginLeft: '20px',
          padding: '16px',
          maxWidth: '70vw',
          width: '100%',
        }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          sx={{
            backgroundColor: 'white',
            // minWidth: '60vw',
            width: '100%',
            zIndex: 1,
            padding: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          mb={2}
        >
          <TextField
            size='small'
            label='Buscar'
            variant='outlined'
            onChange={handleSearchChange}
            sx={{ flexShrink: 1, minWidth: '150px', marginRight: '8px' }}
          />

          <FormControl
            variant='outlined'
            size='small'
            sx={{ minWidth: 100, marginRight: '8px', flexShrink: 1 }}
          >
            <InputLabel id='limit-select-label'>Items</InputLabel>
            <Select
              labelId='limit-select-label'
              value={pagination.limit}
              onChange={(event) => handleLimitChange(event.target.value)}
              label='Items'
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
              control={<Radio size='small' />}
              label='Agrupados'
            />
            <FormControlLabel
              value='ungrouped'
              control={<Radio size='small' />}
              label='Desagrupados'
            />
          </RadioGroup>

          <FormControl
            variant='outlined'
            size='small'
            sx={{ minWidth: 100, marginRight: '8px', flexShrink: 1 }}
          >
            <InputLabel id='sort-select-label'>Ordenar por</InputLabel>
            <Select
              labelId='sort-select-label'
              value={pagination.sort}
              onChange={(event) => handleSortChange(event.target.value)}
              label='Ordenar por'
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
            sx={{ minWidth: 100, marginRight: '8px', flexShrink: 1 }}
          >
            <InputLabel id='order-select-label'>Orden</InputLabel>
            <Select
              labelId='order-select-label'
              value={pagination.order}
              onChange={(event) => handleOrderChange(event.target.value)}
              label='Orden'
            >
              <MenuItem value='asc'>Ascendente</MenuItem>
              <MenuItem value='desc'>Descendente</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
              width: '100%',
              height: '60vh',
            }}
          >
            <CircularProgress size={80} />
          </Box>
        ) : (
          <Grid container justifyContent={'flex-start'} spacing={2}>
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
