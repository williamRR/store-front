import React, { useState, useEffect } from 'react';
import { Grid, Skeleton } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { useStoreConfig } from '../context/StoreConfigContext';

const AdCarousel = () => {
  const { images = { carouselImages: [] } } = useStoreConfig(); // Valor predeterminado para images
  const [loading, setLoading] = useState(true);

  // Simular el tiempo de carga de las imágenes
  useEffect(() => {
    if (images?.carouselImages?.length > 0) {
      setLoading(false);
    }
  }, [images.carouselImages]);

  return (
    <Grid
      container
      sx={{
        width: '100vw',
        maxHeight: '50vh',
        minHeight: '50vh',
        overflow: 'hidden',
        backgroundColor: '#f7f7f7',
      }}
    >
      <Grid item xs={12}>
        {loading ? (
          <Skeleton
            variant='rectangular'
            width='100%'
            height='100%'
            animation='wave'
          />
        ) : (
          <Carousel
            autoPlay={true}
            animation='slide'
            indicators={false}
            duration={500}
            navButtonsAlwaysVisible={false}
          >
            {images.carouselImages.map((image, i) => (
              <img
                src={image}
                alt={`Carousel image ${i}`}
                key={i}
                style={{
                  width: '100%',
                  height: '50vh', // Altura fija de la imagen
                  objectFit: 'cover', // Cubrir el contenedor sin deformar la imagen
                }}
              />
            ))}
          </Carousel>
        )}
      </Grid>
    </Grid>
  );
};

export default AdCarousel;
