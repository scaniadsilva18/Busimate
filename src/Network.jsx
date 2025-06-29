import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Box, Typography, Grid, CircularProgress, Snackbar, Alert, Button, Paper, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import NetworkCard from './NetworkCard';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Network = () => {
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [received, setReceived] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersSnap = await getDocs(collection(db, 'users'));
      const userList = usersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== currentUser?.uid);
      setUsers(userList);
      setLoading(false);
    };
    const fetchCurrentUserProfile = async () => {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      setCurrentUserProfile(userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null);
    };
    if (currentUser) {
      fetchUsers();
      fetchCurrentUserProfile();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      setConnections(data.connections || []);
      setPending(data.pendingConnections || []);
      setReceived(data.receivedRequests || []);
      setCurrentUserProfile(prev => prev ? { ...prev, following: data.following || [] } : prev);
    };
    fetchConnections();
  }, [currentUser]);

  const handleConnect = async (targetUserId) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.uid), {
      pendingConnections: arrayUnion(targetUserId)
    });
    await updateDoc(doc(db, 'users', targetUserId), {
      receivedRequests: arrayUnion(currentUser.uid)
    });
    setPending(prev => [...prev, targetUserId]);
    setSnackbar({ open: true, message: 'Connection request sent!', severity: 'success' });
  };

  const handleAccept = async (requesterId) => {
    if (!currentUser) return;
    // Accept connection
    await updateDoc(doc(db, 'users', currentUser.uid), {
      receivedRequests: arrayRemove(requesterId),
      connections: arrayUnion(requesterId),
      following: arrayUnion(requesterId) // Add to following
    });
    await updateDoc(doc(db, 'users', requesterId), {
      pendingConnections: arrayRemove(currentUser.uid),
      connections: arrayUnion(currentUser.uid),
      following: arrayUnion(currentUser.uid) // Add to following
    });
    setReceived(prev => prev.filter(id => id !== requesterId));
    setConnections(prev => [...prev, requesterId]);
    setSnackbar({ open: true, message: 'Connection accepted!', severity: 'success' });
  };

  // Get connection user objects
  const connectionUsers = users.filter(u => connections.includes(u.id));

  const genderAvatars = {
    male: '👨',
    female: '👩',
    other: '🧑',
  };

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: '100vw', mx: 'auto', mt: 4, px: { xs: 1, md: 4 }, display: 'flex', gap: 4 }}>
        {/* Sidebar */}
        <Paper elevation={6} sx={{ minWidth: 270, maxWidth: 320, p: 3, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.95)', display: { xs: 'none', md: 'block' }, height: 'fit-content', alignSelf: 'flex-start', boxShadow: '0 8px 32px 0 rgba(20,40,80,0.10)', backdropFilter: 'blur(4px)' }}>
          {currentUserProfile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, fontSize: 36, mb: 1, bgcolor: '#e3e8ee', color: '#142850', boxShadow: '0 2px 8px 0 rgba(20,40,80,0.08)' }}>
                {currentUserProfile.gender ? genderAvatars[currentUserProfile.gender] : (currentUserProfile.displayName && currentUserProfile.displayName[0]) || (currentUserProfile.email && currentUserProfile.email[0]) || '?'}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#142850' }}>{currentUserProfile.displayName || currentUserProfile.email}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{currentUserProfile.headline || currentUserProfile.role || 'Entrepreneur'}</Typography>
              <Typography variant="body2" color="text.secondary">{currentUserProfile.bio || 'No bio provided.'}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>{(currentUserProfile.connections && currentUserProfile.connections.length) || 0}</Typography>
                  <Typography variant="caption" color="text.secondary">Connections</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>{(currentUserProfile.following && currentUserProfile.following.length) || 0}</Typography>
                  <Typography variant="caption" color="text.secondary">Following</Typography>
                </Box>
              </Box>
            </Box>
          )}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 1 }}>Connections</Typography>
          <List dense>
            {connectionUsers.length === 0 && <ListItem><ListItemText primary="No connections yet." /></ListItem>}
            {connectionUsers.map(user => (
              <ListItem key={user.id} sx={{ py: 0.5 }}>
                <ListItemAvatar>
                  <Avatar src={user.photoURL || ''} sx={{ width: 32, height: 32 }}>
                    {(user.displayName && user.displayName[0]) || (user.email && user.email[0]) || '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.displayName || user.email} secondary={user.headline || user.role || 'Entrepreneur'} />
              </ListItem>
            ))}
          </List>
        </Paper>
        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: '1600px', mx: 'auto' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, color: '#142850' }}>
            Find Partners
          </Typography>
          {received.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1e3a8a' }}>Connection Requests</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {users.filter(u => received.includes(u.id)).map(user => (
                  <Box key={user.id} sx={{ width: '100%' }}>
                    <NetworkCard
                      user={user}
                      isConnected={connections.includes(user.id)}
                      isPending={false}
                      onConnect={() => {}}
                      fullWidth
                    />
                    <Button variant="contained" color="primary" sx={{ mt: 1, width: '100%' }} onClick={() => handleAccept(user.id)}>
                      Accept
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
              {users.filter(u => !received.includes(u.id)).map(user => (
                <Box key={user.id} sx={{ width: '100%', cursor: 'pointer' }} onClick={() => navigate(`/user/${user.id}`)}>
                  <NetworkCard
                    user={user}
                    isConnected={connections.includes(user.id)}
                    isPending={pending.includes(user.id)}
                    onConnect={(e) => { e.stopPropagation(); handleConnect(user.id); }}
                    fullWidth
                  />
                </Box>
              ))}
            </Box>
          )}
          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};

export default Network;
