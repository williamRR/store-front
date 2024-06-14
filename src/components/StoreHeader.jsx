import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Grid,
  InputBase,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useStoreTheme } from '../context/StoreThemeContext';
import { useTheme } from '@mui/system';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/logo.jpg';

const StoreHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { styleData } = useStoreTheme();
  const { palette } = styleData || {};
  const { smallLogo } = palette || '';
  console.log(smallLogo);
  const theme = useTheme();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      position='static'
      sx={{
        width: '100%', // Abarcar todo el ancho
        backgroundColor: theme?.palette?.primary?.main, // Color de fondo del tema
      }}
    >
      <Toolbar>
        <Grid container justifyContent={'space-evenly'} alignContent={'center'}>
          <Grid item xs={5}>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              <img
                src={logo}
                alt='Logo'
                style={{
                  objectFit: 'cover',
                  // width: '100%',
                  height: '15vh',
                }}
              />
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {/* Agregado un tema de ejemplo */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Grid>
          <Grid item xs={2} container justifyContent={'flex-end'}>
            {/* Icono de inicio de sesión a la derecha */}
            <div>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Perfil</MenuItem>
                <MenuItem onClick={handleClose}>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default StoreHeader;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  placeholder: 'Buscar...',

  marginTop: '1vh',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  placeholder: 'Buscar...',
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
