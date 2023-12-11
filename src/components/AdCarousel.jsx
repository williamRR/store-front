import { Box, Button, Grid, Paper } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

const AdCarousel = () => {
  const images = [
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.po1iOHp8IKYwh3ytDB9EigHaFb%26pid%3DApi&f=1&ipt=630f284af86b382d2698d2c8cbc043b0ceabb88ebe8e39416b03092de0055389&ipo=images',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.jMNjsJh1Vvo4ZPGhse-XPAHaGw%26pid%3DApi&f=1&ipt=d84dc2bfae45640e9fa6e2a975d1650a8598be38942d9cc5a1ad54ee3f8e1f4a&ipo=images',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.rX-6ovRpk0DbhwwlB703_gHaE6%26pid%3DApi&f=1&ipt=cbd38a8713d64563be98d18a0b32aa38361f6e9a6ce36f1b68e6c56430d95b20&ipo=images',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.cyMU1pjjrJCsdYqxigcf3AHaE8%26pid%3DApi&f=1&ipt=d97a8398631f241504c411c96ee113dc0af914d91fe242f8a5d45a0eb1f361f1&ipo=images',
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
        maxHeight: '25vh',
        minHeight: '25vh',

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
