// src/PricingP.jsx
import React from 'react';
import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { auth, updateUserPlan } from './firebase';

const pricingPlans = [
  {
    title: 'Starter Poster',
    price: '₹0',
    features: ['Post 1 business idea', 'Basic visibility', 'Receive 5 messages/month'],
    color: '#AED581',
  },
  {
    title: 'Growth Poster',
    price: '₹799/month',
    features: ['Post unlimited ideas', 'Priority visibility', 'Unlimited messages', 'Talent matching'],
    color: '#4FC3F7',
  },
  {
    title: 'Premium Poster',
    price: '₹1499/month',
    features: ['All Growth features', 'Featured listings', 'AI-powered matching', 'Dedicated support'],
    color: '#BA68C8',
  }
];

const PricingP = () => {
  const navigate = useNavigate();

  const handleChoosePlan = async (planTitle) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/signin?role=poster');
        return;
      }

      const success = await updateUserPlan(user.uid, planTitle);
      
      if (success) {
        localStorage.setItem('posterPlan', planTitle);
        navigate('/post');
      } else {
        alert('Failed to save your plan. Please try again.');
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ py: 8, backgroundColor: '#F0F4F8' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight={700} gutterBottom color="#142850">
            Poster Plans
          </Typography>
          <Typography variant="subtitle1" align="center" mb={6} color="text.secondary">
            Choose a plan that fits your needs as a business owner
          </Typography>

          <Grid container spacing={4}>
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ 
                  p: 4, 
                  borderRadius: 4, 
                  textAlign: 'center', 
                  backgroundColor: plan.color, 
                  color: '#263238',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <Typography variant="h5" fontWeight={600}>{plan.title}</Typography>
                    <Typography variant="h4" fontWeight={800} my={2}>{plan.price}</Typography>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {plan.features.map((feature, i) => (
                        <li key={i} style={{ marginBottom: 8 }}>{`✔ ${feature}`}</li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={() => handleChoosePlan(plan.title)}
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: '#142850',
                      color: '#FFC107',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#0e1e38' }
                    }}
                  >
                    Choose {plan.title.split(' ')[0]}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default PricingP;