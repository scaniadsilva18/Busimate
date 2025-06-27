import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

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
    setAnchorEl(null);
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const userRole = localStorage.getItem('userRole');

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(90deg, #142850 60%, #FFC107 200%)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        zIndex: 1300,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Brand / Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/') }>
          <img src="/logo192.png" alt="Logo" style={{ height: 40, marginRight: 12 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              fontSize: '2rem',
              textDecoration: 'none',
              color: '#fff',
              fontFamily: "'Segoe UI', sans-serif",
              letterSpacing: '1px',
            }}
          >
            Busimate
          </Typography>
        </Box>
        {/* CTAs always visible */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            sx={{
              background: '#FFC107',
              color: '#142850',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              '&:hover': { background: '#FFD600' },
            }}
            onClick={() => navigate('/post')}
          >
            Post Your Idea
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#fff',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              '&:hover': { borderColor: '#FFC107', color: '#FFC107' },
            }}
            onClick={() => navigate('/network')}
          >
            Find Partners
          </Button>
        </Box>
        {/* Navigation Links & Profile */}
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {userRole === 'joiner' && (
              <Button component={Link} to="/search" sx={navButtonStyle}>
                Find Ideas
              </Button>
            )}
            {userRole === 'poster' && (
              <>
                <Button component={Link} to="/post" sx={navButtonStyle}>
                  Post Idea
                </Button>
                <Button component={Link} to="/mychats" sx={navButtonStyle}>
                  My Chats
                </Button>
              </>
            )}
            {/* Profile Avatar Dropdown */}
            <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
              <Avatar src={user.photoURL || ''} alt={user.displayName || user.email} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { handleProfileClose(); navigate('/profile'); }}>Account</MenuItem>
              <MenuItem onClick={() => { handleProfileClose(); navigate('/settings'); }}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/signin" sx={navButtonStyle}>
              Sign In
            </Button>
            <Button component={Link} to="/signup" sx={navButtonStyle}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

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