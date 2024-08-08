// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Header = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Logazo
        </Typography>
        <div
          style={{
            position: 'relative',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            marginRight: '16px',
            marginLeft: 0,
            width: '100%',
          }}
        >
          <div
            style={{
              padding: '0 16px',
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon />
          </div>
          <InputBase
            placeholder='Search…'
            style={{ paddingLeft: `calc(1em + 32px)`, width: '100%' }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
