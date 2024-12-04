import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  Divider,
  Grid,
  TablePagination,
  TextField,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  debounce,
} from '@mui/material';
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const Stock = () => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);
  const [withStock, setWithStock] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/stores/${
        import.meta.env.VITE_STORE_ID
      }/category/all/stock-products?page=${
        page + 1
      }&limit=${limit}&order=${sort}&sort=${sortBy}&query=${query}&withStock=${withStock}`;

      const { data } = await axios.get(url);
      setProducts(data.products || []);
      setTotal(data.totalProducts || 0);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, sortBy, query, withStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sort === 'asc';
    setSort(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleSearchChange = useCallback(
    debounce((event) => {
      setQuery(event.target.value);
      setPage(0);
    }, 500),
    [],
  );

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Grid
        container
        justifyContent='space-around'
        alignItems='center'
        sx={{ marginBottom: '1rem' }}
      >
        <TablePagination
          component='div'
          count={total}
          rowsPerPageOptions={[10, 25, 50, 100, { label: 'Todas', value: 0 }]}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
        <TextField
          size='small'
          label='Buscar'
          variant='outlined'
          onChange={handleSearchChange}
        />
        {/* <Grid item>
          <Typography variant='body2'>Mostrar solo con stock</Typography>
          <Switch
            checked={withStock}
            onChange={() => setWithStock((prev) => !prev)}
          />
        </Grid> */}
      </Grid>
      <Divider
        sx={{ width: '100%', height: '1px', backgroundColor: 'black' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell
                onClick={() => handleRequestSort('name')}
                style={{ cursor: 'pointer' }}
              >
                Nombre
              </TableCell>
              <TableCell
                onClick={() => handleRequestSort('price')}
                style={{ cursor: 'pointer' }}
              >
                Precio
              </TableCell>
              <TableCell
                onClick={() => handleRequestSort('totalStock')}
                style={{ cursor: 'pointer' }}
              >
                Stock Total
              </TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 60, height: 60, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    {product.isDropshipping ? (
                      <Typography color='secondary'>Dropshipping</Typography>
                    ) : (
                      product.totalStock
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        <Box
                          sx={{
                            padding: 2,
                            minWidth: 250,
                            backgroundColor: 'white',
                            color: 'black',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {product.ubications.length > 0 ? (
                            product.ubications.map((ubication, index) => (
                              <Typography key={index}>
                                Ubicación: {ubication.name}, Cantidad:{' '}
                                {ubication.quantity}
                              </Typography>
                            ))
                          ) : (
                            <Typography>
                              Sin ubicaciones (Dropshipping)
                            </Typography>
                          )}
                        </Box>
                      }
                      arrow
                      placement='right-start'
                    >
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Stock;
