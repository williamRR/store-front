import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  MenuItem,
  Select,
  Slider,
  Tab,
  Tabs,
  Pagination,
  TextField,
} from '@mui/material';
import { useStoreTheme } from '../context/StoreThemeContext';
import axios from 'axios';
import AdCarousel from './AdCarousel';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';

export const capitalizeFirstWord = (str) => {
  if (!str) return str;
  const words = str.split(' ');
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].toLowerCase();
  }
  return words.join(' ');
};

const CategoriesSection = () => {
  const { categories, theme } = useStoreTheme();

  const [value, setValue] = useState('home');

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <Tabs
        onChange={handleChange}
        aria-label='category tabs'
        variant='scrollable'
        scrollButtons='auto'
        sx={{
          marginBottom: 2,
          '& .MuiTab-root': {
            textTransform: 'capitalize',
            fontSize: '1.5rem',
            minWidth: 'auto',
            padding: '10px 15px',
            margin: '0 5px',
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              color: 'black',
              fontWeight: 'bold',
            },
            '&:hover': {
              color: theme.palette.primary.light,
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        {categories.map((category) => (
          <Tab
            key={category._id}
            label={capitalizeFirstWord(category.name)}
            value={category._id}
          />
        ))}
      </Tabs>

      {categories.map((category) => (
        <TabPanel
          key={category._id}
          value={category._id}
          sx={{
            padding: 0,
            border: '1px solid red',
          }}
        >
          {category._id === 'home' ? (
            <AdCarousel />
          ) : (
            <TabContent
              categoryId={category._id}
              categoryName={category.name}
            />
          )}
        </TabPanel>
      ))}
    </TabContext>
  );
};

const TabContent = ({ categoryId, categoryName }) => {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    orderBy: 'name',
    order: 'asc',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const [totalPages, setTotalPages] = useState(0);
  const [priceRange, setPriceRange] = useState([2000, 6000]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSortChange = (event) => {
    const { name, value } = event.target;
    setSortOrder((prevSortOrder) => ({ ...prevSortOrder, [name]: value }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSearchChange = (event) => {
    // setTimeout(() => , 2000);
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (categoryId === 'home') return;

    const fetchItems = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/product/store/${
            import.meta.env.VITE_STORE_ID
          }/category/${categoryId}?page=${page}&limit=${limit}&sort=${
            sortOrder.orderBy
          }&order=${sortOrder.order}&search=${searchTerm}`,
        );
        setItems(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error('Error fetching items');
      }
    };

    fetchItems();
  }, [categoryId, page, limit, sortOrder, searchTerm]);

  if (categoryId === 'home') {
    return <AdCarousel />;
  } else {
    return (
      <TabPanel value={categoryId} sx={{ padding: 5 }}>
        <Grid
          container
          spacing={3}
          justifyContent='space-around'
          alignItems='flex-start'
        >
          <Grid item xs={2} container direction='column' spacing={3}>
            <Grid item>
              <TextField
                fullWidth
                label='Buscar'
                variant='outlined'
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px' }}
              />
            </Grid>
            <Grid item>
              <Select
                name='orderBy'
                fullWidth
                value={sortOrder.orderBy}
                onChange={handleSortChange}
                style={{ marginBottom: '10px' }}
              >
                <MenuItem value='name'>Nombre</MenuItem>
                <MenuItem value='price'>Precio</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <Select
                name='order'
                fullWidth
                value={sortOrder.order}
                onChange={handleSortChange}
                style={{ marginBottom: '10px' }}
              >
                <MenuItem value='asc'>Ascendente</MenuItem>
                <MenuItem value='desc'>Descendente</MenuItem>
              </Select>
            </Grid>
            <Grid item>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay='on'
                min={1000}
                max={10000}
                step={500}
                marks
              />
            </Grid>
          </Grid>
          <Grid item xs={10} container spacing={2}>
            {items.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard item={item} />
              </Grid>
            ))}
            <Grid item xs={12} container justifyContent='center'>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color='primary'
              />
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
    );
  }
};

export default CategoriesSection;
