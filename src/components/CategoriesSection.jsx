import Tab from '@mui/material/Tab';
import { useStoreTheme } from '../context/StoreThemeContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdCarousel from './AdCarousel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { toast } from 'react-toastify';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  MenuItem,
  Select,
  Slider,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ProductCard from './ProductCard';
const CategoriesSection = () => {
  const { categories } = useStoreTheme();
  const [value, setValue] = useState('home');

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList
        onChange={handleChange}
        aria-label='lab API tabs example'
        variant='fullWidth'
        sx={{
          width: '90vw',
          marginBottom: '10',
          marginLeft: '5vw',
          // border: '1px solid red',
          justifyContent: 'space-evenly',
          paddingX: 6,
          paddingY: 3,
        }}
      >
        {/* <Grid
          container
          sx={{
            width: '80vw',
            marginBottom: '10',
            marginLeft: '5vw',
            border: '1px solid red',
            justifyContent: 'space-evenly',
            padding: 5,
          }}
        > */}
        {categories.map((category) => (
          <Tab
            key={category._id}
            label={category.name}
            value={category._id}
            sx={{
              textTransform: 'capitalize',
              fontSize: '1.2rem',
            }}
          />
        ))}
        {/* </Grid> */}
      </TabList>

      {categories.map((category) => (
        <TabPanel
          key={category._id}
          value={category._id}
          sx={{
            padding: 0,
            // height: '100%',
            // width: '100vw',
            // display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'center', // Alinea el contenido en el centro verticalmente
          }}
        >
          {category._id === 'home' ? (
            <>
              <AdCarousel />
              <AdCarousel />
              <AdCarousel />
              <AdCarousel />
            </>
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

// Resto del código sin cambios

export default CategoriesSection;

const TabContent = ({ categoryId, categoryName }) => {
  const [items, setItems] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    orderBy: 'Nombre',
    order: 'asc',
  });
  const handleSortChange = (event) => {
    const { name, value } = event.target;
    setSortOrder((prevSortOrder) => ({ ...prevSortOrder, [name]: value }));
  };
  const [value, setValue] = useState([2000, 6000]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const theme = useStoreTheme();
  useEffect(() => {
    if (categoryId === 'home') return;
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/product/store/${
            import.meta.env.VITE_STORE_ID
          }/category/${categoryId}`,
        );
        setItems(data);
      } catch (error) {
        toast.success('Entity deleted successfully');
      }
    };
    fetchItems();
  }, [categoryId]);
  if (categoryId === 'home') {
    return <AdCarousel />;
  } else {
    return (
      <TabPanel
        value={categoryId}
        sx={{
          padding: 5,
          // display: 'flex',
          // flexDirection: 'column',
          // alignItems: 'center', // Alinea el contenido en el centro verticalmente
          // justifyContent: 'center', // Alinea el contenido en el centro horizontalmente
        }}
      >
        <Grid
          container
          xs={12}
          justifyContent={'space-around'}
          sx={{ minHeight: '100vh' }}
          alignContent={'flex-start'}
        >
          {/* <Grid item xs={5}>
            <Select
              name='orderBy'
              fullWidth
              value={sortOrder.orderBy}
              onChange={handleSortChange}
              style={{ marginBottom: '10px' }}
            >
              <MenuItem value='default'>Nombre</MenuItem>
              <MenuItem value='price'>Precio</MenuItem>
            </Select>
          </Grid> */}
          {/* <Grid item xs={5}> */}
          {/* <Select
              fullWidth
              name='order'
              value={sortOrder.order}
              onChange={handleSortChange}
              style={{ marginBottom: '40px' }}
            >
              <MenuItem value='asc'>Ascendente</MenuItem>
              <MenuItem value='desc'>Descendente</MenuItem>
            </Select>
          </Grid> */}

          <Grid container justifyContent={'space-evenly'}>
            <Grid
              item
              xs={2}
              container
              justifyContent={'space-around'}
              alignContent={'center'}
              direction={'column'}
            >
              <Select
                name='orderBy'
                fullWidth
                value={sortOrder.orderBy}
                onChange={handleSortChange}
                style={{ marginBottom: '10px' }}
              >
                <MenuItem value='default'>Nombre</MenuItem>
                <MenuItem value='price'>Precio</MenuItem>
              </Select>
              <Select
                fullWidth
                name='order'
                value={sortOrder.order}
                onChange={handleSortChange}
                style={{ marginBottom: '40px' }}
              >
                <MenuItem value='asc'>Ascendente</MenuItem>
                <MenuItem value='desc'>Descendente</MenuItem>
              </Select>
              <Slider
                aria-label='Disabled slider'
                sx={{
                  size: 'small',
                  width: '100%',
                  '& .MuiSlider-root': {
                    // color: theme.palette.primary.main,
                  },
                }}
                step={500}
                onChange={handleChange}
                marks
                min={1000}
                max={10000}
                value={value}
                valueLabelDisplay='on'
                label='Precio'
              />
            </Grid>

            <Grid item xs={9} container>
              {/* Utiliza el componente Overflow para aplicar el scroll solo a esta área */}
              {items.concat(items).map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
    );
  }
};
