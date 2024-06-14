import { Box, Button, Grid, Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

const AdCarousel = () => {
  const images = [
    'https://files.oaiusercontent.com/file-jZfhefDQzL9TqasgGz76ZipS?se=2024-06-13T20%3A58%3A44Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D48871e6a-2290-43b3-8948-9df3affe72b3.webp&sig=RFghv9wz8ZexwbaFGIVi%2BhWKs%2B/yJIQVNqJL9Vw8eE8%3D',
    'https://files.oaiusercontent.com/file-zhLKkK0PuXBobDtVKsiJ6hox?se=2024-06-13T20%3A59%3A50Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D7ca986c0-d007-4a69-a48c-0560e614d493.webp&sig=deQwk8fqcyWbx2GSWOQy3o4TLhze0194lBcclwabaP0%3D',
    'https://yodabbadabba.com/wp-content/uploads/2018/11/BHO-Extraction-Guide.jpg',
    'https://www.smokejokers.com/wp-content/uploads/2020/04/Bonglab-X5-17-cm-azul.jpg',
  ];

  const items = [
    {
      name: 'Random Name #1',
      description: 'Probably the most random thing you have ever seen!',
    },
    {
      name: 'Random Name #2',
      description: 'Hello World!',
    },
    {
      name: 'Random Name #1',
      description: 'Probably the most random thing you have ever seen!',
    },
    {
      name: 'Random Name #2',
      description: 'Hello World!',
    },
  ];
  return (
    <Grid
      // item
      container
      sx={{
        // marginTop: '10px',
        width: '100vw',
        maxHeight: '50vh',
        minHeight: '50vh',

        overflow: 'hidden', // Recortar cualquier contenido que sobresalga
        // display: 'flex', // Usa flexbox para centrar el contenido
        // justifyContent: 'center', // Alinea el contenido en el centro horizontalmente
      }}
    >
      <Grid item xs={12}>
        <Carousel
          autoPlay={true}
          animation='slide'
          indicators={false}
          duration={500}
          navButtonsAlwaysVisible={false}
          // navButtonsProps={{
          //   style: {
          //     // backgroundColor: '#ffffff',
          //     // color: '#494949',
          //     borderRadius: 0,
          //     margin: 0,
          //     // width: '100%',
          //     // minHeight: '100%',
          //     // maxHeight: '100%',
          //   },
          // }}
        >
          {items.map((item, i) => (
            // <Item key={i} item={item} image={images[i]} />
            <img
              src={images[i]}
              alt={item.name}
              key={i}
              style={{
                width: '100%',
                height: '100%', // Altura fija de la imagen
                objectFit: 'fill', // No deformar la imagen
              }}
            />
          ))}
        </Carousel>
      </Grid>
    </Grid>
  );
};

// function Item({ item, image }) {
//   return (
//     <Paper>
//       <img
//         src={image}
//         alt={item.name}

//       />
//       {/* <h2>{item.name}</h2>
//       <p>{item.description}</p>
//       <Button className='CheckButton'>Check it out!</Button> */}
//     </Paper>
//   );
// }

export default AdCarousel;
