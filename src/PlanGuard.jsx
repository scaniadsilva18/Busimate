import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, checkUserPlan } from './firebase';
import { CircularProgress, Box, Typography } from '@mui/material';

const PlanGuard = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndPlan = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/signin');
          return;
        }

        // For messaging routes that don't require a specific role
        if (!requiredRole) {
          setAccessGranted(true);
          setLoading(false);
          return;
        }

        // For routes that require specific roles
        const planSelected = await checkUserPlan(user.uid);
        const userRole = localStorage.getItem('userRole');

        console.log('PlanGuard: User role:', userRole, 'Required role:', requiredRole);
        console.log('PlanGuard: Plan selected:', planSelected);

        if (!planSelected || userRole !== requiredRole) {
          if (requiredRole === 'joiner') {
            console.log('PlanGuard: Redirecting to /pricingj');
            navigate('/pricingj');
          } else if (requiredRole === 'poster') {
            console.log('PlanGuard: Redirecting to /pricingp');
            navigate('/pricingp');
          }
          return;
        }

        setAccessGranted(true);
      } catch (error) {
        console.error('Error in PlanGuard:', error);
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndPlan();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Verifying your access...</Typography>
      </Box>
    );
  }

  return accessGranted ? children : null;
};

export default PlanGuard;