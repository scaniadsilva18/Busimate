import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Avatar, Button, Typography, Box, Chip, Tooltip, Divider, Stack } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import EmailIcon from '@mui/icons-material/Email';

const NetworkCard = ({ user, onConnect, isConnected, isPending, fullWidth }) => {
  const avatarLetter = user.displayName && user.displayName.length > 0
    ? user.displayName[0]
    : (user.email && user.email.length > 0 ? user.email[0] : '?');

  return (
    <Card sx={{
      width: fullWidth ? '100%' : 370,
      minHeight: 260,
      m: 2,
      borderRadius: 4,
      boxShadow: 6,
      background: 'linear-gradient(135deg, #f8fafc 60%, #e3e8ee 100%)',
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: 12, borderColor: '#FFC107' },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <CardHeader
        avatar={<Avatar src={user.photoURL || ''} sx={{ bgcolor: '#142850', color: '#FFC107', width: 48, height: 48, fontSize: 24 }}>{avatarLetter}</Avatar>}
        title={<Typography variant="h6" sx={{ fontWeight: 700, color: '#142850' }}>{user.displayName || user.email || 'Unknown User'}</Typography>}
        subheader={<Typography variant="body2" color="text.secondary">{user.headline || user.role || 'Entrepreneur'}</Typography>}
        action={user.email && (
          <Tooltip title={user.email}>
            <Chip icon={<EmailIcon sx={{ color: '#1e3a8a' }} />} label="Email" size="small" sx={{ bgcolor: '#e3e8ee', color: '#1e3a8a', fontWeight: 600 }} />
          </Tooltip>
        )}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 40 }}>
          {user.bio || 'No bio provided.'}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
          {(user.skills && Array.isArray(user.skills)) ? user.skills.slice(0, 4).map((skill, idx) => (
            <Chip key={idx} label={skill} size="small" sx={{ bgcolor: '#142850', color: '#fff', fontWeight: 500 }} />
          )) : null}
        </Stack>
        {user.skills && user.skills.length > 4 && (
          <Typography variant="caption" color="text.secondary">+{user.skills.length - 4} more</Typography>
        )}
        <Divider sx={{ my: 1 }} />
      </CardContent>
      <CardActions sx={{ pt: 0, pb: 2, px: 2, justifyContent: 'flex-end' }}>
        {isConnected ? (
          <Button variant="contained" color="success" startIcon={<CheckIcon />} disabled fullWidth sx={{ fontWeight: 700 }}>
            Connected
          </Button>
        ) : isPending ? (
          <Button variant="outlined" color="warning" startIcon={<PendingIcon />} disabled fullWidth sx={{ fontWeight: 700 }}>
            Pending
          </Button>
        ) : (
          <Button variant="contained" startIcon={<PersonAddIcon />} onClick={onConnect} fullWidth sx={{ fontWeight: 700, background: '#FFC107', color: '#142850', '&:hover': { background: '#FFD600' } }}>
            Connect
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default NetworkCard;
