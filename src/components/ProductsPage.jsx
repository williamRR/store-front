import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  const locationState = useLocation().state || {};
  const { category: { _id: categoryId = 'all' } = {} } = locationState;

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

  const handleToggleOrder = () => {
    const newOrder = pagination.order === 'asc' ? 'desc' : 'asc';
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

  const [showOutOfStock, setShowOutOfStock] = useState(false);

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
          stock: !showOutOfStock,
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
    showOutOfStock,
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

  const removeBrand = () => {
    setFilters((prevFilters) => ({ ...prevFilters, brand: null }));
  };

  const handleOutOfStockChange = (event) => {
    setShowOutOfStock(event.target.checked); // Actualiza el estado con el valor del checkbox
  };
  const [receipt, setReceipt] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  return (
    <>
      <Dialog
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        // maxWidth='xs'
        fullWidth
      >
        <DialogTitle>Boleta Generada</DialogTitle>
        <DialogContent>
          {receipt && (
            <iframe
              src={receipt.urlPdf}
              title='Boleta PDF'
              width='100%'
              height='600px'
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfModalOpen(false)} color='primary'>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container>
        {/* Sidebar */}
        <Grid
          item
          xs={3}
          sm={4}
          lg={2}
          sx={{
            display: { xs: 'none', sm: 'block' },
            backgroundColor: 'white',
            padding: '16px',
          }}
        >
          <Sidebar
            setFilters={setFilters}
            availableTags={availableTags}
            availableBrands={availableBrands}
            filters={filters}
            setPagination={setPagination}
          />
        </Grid>

        {/* Main Content */}
        <Grid
          item
          xs={12}
          sm={8}
          lg={10}
          container
          spacing={2}
          sx={{
            padding: '16px',
            height: '1vh',
            scrollSnapMarginBottom: 2,
            marginBottom: 20,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            // alignItems: 'center',
          }}
        >
          <Grid item xs={'auto'}>
            <TextField
              size='small'
              label='Buscar'
              variant='outlined'
              onChange={handleSearchChange}
            />
          </Grid>

          <Grid item xs={'auto'}>
            <FormControl variant='outlined' size='small'>
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
          </Grid>

          <Grid item xs='auto'>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOutOfStock}
                  onChange={handleOutOfStockChange}
                  size='small'
                  color='primary'
                />
              }
              label='Mostrar productos sin stock'
            />
          </Grid>

          <Grid item xs={'auto'}>
            <FormControl variant='outlined' size='small'>
              <InputLabel id='sort-select-label'>Ordenar por</InputLabel>
              <Select
                labelId='sort-select-label'
                value={pagination.sort}
                sx={{
                  fullWidth: true,
                }}
                onChange={(event) => handleSortChange(event.target.value)}
                label='Ordenar por'
              >
                <MenuItem value='name'>Nombre</MenuItem>
                <MenuItem value='price'>Precio</MenuItem>
                <MenuItem value='date'>Reciente</MenuItem>
                <MenuItem value='popularity'>Popularidad</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={'auto'}>
            <IconButton onClick={handleToggleOrder} size='small'>
              {pagination.order === 'asc' ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon />
              )}
            </IconButton>
          </Grid>

          <Grid item xs={'auto'}>
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
          </Grid>
          <Grid item xs={'auto'}>
            <TagsBanner
              filters={filters.tags.concat(filters.brand || [])}
              removeTag={removeTag}
              clearAllTags={() => {
                removeBrand();
                // clearAllTags();
              }}
            />
          </Grid>

          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginTop: 20,
                height: '0vh',
              }}
            >
              <CircularProgress size={80} />
            </Box>
          ) : (
            <>
              <Grid
                container
                // spacing={5}
                // xs={9}
                sx={{
                  marginTop: 2,
                  marginLeft: 2,
                  justifyContent: {
                    xs: 'center', // Centrar el contenido en pantallas xs
                    sm: 'flex-start', // Alinear al inicio en pantallas sm y mayores
                  },
                }}
              >
                {products.map((product) => (
                  <ProductCard item={product} key={product._id} />
                ))}
              </Grid>
            </>
          )}
          <Grid
            item
            justifyContent={'center'}
            xs={12}
            sx={{
              minWidth: '100%',
              minHeight: '10vh',
              marginTop: 5,
            }}
          >
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
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default ProductsPage;
