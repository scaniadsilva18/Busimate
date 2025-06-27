import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Box, Typography, Avatar, Paper, Divider, Chip, Card, CardContent, CardHeader, Grid, Stack, CircularProgress } from '@mui/material';
import Navbar from './Navbar';
import { formatDistanceToNow } from 'date-fns';
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LanguageIcon from '@mui/icons-material/Language';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      setUser(userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null);
    };
    const fetchPosts = async () => {
      const postsQuery = query(collection(db, 'posts'), where('uid', '==', userId));
      const postsSnap = await getDocs(postsQuery);
      setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    setLoading(true);
    Promise.all([fetchUser(), fetchPosts()]).then(() => setLoading(false));
  }, [userId]);

  if (loading) return <Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress size={60} /></Box>;
  if (!user) return <Box sx={{ p: 6, textAlign: 'center' }}>User not found.</Box>;

  return (
    <>
      <Navbar />
      <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #f8fafc 60%, #e3e8ee 100%)', pb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Profile Header Card */}
          <Card elevation={8} sx={{ borderRadius: 5, bgcolor: 'rgba(255,255,255,0.98)', p: 4, boxShadow: '0 8px 32px 0 rgba(20,40,80,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={user.photoURL || ''} sx={{ width: 110, height: 110, fontSize: 48, bgcolor: '#e3e8ee', color: '#142850', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', mb: 2 }}>
              {(user.displayName && user.displayName[0]) || '?'}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#142850', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>{user.displayName || 'User'}</Typography>
            <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 600, fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', mb: 1 }}>{user.headline || 'Headline / Role'}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', mb: 1 }}>{user.location || 'Location'}</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', mb: 1 }}>{user.bio || 'No bio provided.'}</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1 }}>
              {(user.skills && typeof user.skills === 'string' ? user.skills.split(',') : user.skills || []).map((skill, idx) => (
                <Chip key={idx} label={skill.trim()} size="small" sx={{ bgcolor: '#142850', color: '#fff', fontWeight: 500, fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }} />
              ))}
            </Stack>
          </Card>

          {/* About Section */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 1 }}>About</Typography>
            <Typography variant="body1" sx={{ color: '#142850' }}>{user.whoAmI || 'Not provided.'}</Typography>
          </Card>

          {/* Experience Section */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <WorkIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Experience</Typography>
            </Stack>
            {Array.isArray(user.experience) && user.experience.length > 0 ? (
              <Stack spacing={2}>
                {user.experience.map((exp, idx) => (
                  <Card key={idx} sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, boxShadow: 'none' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{exp.title || 'Job Title'}</Typography>
                    <Typography variant="body2">{exp.company || 'Company'}</Typography>
                    <Typography variant="body2" color="text.secondary">{exp.duration || 'Duration'}</Typography>
                    <Typography variant="body2" color="text.secondary">{exp.description || 'Description'}</Typography>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" sx={{ color: '#142850' }}>Not provided.</Typography>
            )}
          </Card>

          {/* Education Section */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <SchoolIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Education</Typography>
            </Stack>
            {Array.isArray(user.education) && user.education.length > 0 ? (
              user.education.map((edu, idx) => (
                <Box key={idx} sx={{ mb: 1, ml: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{edu.degree || 'Degree'}</Typography>
                  <Typography variant="body2">{edu.school || 'School'}</Typography>
                  <Typography variant="body2" color="text.secondary">{edu.duration || 'Duration'}</Typography>
                  <Typography variant="body2" color="text.secondary">{edu.description || 'Description'}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">Not provided.</Typography>
            )}
          </Card>

          {/* Licenses & Certifications */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <AssignmentIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Licenses & Certifications</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: '#142850' }}>{user.licenses || 'Not provided.'}</Typography>
          </Card>

          {/* Projects */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <EmojiEventsIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Projects</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: '#142850' }}>{user.projects || 'Not provided.'}</Typography>
          </Card>

          {/* Languages */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <LanguageIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Languages</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: '#142850' }}>{user.languages || 'Not provided.'}</Typography>
          </Card>

          {/* Volunteer Experience */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <VolunteerActivismIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Volunteer Experience</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: '#142850' }}>{user.volunteer || 'Not provided.'}</Typography>
          </Card>

          {/* Accomplishments */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <EmojiEventsIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Accomplishments</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: '#142850' }}>{user.accomplishments || 'Not provided.'}</Typography>
          </Card>

          {/* Contact Info */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#fff', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <ContactMailIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700 }}>Contact Info</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: '#142850' }}>{user.contact || 'Not provided.'}</Typography>
          </Card>

          {/* Posts Section */}
          <Card elevation={4} sx={{ borderRadius: 5, p: 3, bgcolor: '#f8fafc', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)' }}>
            <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2 }}>Posts by {user.displayName || 'User'}</Typography>
            {posts.length === 0 ? (
              <Typography sx={{ color: '#64748b', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>No posts yet.</Typography>
            ) : (
              <Stack spacing={3}>
                {posts.map(post => (
                  <Card key={post.id} elevation={2} sx={{ borderRadius: 3, bgcolor: '#fff', p: 2, transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)', '&:hover': { boxShadow: '0 8px 32px 0 rgba(20,40,80,0.16)', transform: 'translateY(-2px) scale(1.01)' } }}>
                    <CardHeader
                      avatar={<Avatar src={user.photoURL || ''} sx={{ bgcolor: '#e3e8ee', color: '#142850', fontWeight: 700 }}>{(user.displayName && user.displayName[0]) || '?'}</Avatar>}
                      title={<Typography variant="subtitle1" sx={{ color: '#142850', fontWeight: 700 }}>{user.displayName || 'User'}</Typography>}
                      subheader={<Typography variant="caption" sx={{ color: '#64748b' }}>{post.createdAt && post.createdAt.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : ''}</Typography>}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 1 }}>{post.name || 'Untitled'}</Typography>
                      <Typography variant="body1" sx={{ color: '#142850', mb: 2 }}>{post.description || 'No description.'}</Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
                        {(post.skillsNeeded && typeof post.skillsNeeded === 'string' ? post.skillsNeeded.split(',') : post.skillsNeeded || []).map((skill, idx) => (
                          <Chip key={idx} label={skill.trim()} size="small" sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 600, fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }} />
                        ))}
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ color: '#64748b', fontSize: 15 }}>
                        <BusinessCenterIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        <span>Industry: {post.industry || 'N/A'}</span>
                        <WorkIcon sx={{ fontSize: 18, ml: 2, mr: 0.5 }} />
                        <span>Stage: {post.stage || 'N/A'}</span>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;
