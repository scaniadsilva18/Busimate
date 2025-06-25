import React from 'react';
import Navbar from './Navbar';
import { Box, Typography, Container, Paper, Chip } from '@mui/material';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      {/* Enhanced grid background with gradient overlay */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#F0F4F8',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          px: 2,
          py: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(20, 40, 80, 0.05)',
            zIndex: 1,
          }
        }}
      >
        {/* Main content container */}
        <Container 
          maxWidth="xl" 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              border: '3px solid #FFC107',
              boxShadow: '0 20px 50px rgba(20, 40, 80, 0.15)',
              maxWidth: '1000px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #FFC107, transparent)',
                animation: 'shimmer 3s infinite',
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' }
                }
              }
            }}
          >


            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                color: '#142850',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                mb: 4,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              About Us
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#2D3748',
                fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.7rem' },
                fontWeight: 600,
                mb: 5,
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
                '& strong': {
                  color: '#142850',
                  fontWeight: 700,
                }
              }}
            >
              At <strong>Busimate</strong>, we help you find the ideal partner to build your dream. Whether you're a founder, creator, or collaborator, our platform connects you with like-minded professionals for stronger, smarter startups.
            </Typography>

            <Box
              sx={{
                width: '60px',
                height: '4px',
                background: '#FFC107',
                borderRadius: '2px',
                mx: 'auto',
                mb: 4,
              }}
            />

            <Typography
              variant="body1"
              sx={{
                color: '#4A5568',
                fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                lineHeight: 1.8,
                maxWidth: '550px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Our mission is to empower people through purposeful partnerships. Using smart filters, verified profiles, and a community-first approach, Busimate transforms professional networking into meaningful collaboration.
            </Typography>

            {/* Feature highlights */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                justifyContent: 'center',
                mt: 5,
              }}
            >
              {['Smart Filters', 'Verified Profiles', 'Community-First'].map((feature, index) => (
                <Chip
                  key={feature}
                  label={feature}
                  sx={{
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    color: '#B7791F',
                    fontWeight: 500,
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 193, 7, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AboutUs;