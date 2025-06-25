import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/signup'); // Change this path if your signup route is different
  }, [navigate]);

  return null; // No UI needed
};

export default GetStarted;
