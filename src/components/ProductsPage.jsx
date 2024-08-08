import { useState, useEffect } from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import axios from 'axios';
import ProductCard from './ProductCard';
import TagsBanner from './TagsBanner';
import BrandsBanner from './BrandsBanner'; // Import the new BrandsBanner component

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]); // New state for brands
  const [filters, setFilters] = useState({
    category: null,
    tags: [],
    brand: null, // New filter for brands
    query: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_API_URL}/stores/${
          import.meta.env.VITE_STORE_ID
        }/get-products`;
        const res = await axios.post(url, filters);
        const { data } = res;
        setAvailableTags(data.availableFilters.tags);
        setAvailableBrands(data.availableFilters.brands); // Set available brands
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

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
        availableBrands={availableBrands} // Pass available brands
        filters={filters}
      />
      <main style={{ marginLeft: '240px', padding: '20px', flexGrow: 1 }}>
        <TagsBanner
          filters={filters.tags}
          removeTag={removeTag}
          clearAllTags={clearAllTags}
        />
        <BrandsBanner filters={filters.brand} removeBrand={removeBrand} />
        {loading ? (
          <CircularProgress />
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
