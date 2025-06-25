// src/SignIn.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import Navbar from './Navbar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, checkUserPlan } from './firebase';
import { useLocation, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const preSelectedRole = new URLSearchParams(location.search).get('role');

  useEffect(() => {
    if (preSelectedRole && !role) {
      setRole(preSelectedRole);
    }
  }, [preSelectedRole, role]);

  const handleSignIn = async () => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(true);

      const currentRole = role || preSelectedRole;

      if (!currentRole) {
        setErrorMsg('Please select a role.');
        setLoading(false);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem('userRole', currentRole);
      setSuccessMsg('Logged in successfully!');

      // Check if user has already selected a plan
      const user = auth.currentUser;
      const hasPlan = await checkUserPlan(user.uid);

      setTimeout(() => {
        if (hasPlan) {
          // If plan already selected, go to appropriate page
          if (currentRole === 'joiner') {
            navigate('/search');
          } else if (currentRole === 'poster') {
            navigate('/post');
          }
        } else {
          // If no plan selected, redirect to pricing
          if (currentRole === 'joiner') {
            navigate('/pricingj');
          } else if (currentRole === 'poster') {
            navigate('/pricingp');
          }
        }
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message || 'Failed to log in');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        backgroundColor: '#F0F4F8',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{
            p: 5,
            borderRadius: '20px',
            border: '4px solid #FFC107',
            backgroundColor: '#fff',
            textAlign: 'center',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#142850', mb: 3 }}>
              Sign In
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Sign in as</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Sign in as"
              >
                <MenuItem value="poster">Business Poster</MenuItem>
                <MenuItem value="joiner">Business Joiner</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={handleSignIn}
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.2,
                backgroundColor: '#142850',
                color: '#FFC107',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '10px',
                '&:hover': { backgroundColor: '#0e1e38' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default SignIn;