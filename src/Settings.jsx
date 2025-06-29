import React, { useState } from 'react';
import { auth } from './firebase';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { Box, Typography, Card, CardContent, Avatar, Button, TextField, Divider, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const genderAvatars = {
  male: '👨',
  female: '👩',
  other: '🧑',
};

const Settings = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [gender, setGender] = useState('other');
  const [password, setPassword] = useState('');
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [status, setStatus] = useState('');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState('public');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(user, { displayName });
      setSnackbar({ open: true, message: 'Profile updated!', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Error updating profile: ' + e.message, severity: 'error' });
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword(user, password);
      setSnackbar({ open: true, message: 'Password updated!', severity: 'success' });
      setPasswordDialog(false);
    } catch (e) {
      setSnackbar({ open: true, message: 'Error updating password: ' + e.message, severity: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user);
      setSnackbar({ open: true, message: 'Account deleted.', severity: 'success' });
      setDeleteDialog(false);
      navigate('/');
    } catch (e) {
      setSnackbar({ open: true, message: 'Error deleting account: ' + e.message, severity: 'error' });
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #f8fafc 60%, #e3e8ee 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 6 }}>
        <Card sx={{ maxWidth: 540, width: '100%', p: 3, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(20,40,80,0.10)' }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#142850' }}>Account Settings</Typography>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 80, height: 80, fontSize: 56 }}>
                  {genderAvatars[gender]}
                </Avatar>
                <Box>
                  <Typography variant="h6">{displayName || user?.email}</Typography>
                  <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                </Box>
              </Box>
              <Divider />
              <TextField label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select value={gender} label="Gender" onChange={e => setGender(e.target.value)}>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleProfileUpdate} sx={{ width: '100%' }}>Update Profile</Button>
              <Divider />
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select value={language} label="Language" onChange={e => setLanguage(e.target.value)}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch checked={notifications} onChange={e => setNotifications(e.target.checked)} />}
                label="Enable Email Notifications"
              />
              <FormControl fullWidth>
                <InputLabel>Profile Privacy</InputLabel>
                <Select value={privacy} label="Profile Privacy" onChange={e => setPrivacy(e.target.value)}>
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="connections">Connections Only</MenuItem>
                </Select>
              </FormControl>
              <Divider />
              <Button variant="outlined" color="primary" onClick={() => setPasswordDialog(true)} sx={{ width: '100%' }}>Change Password</Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/profile')} sx={{ width: '100%' }}>Edit Profile Details</Button>
              <Button variant="outlined" color="error" onClick={() => setDeleteDialog(true)} sx={{ width: '100%' }}>Delete Account</Button>
            </Stack>
          </CardContent>
        </Card>
        {/* Change Password Dialog */}
        <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mt: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordUpdate} variant="contained">Update</Button>
          </DialogActions>
        </Dialog>
        {/* Delete Account Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <Typography color="error">Are you sure you want to delete your account? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteAccount} variant="contained" color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Settings;
