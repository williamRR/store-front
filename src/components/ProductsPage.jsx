import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  debounce,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import ProductCard from './ProductCard';
import TagsBanner from './TagsBanner';
import BrandsBanner from './BrandsBanner'; // Import the new BrandsBanner component

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]); //
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
  ]);

  const handlePageChange = (event, value) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: value,
    }));
  };

  const removeTag = (tagId) => {
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
      <main style={{ marginLeft: '240px', padding: '20px', flexGrow: 1 }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <TextField
            size='small'
            label='Search'
            variant='outlined'
            onChange={handleSearchChange}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '300px', // Fixed width for pagination
              flexShrink: 0,
            }}
          >
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color='primary'
            />
          </Box>
          <Box display='flex'>
            {/* Limit control */}
            <FormControl
              variant='outlined'
              size='small'
              sx={{ minWidth: 120, mr: 2 }}
            >
              <InputLabel id='limit-select-label'>Items per page</InputLabel>
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

            {/* Sort control */}
            <FormControl
              variant='outlined'
              size='small'
              sx={{ minWidth: 120, mr: 2 }}
            >
              <InputLabel id='sort-select-label'>Sort by</InputLabel>
              <Select
                labelId='sort-select-label'
                value={pagination.sort}
                onChange={(event) => handleSortChange(event.target.value)}
                label='Sort by'
              >
                <MenuItem value='name'>Name</MenuItem>
                <MenuItem value='price'>Price</MenuItem>
                <MenuItem value='date'>Date</MenuItem>
                <MenuItem value='popularity'>Popularity</MenuItem>
              </Select>
            </FormControl>

            {/* Order control */}
            <FormControl variant='outlined' size='small' sx={{ minWidth: 120 }}>
              <InputLabel id='order-select-label'>Order</InputLabel>
              <Select
                labelId='order-select-label'
                value={pagination.order}
                onChange={(event) => handleOrderChange(event.target.value)}
                label='Order'
              >
                <MenuItem value='asc'>Ascending</MenuItem>
                <MenuItem value='desc'>Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
          <Grid container spacing={1}>
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
