import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('userRole');
    localStorage.removeItem('joinerPlan');
    localStorage.removeItem('posterPlan');
    navigate('/');
  };

  const userRole = localStorage.getItem('userRole');

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#142850',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Brand / Logo */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            fontWeight: 900,
            fontSize: '2rem',
            textDecoration: 'none',
            color: '#FFC107',
            fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: '1px',
          }}
        >
          Buismate
        </Typography>

        {/* Navigation Links */}
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button component={Link} to="/" sx={navButtonStyle}>
              Home
            </Button>

            {user ? (
              <>
                {userRole === 'joiner' && (
                  <Button 
                    component={Link} 
                    to="/search" 
                    sx={navButtonStyle}
                  >
                    Find Ideas
                  </Button>
                )}
                {userRole === 'poster' && (
                  <>
                    <Button 
                      component={Link} 
                      to="/post" 
                      sx={navButtonStyle}
                    >
                      Post Idea
                    </Button>
                    <Button 
                      component={Link} 
                      to="/mychats" 
                      sx={navButtonStyle}
                    >
                      My Chats
                    </Button>
                  </>
                )}
                <Button 
                  onClick={handleLogout}
                  sx={navButtonStyle}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/signin" sx={navButtonStyle}>
                  Sign In
                </Button>
                <Button component={Link} to="/signup" sx={navButtonStyle}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

// Unified style for all nav buttons
const navButtonStyle = {
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'none',
  fontFamily: "'Segoe UI', sans-serif",
  '&:hover': {
    color: '#FFC107',
    backgroundColor: 'transparent',
  },
};

export default Navbar;