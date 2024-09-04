import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import ProductCard from './ProductCard';
import TagsBanner from './TagsBanner';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ajustar la ruta si es necesario
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import apiClient from '../axios.config';
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [grouping, setGrouping] = useState('grouped');

  const locationState = useLocation().state || {};
  const { category: { _id: categoryId = 'all' } = {} } = locationState;

  const handleGroupingChange = (event) => {
    setGrouping(event.target.value);
  };
  const {
    state: { isOpen, cart, totalAmount },
    dispatch,
  } = useCart();
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

  const handleQuantityChange = (_id, quantity) => {
    if (quantity < 1) return; // Evitar cantidades negativas o cero
    dispatch({ type: 'SET_QUANTITY', payload: { _id, quantity } });
    toast('Cantidad actualizada');
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
  const { userData, isAuthenticated, accessToken } = useAuth();

  const handleProceedToCheckout = async () => {
    const details = cart.map((item) => ({
      comment: item.name,
      netUnitValue: item.price / 1.19,
      price: item.price,
      quantity: item.quantity,
      taxId: '[1]',
      product: item._id,
    }));
    let paymentType = 1;
    if (paymentMethod === 'transbank') {
      paymentType = 2;
    }
    if (paymentMethod === 'transfer') {
      paymentType = 3;
    }
    const body = {
      documentTypeId: 10,
      emissionDate: Math.floor(new Date().getTime() / 1000),
      // expirationDate: Math.floor(new Date().getTime() / 1000),
      declareSii: 1,
      details: details,
      payments: [
        {
          paymentTypeId: paymentType,
          amount: totalAmount / 1.19,
        },
      ],
    };
    try {
      const response = await apiClient.post(
        `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/sales`,
        body,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      dispatch({ type: 'CLEAR_CART' });
      setPaymentDialogOpen(false);
      dispatch({ type: 'TOGGLE_CART' });
      setReceipt(response.data); // Guardar la boleta en el estado
      setPdfModalOpen(true); // Abrir el modal con el PDF
      toast.success(userData.accessToken);
      toast.success(`Compra realizada con éxito: ${response.data._id}`);
    } catch (error) {
      console.error('Error al procesar la compra:', error);

      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error('Error al procesar la compra');
      }
    }
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const clearAllTags = () => {
    setFilters((prevFilters) => ({ ...prevFilters, tags: [] }));
  };

  const removeBrand = () => {
    setFilters((prevFilters) => ({ ...prevFilters, brand: null }));
  };

  const handleRemoveItem = (_id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { _id } });
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const handleOpenPaymentDialog = () => {
    setPaymentDialogOpen(true);
  };
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
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

      <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog}>
        <DialogTitle>Seleccione el método de pago</DialogTitle>
        <DialogContent>
          <RadioGroup
            aria-label='payment-method'
            name='payment-method'
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <FormControlLabel
              value='efectivo'
              control={<Radio />}
              label='Efectivo'
            />
            <FormControlLabel
              value='transbank'
              control={<Radio />}
              label='Transbank'
            />
            <FormControlLabel
              value='transfer'
              control={<Radio />}
              label='Transferencia (16.387.103-3)'
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog} color='secondary'>
            Cancelar
          </Button>
          <Button
            onClick={handleProceedToCheckout}
            color='primary'
            disabled={!paymentMethod}
          >
            Continuar
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

          <Grid item xs={'auto'}>
            <RadioGroup row value={grouping} onChange={handleGroupingChange}>
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
          {/* <Grid
          xs={12}
          sm={8}
          lg={10}
          container
          spacing={2}
          sx={{
            padding: '16px',
            border: '1px solid pink',
            height: '1vh',
            marginTop: 2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            backgroundColor: 'skyblue',
            // alignItems: 'center',
          }}
        > */}
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
                clearAllTags();
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
                spacing={2}
                // xs={9}
                sx={{
                  marginTop: 2,
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
              {/* <Grid
                item
                xs={2}
                sx={{
                  border: '1px solid pink',
                }}
              >
                <Box
                  sx={{
                    width: 350,
                    padding: '1rem',
                  }}
                  role='presentation'
                >
                  <Typography variant='h6' gutterBottom>
                    Carrito de Compras
                  </Typography>
                  <List>
                    {cart?.map((item) => (
                      <ListItem key={item._id} divider>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={item.image} // Asegúrate de que la URL de la imagen esté en el objeto `item`
                            alt={item.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              marginRight: '1rem',
                            }}
                          />
                          <ListItemText
                            primary={item.name}
                            secondary={`$${item.price} x ${item.quantity}`}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            type='number'
                            variant='outlined'
                            size='small'
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                parseInt(e.target.value),
                              )
                            }
                            sx={{ width: '60px', marginX: '0.5rem' }}
                            inputProps={{ min: 1 }}
                          />
                        </Box>
                        <Button
                          variant='outlined'
                          color='secondary'
                          onClick={() => handleRemoveItem(item._id)}
                          sx={{ marginLeft: '1rem' }}
                        >
                          Eliminar
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ marginY: '1rem' }} />
                  <Typography variant='h6'>Total: ${totalAmount}</Typography>
                  {/* <Button
                    variant='contained'
                    fullWidth
                    color='secondary'
                    size='small'
                    sx={{ margin: '10px' }}
                    onClick={toggleCartDrawer}
                  >
                    Seguir comprando
                  </Button>
                  <Button
                    variant='contained'
                    fullWidth
                    color='secondary'
                    size='small'
                    sx={{ margin: '10px' }}
                    onClick={handleClearCart}
                  >
                    Limpiar Carrito
                  </Button>
                  {/* {!isAuthenticated && !showLoginForm ? (
                    <>
                      <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        disabled={!cart.length}
                        sx={{
                          margin: '10px',
                          transition: 'transform 0.3s ease',
                          transform: showLoginForm
                            ? 'translateX(-150%)'
                            : 'translateX(0)',
                        }}
                        onClick={() => setAuthOpen(true)}
                      >
                        Iniciar Sesión
                      </Button>
                      <Typography
                        variant='body2'
                        gutterBottom
                        textAlign={'center'}
                      >
                        Debes iniciar sesión para pagar
                      </Typography>
                    </>
                  ) : !isAuthenticated && showLoginForm ? (
                    <Box
                      sx={{
                        margin: '10px',
                        transition: 'transform 0.3s ease',
                        transform: showLoginForm
                          ? 'translateX(0)'
                          : 'translateX(150%)',
                      }}
                    >
                      <TextField
                        label='Correo Electrónico'
                        type='email'
                        fullWidth
                        size='small'
                        margin='normal'
                        variant='outlined'
                      />
                      <TextField
                        label='Contraseña'
                        type='password'
                        fullWidth
                        size='small'
                        margin='normal'
                        variant='outlined'
                      />
                      <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={() => {
                          handleLogin();
                          setShowLoginForm(false);
                          toast.success('Inicio de sesión exitoso');
                        }}
                        fullWidth
                        sx={{ marginTop: '10px' }}
                      >
                        Iniciar Sesión
                      </Button>
                    </Box>
                  ) : (
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    disabled={!cart.length}
                    sx={{ margin: '10px' }}
                    onClick={handleOpenPaymentDialog}
                  >
                    Pagar
                  </Button>
                  {/* )}
                </Box>
              </Grid> */}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default ProductsPage;
