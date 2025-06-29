import React from 'react';
import { Box, Typography, Button, Container, Stack, Card, CardContent, Grid, Fade, Grow, Slide } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center horizontally
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center" justifyContent="center" spacing={6}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <Fade in timeout={800}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5rem' },
                      lineHeight: 1.1,
                      color: '#142850',
                      mb: 3
                    }}
                  >
                    Busi<span style={{ color: '#FFC107' }}>mate</span>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#4a5568',
                      fontWeight: 400,
                      mb: 4,
                      lineHeight: 1.6
                    }}
                  >
                    The professional network connecting founders, entrepreneurs, and collaborators to build successful ventures.
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Link to="/getstarted" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="contained"
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          backgroundColor: '#142850',
                          color: '#FFC107',
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: '#0d1e3a'
                          }
                        }}
                      >
                        Get Started
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderColor: '#142850',
                        color: '#142850',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: 'rgba(20,40,80,0.05)'
                        }
                      }}
                      href="#features"
                    >
                      Learn More
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Empty right side for clean, minimal look */}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#142850',
                mb: 2
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#4a5568',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Simple steps to find your perfect business match
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "Create Profile",
                description: "Showcase your skills, experience, and what you're looking for in a partner."
              },
              {
                title: "Find Matches",
                description: "Our algorithm connects you with the most relevant professionals."
              },
              {
                title: "Build Together",
                description: "Collaborate using our tools to manage projects and grow."
              }
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(20,40,80,0.08)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, height: '100%' }}>
                      <Box
                        sx={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          bgcolor: '#FFC107',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          color: '#142850',
                          fontWeight: 700,
                          fontSize: '1.5rem'
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: '#142850',
                          mb: 2
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#4a5568',
                          lineHeight: 1.6
                        }}
                      >
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 10, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#142850',
                mb: 2
              }}
            >
              Key Features
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#4a5568',
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Everything you need to find the right business partner
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              "Smart matching algorithm",
              "Verified professional profiles",
              "Secure messaging system",
              "Project collaboration tools",
              "Global network access",
              "Regular networking events"
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={800 + index * 150}>
                  <Box
                    sx={{
                      p: 3,
                      height: '100%',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(20,40,80,0.06)',
                      borderLeft: '4px solid #FFC107',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box
                      sx={{
                        color: '#FFC107',
                        mr: 2,
                        fontSize: '1.5rem',
                        lineHeight: 1
                      }}
                    >
                      •
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: '#142850'
                      }}
                    >
                      {feature}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 12, backgroundColor: '#142850' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3
              }}
            >
              Ready to find your business match?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                mb: 5,
                opacity: 0.9
              }}
            >
              Join thousands of professionals building successful partnerships.
            </Typography>
            <Link to="/getstarted" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  backgroundColor: '#FFC107',
                  color: '#142850',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#ffd700'
                  }
                }}
              >
                Get Started Now
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;