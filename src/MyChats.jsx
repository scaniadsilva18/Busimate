import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { List, ListItem, ListItemText, CircularProgress, Box, Typography, Dialog } from '@mui/material';
import Message from './Message'; // Import the Message component
import Navbar from './Navbar';

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/signin');
          return;
        }
        // Fetch all posts by this user
        const postsQuery = query(collection(db, 'posts'), where('uid', '==', user.uid));
        const postsSnap = await getDocs(postsQuery);
        // Show all posts, not just those with joiners
        const postList = postsSnap.docs.map(doc => ({
          postId: doc.id,
          postTitle: doc.data().name || 'Untitled',
          description: doc.data().description || '',
          createdAt: doc.data().createdAt,
          joiners: Array.isArray(doc.data().joiners) ? doc.data().joiners.filter(j => !!j) : []
        }));
        setChats(postList);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [navigate]);

  const handleChatClick = (postId, joinerEmail) => {
    navigate(`/message/${postId}?joiner=${encodeURIComponent(joinerEmail)}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Loading your chats...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, color: '#142850', mb: 4, letterSpacing: 1 }}>My Posts</Typography>
        <List sx={{ width: '100%', bgcolor: '#f4f8fb', borderRadius: 3, boxShadow: 3, p: 0 }}>
          {chats.length === 0 ? (
            <Typography sx={{ p: 4, color: '#64748b', textAlign: 'center' }}>No posts found.</Typography>
          ) : (
            chats.map((chat) => (
              <ListItem
                key={chat.postId}
                alignItems="flex-start"
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  mb: 2,
                  border: activePost && activePost.postId === chat.postId ? '2px solid #FFC107' : '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 3,
                  background: activePost && activePost.postId === chat.postId ? 'linear-gradient(135deg, #fffbe6 0%, #f4f8fb 100%)' : 'linear-gradient(135deg, #fff 0%, #f4f8fb 100%)',
                  boxShadow: activePost && activePost.postId === chat.postId ? 6 : 2,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 8, borderColor: '#FFC107', background: 'linear-gradient(135deg, #fffbe6 0%, #f4f8fb 100%)' }
                }}
                onClick={() => setActivePost(chat)}
                button
                selected={activePost && activePost.postId === chat.postId}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#142850', mb: 0.5, letterSpacing: 0.5 }}>{chat.postTitle}</Typography>
                  {chat.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{chat.description}</Typography>
                  )}
                  {chat.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      {typeof chat.createdAt.toDate === 'function' ? chat.createdAt.toDate().toLocaleDateString() : ''}
                    </Typography>
                  )}
                  {chat.joiners.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: '#1e3a8a', letterSpacing: 0.2 }}>
                      Joiners: {chat.joiners.join(', ')}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))
          )}
        </List>
        <Dialog open={!!activePost} onClose={() => setActivePost(null)} fullScreen
          PaperProps={{
            sx: {
              bgcolor: 'transparent',
              color: '#fff',
              p: 0,
              boxShadow: 'none',
            }
          }}
        >
          {activePost && (
            <Box sx={{
              width: '100vw',
              height: '100vh',
              minHeight: '100dvh',
              minWidth: '100vw',
              background: 'linear-gradient(135deg, #142850 0%, #274b8a 60%, #1e3a8a 100%)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden',
              p: 0,
              m: 0,
            }}>
              {/* Header Bar */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2, sm: 4 },
                py: 2,
                width: '100%',
                background: 'linear-gradient(90deg, #1e3a8a 60%, #FFC107 200%)',
                boxShadow: '0 4px 24px 0 rgba(20,40,80,0.10)',
                backdropFilter: 'blur(6px)',
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
                minHeight: 72,
                zIndex: 10,
              }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFC107', letterSpacing: 1 }}>{activePost.postTitle}</Typography>
                  {activePost.description && (
                    <Typography variant="body2" sx={{ color: '#e3e8ee', mt: 0.5 }}>{activePost.description}</Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#FFC107',
                    fontSize: 32,
                    borderRadius: '50%',
                    transition: 'background 0.2s',
                    p: 0.5,
                    '&:hover': {
                      background: 'rgba(255,193,7,0.12)',
                      color: '#fff',
                    },
                    userSelect: 'none',
                  }}
                  onClick={() => setActivePost(null)}
                >
                  ✕
                </Box>
              </Box>
              {/* Chat Area - full screen, modern look */}
              <Box sx={{
                flex: 1,
                width: '100vw',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'rgba(20,40,80,0.96)',
                borderRadius: 0,
                boxShadow: 'none',
                border: 'none',
                minHeight: '0',
                p: 0,
                m: 0,
                overflow: 'hidden',
              }}>
                <Message postId={activePost.postId} hideNavbar themeColors={{
                  background: 'rgba(20,40,80,0.96)',
                  primary: '#FFD600',
                  secondary: '#fff',
                  accent: '#1e3a8a',
                  border: '#e3e8ee',
                  sentBubble: 'linear-gradient(135deg, #1e3a8a 60%, #274b8a 100%)',
                  receivedBubble: '#fff',
                  sentText: '#fff',
                  receivedText: '#142850',
                  inputBg: '#f8fafc',
                }} />
              </Box>
            </Box>
          )}
        </Dialog>
      </Box>
    </>
  );
};

export default MyChats;