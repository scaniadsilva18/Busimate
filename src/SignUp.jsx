import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import Navbar from './Navbar';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, createUserProfile } from './firebase';
import { useLocation, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = new URLSearchParams(location.search).get('role');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  const handleSignUp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName || !email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Create user profile in Firestore
      await createUserProfile(userCredential.user.uid, {
        displayName: fullName,
        email: userCredential.user.email,
        role: role || 'user',
      });

      localStorage.setItem('userRole', role || 'user');

      setSuccessMsg('Account created successfully!');
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setErrorMsg(error.message || 'Registration failed.');
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          backgroundColor: '#F0F4F8',
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 5,
              borderRadius: '20px',
              border: '4px solid #FFC107',
              boxShadow: '0 12px 30px rgba(20, 40, 80, 0.15)',
              backgroundColor: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: '#142850', mb: 3 }}
            >
              Sign Up
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

            <TextField fullWidth label="Full Name" variant="outlined" margin="normal" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button onClick={handleSignUp} variant="contained" fullWidth sx={{
              mt: 3, py: 1.2,
              backgroundColor: '#142850',
              color: '#FFC107',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#0e1e38' },
            }}>
              Register
            </Button>

            {/* Sign In Redirect */}
            <Typography sx={{ mt: 3, color: '#555' }}>
              Already have an account?{' '}
              <span
                style={{ color: '#142850', fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => navigate('/signin')}
              >
                Go to Sign In
              </span>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default SignUp;
