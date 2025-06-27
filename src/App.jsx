import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import PricingJ from './PricingJ';
import PricingP from './PricingP';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Message from './Message';
import GetStarted from './GetStarted';
import Post from './Post';
import Search from './Search';
import PlanGuard from './PlanGuard';
import Conversations from './Conversations';
import MyChats from './MyChats';
import Network from './Network';
import Profile from './Profile';
import UserProfile from './UserProfile';

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricingp" element={<PricingP />} />
        <Route path="/pricingj" element={<PricingJ />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/getstarted" element={<GetStarted />} />

        {/* Protected routes */}
        <Route 
          path="/post" 
          element={
            <PlanGuard requiredRole="poster">
              <Post />
            </PlanGuard>
          } 
        />
        <Route 
          path="/search" 
          element={
            <PlanGuard requiredRole="joiner">
              <Search />
            </PlanGuard>
          } 
        />
        <Route 
          path="/network" 
          element={
            <PlanGuard>
              <Network />
            </PlanGuard>
          } 
        />
        <Route path="/profile" element={<PlanGuard><Profile /></PlanGuard>} />
        <Route path="/user/:userId" element={<PlanGuard><UserProfile /></PlanGuard>} />
        
        {/* Messaging routes */}
        <Route 
          path="/message/:postId" 
          element={
            <PlanGuard>
              <Message />
            </PlanGuard>
          } 
        />
        <Route 
          path="/conversations" 
          element={
            <PlanGuard>
              <Conversations />
            </PlanGuard>
          } 
        />
        <Route 
          path="/mychats" 
          element={
            <PlanGuard>
              <MyChats />
            </PlanGuard>
          } 
        />
        <Route 
          path="/chat/:chatId" 
          element={
            <PlanGuard>
              <Message />
            </PlanGuard>
          } 
        />
      </Routes>
    </>
  );
};

export default App;