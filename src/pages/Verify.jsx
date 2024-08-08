import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const navigate = useNavigate();
  const { verifyToken } = useParams();
  const [error, setError] = useState('');

  const verify = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/auth/verify-email/${verifyToken}`,
      );
      if (response.status === 200) {
        toast.success('Email verified successfully!');
        navigate('/login');
      }
    } catch (error) {
      setError(
        `Something went wrong. Please try again.${JSON.stringify(error)}`,
      );
    }
  };

  useEffect(() => {
    verify();
  }, [verifyToken]); // Only run when verifyToken changes

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Verify Email
        </Typography>
        {error ? (
          <Typography color='error' sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : (
          <Typography sx={{ mt: 2 }}>Verifying your email...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Verify;
