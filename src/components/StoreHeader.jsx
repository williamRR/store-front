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
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useStoreConfig } from '../context/StoreConfigContext';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCart from '@mui/icons-material/ShoppingCart';

const StoreHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const {
    images: { smallLogo },
    theme,
    isAuthenticated,
  } = useStoreConfig();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
    handleClose();
  };

  const handleLogout = () => {
    // Aquí podrías agregar la lógica para cerrar sesión
    navigate('/');
    handleClose();
  };

  return (
    <AppBar
      position='static'
      elevation={0}
      sx={{
        backgroundColor: theme?.palette?.primary?.main,
      }}
    >
      <Toolbar
        sx={{
          width: '90vw',
          marginLeft: '5vw',
        }}
      >
        <Grid container justifyContent={'space-between'} alignItems={'center'}>
          <Typography
            variant='h6'
            component='div'
            onClick={handleLogoClick}
            sx={{ cursor: 'pointer' }}
          >
            <img
              src={smallLogo}
              alt='Logo'
              style={{
                objectFit: 'cover',
                margin: 10,
                marginLeft: 20,
                height: '8vh',
              }}
            />
          </Typography>
          <Grid
            item
            xs={6}
            sx={{
              width: '100%',
            }}
          >
            <Box display='flex' justifyContent='center'>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder='Buscar...'
                  inputProps={{
                    'aria-label': 'search',
                    width: '100%',
                  }}
                />
              </Search>
            </Box>
          </Grid>
          <Grid item container xs={1} sx={{ justifyContent: 'space-around' }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              // onClick={toggleDrawer(!isOpen)}
              color='inherit'
            >
              <ShoppingCart />
            </IconButton>
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
              {!isAuthenticated && (
                <MenuItem onClick={handleLogin}>Iniciar Sesión</MenuItem>
              )}
              {isAuthenticated && (
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              )}
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default StoreHeader;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#ffffff', 0.25),
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.35),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  border: `1px solid ${alpha('#ffffff', 0.5)}`,
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
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));
