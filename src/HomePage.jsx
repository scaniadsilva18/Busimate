import React from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#F5F5F5',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          {/* Brand Name */}
          <Typography
            sx={{
              fontWeight: '900',
              fontSize: { xs: '3.5rem', sm: '5.5rem', md: '7.5rem' },
              fontFamily: "'Segoe UI', sans-serif",
              color: '#142850',
              lineHeight: 1.1,
              letterSpacing: '-2px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Busi
            <Box
              component="span"
              sx={{
                color: '#FFC107',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              mate
            </Box>
          </Typography>

          {/* Tagline */}
          <Typography
            variant="h5"
            sx={{
              mt: 3,
              color: '#424242',
              fontWeight: 400,
              fontStyle: 'italic',
            }}
          >
            Discover your perfect business partner!
          </Typography>

          {/* Natural About Info - No Box */}
          <Typography
            variant="body1"
            sx={{
              mt: 4,
              color: '#444',
              fontSize: '1.15rem',
              lineHeight: 1.8,
              fontWeight: 400,
              maxWidth: '720px',
              mx: 'auto',
            }}
          >
            <strong style={{ color: '#142850' }}>Busimate</strong> is where ideas meet execution. Whether you're a visionary founder or a talented collaborator, our platform helps you connect, create, and grow. We’re here to spark partnerships that build tomorrow’s boldest ventures — together.
          </Typography>

          {/* CTA Button */}
          <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
            <Link to="/getstarted" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#142850',
                  color: '#FFC107',
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 6px 18px rgba(20,40,80,0.3)',
                  transition: '0.3s ease',
                  '&:hover': {
                    backgroundColor: '#0B1E3A',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  },
                }}
              >
                Get Started
              </Button>
            </Link>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
