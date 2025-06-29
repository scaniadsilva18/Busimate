import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const genderAvatars = {
  male: '👨',
  female: '👩',
  other: '🧑',
};

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [gender, setGender] = useState('other');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      setLoading(false);
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists() && userDoc.data().gender) {
          setGender(userDoc.data().gender);
        }
      }
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
        background: 'rgba(20,40,80,0.85)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px 0 rgba(20,40,80,0.18)',
        borderBottom: '1.5px solid #e3e8ee',
        zIndex: 1300,
        transition: 'background 0.3s',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', minHeight: 80 }}>
        {/* Brand / Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1 }} onClick={() => navigate('/') }>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.5rem', md: '2.2rem' },
              textDecoration: 'none',
              color: '#fff',
              fontFamily: "'Segoe UI', 'Poppins', sans-serif",
              letterSpacing: '1.5px',
              textShadow: '0 2px 8px rgba(20,40,80,0.10)',
              transition: 'color 0.2s',
              '&:hover': { color: '#FFD600' },
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
              background: 'linear-gradient(90deg, #FFD600 60%, #FFC107 100%)',
              color: '#142850',
              fontWeight: 700,
              borderRadius: 3,
              px: 3,
              boxShadow: '0 2px 8px 0 rgba(255,214,0,0.10)',
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              '&:hover': { background: 'linear-gradient(90deg, #FFC107 60%, #FFD600 100%)' },
              transition: 'background 0.2s',
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
              borderRadius: 3,
              px: 3,
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px 0 rgba(20,40,80,0.05)',
              '&:hover': { borderColor: '#FFD600', color: '#FFD600', background: 'rgba(255,255,255,0.04)' },
              transition: 'all 0.2s',
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
              <Avatar sx={{ fontSize: 28 }}>{genderAvatars[gender]}</Avatar>
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