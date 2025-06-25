import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { auth, db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  getDoc,
  updateDoc,
  arrayUnion 
} from 'firebase/firestore';
import Navbar from './Navbar';
import './message.css';
import { 
  IconButton, 
  TextField, 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Fab
} from '@mui/material';
import { 
  Send, 
  AttachFile, 
  EmojiEmotions, 
  MoreVert, 
  Reply, 
  Delete,
  Edit,
  KeyboardArrowUp
} from '@mui/icons-material';

const Message = ({ postId: propPostId, joinerEmail: propJoinerEmail, hideNavbar, themeColors }) => {
  const params = useParams();
  const location = useLocation();
  const postId = propPostId || params.postId;
  const joinerEmail = propJoinerEmail || new URLSearchParams(location.search).get('joiner');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Default theme colors if not provided
  const colors = themeColors || {
    background: '#142850',
    primary: '#FFC107',
    secondary: '#fff',
    accent: '#1e3a8a',
    border: '#e3e8ee',
    sentBubble: '#1e3a8a',
    receivedBubble: '#fff',
    sentText: '#fff',
    receivedText: '#142850',
    inputBg: '#e3e8ee',
  };

  useEffect(() => {
    if (!postId) return;
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts', postId, 'messages'), orderBy('createdAt', 'asc')),
      (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        console.error('Error listening to messages:', error);
      }
    );
    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && postId) {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        setPost(postSnap.exists() ? postSnap.data() : null);
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    scrollToBottom();
    
    // Handle scroll to show/hide scroll-to-top button
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        setShowScrollTop(scrollHeight - scrollTop - clientHeight > 200);
      }
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredMessages = React.useMemo(() => {
    if (!user || !post) return messages;
    if (user.email === post.email && joinerEmail) {
      return messages.filter(
        msg =>
          (msg.sender === user.email && msg.senderUid === user.uid) ||
          (msg.sender === joinerEmail)
      );
    }
    return messages;
  }, [messages, user, post, joinerEmail]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user || isSending) return;
    
    setIsSending(true);
    setIsTyping(false);
    
    try {
      const messageData = {
        text: input,
        sender: user.email,
        senderUid: user.uid,
        senderName: user.displayName || user.email.split('@')[0],
        createdAt: serverTimestamp(),
        replyTo: replyTo,
        edited: false,
        reactions: []
      };
      
      await addDoc(collection(db, 'posts', postId, 'messages'), messageData);
      setInput('');
      setReplyTo(null);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMessageMenu = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const closeMessageMenu = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleReply = () => {
    setReplyTo(selectedMessage);
    closeMessageMenu();
  };

  const handleEdit = () => {
    setEditingMessage(selectedMessage);
    setInput(selectedMessage.text);
    closeMessageMenu();
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-app" style={{ background: colors.background, color: colors.secondary, minHeight: '100vh', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      {!hideNavbar && <Navbar />}
      <div className="chat-container" style={{ background: colors.background, color: colors.secondary, flex: 1, boxShadow: 'none', maxWidth: '100vw', width: '100vw', height: '100vh', margin: 0 }}>
        <div className="chat-header" style={{ background: colors.accent, color: colors.primary, boxShadow: '0 2px 8px rgba(20,40,80,0.12)' }}>
          {!hideNavbar && (
            <button className="back-btn" onClick={() => window.history.back()} style={{ color: colors.primary }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <div className="header-content">
            <h3 style={{ color: colors.primary }}>{post?.name || 'Chat'}</h3>
            <p style={{ color: colors.secondary, opacity: 0.8 }}>Chatting with {joinerEmail || post?.postedBy || 'Poster'}</p>
          </div>
        </div>
        <div className="chat-window" style={{ background: colors.background, color: colors.secondary, flex: 1, position: 'relative' }}>
          {filteredMessages.length === 0 ? (
            <div className="empty-state" style={{ color: colors.secondary, background: 'none' }}>
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10H8.01M12 10H12.01M16 10H16.01M8 16H18C19.1046 16 20 15.1046 20 14V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16H8V20L12 16H16" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 style={{ color: colors.primary }}>No messages yet</h4>
              <p style={{ color: colors.secondary, opacity: 0.8 }}>Start the conversation by sending a message</p>
            </div>
          ) : (
            <div className="messages-container" ref={messagesContainerRef} style={{ background: 'none', padding: 24, overflowY: 'auto', flex: 1 }}>
              {filteredMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderUid === user?.uid ? 'sent' : 'received'}`}
                  style={{ justifyContent: msg.senderUid === user?.uid ? 'flex-end' : 'flex-start' }}
                >
                  {msg.senderUid !== user?.uid && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary, fontSize: '0.9rem', color: colors.background }}>
                      {msg.senderName?.[0]?.toUpperCase() || msg.sender?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                  )}
                  <div className="message-content" style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column' }}>
                    {msg.senderUid !== user?.uid && (
                      <span style={{ fontSize: '0.75rem', color: colors.primary, marginBottom: 4, fontWeight: 500 }}>{msg.senderName || msg.sender}</span>
                    )}
                    {msg.replyTo && (
                      <div className="reply-context" style={{ background: colors.inputBg, borderLeft: `3px solid ${colors.primary}` }}>
                        <span style={{ fontSize: '0.75rem', color: colors.primary }}>
                          Replying to: {msg.replyTo.text.substring(0, 50)}...
                        </span>
                      </div>
                    )}
                    <div className="message-bubble" style={{
                      background: msg.senderUid === user?.uid ? colors.sentBubble : colors.receivedBubble,
                      color: msg.senderUid === user?.uid ? colors.sentText : colors.receivedText,
                      borderRadius: 16,
                      padding: '12px 18px',
                      margin: msg.senderUid === user?.uid ? '0 0 0 40px' : '0 40px 0 0',
                      boxShadow: msg.senderUid === user?.uid ? '0 2px 8px rgba(20,40,80,0.10)' : '0 2px 8px rgba(20,40,80,0.08)',
                      borderBottomRightRadius: msg.senderUid === user?.uid ? 4 : 16,
                      borderBottomLeftRadius: msg.senderUid === user?.uid ? 16 : 4,
                    }}>
                      <span style={{ lineHeight: 1.5 }}>{msg.text}</span>
                      <div className="message-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 6 }}>
                        <span style={{ fontSize: '0.7rem', color: colors.secondary, marginLeft: 8 }}>
                          {formatTime(msg.createdAt)}{msg.edited && <span className="edited-indicator"> (edited)</span>}
                        </span>
                        {msg.senderUid === user?.uid && (
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleMessageMenu(e, msg)}
                            sx={{ ml: 1, opacity: 0.7, color: colors.primary }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="typing-indicator" style={{ color: colors.primary }}>
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: colors.primary, marginLeft: 8 }}>Someone is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          {replyTo && (
            <Paper className="reply-preview" elevation={1} style={{ background: colors.inputBg, borderLeft: `3px solid ${colors.primary}` }}>
              <span style={{ color: colors.primary, fontSize: '0.8rem' }}>
                Replying to: {replyTo.senderName || replyTo.sender}
              </span>
              <span style={{ fontSize: '0.95rem', marginLeft: 8 }}>{replyTo.text}</span>
              <IconButton size="small" onClick={() => setReplyTo(null)}>
                <Delete fontSize="small" />
              </IconButton>
            </Paper>
          )}
          <form className="message-input-area" onSubmit={sendMessage} style={{ background: colors.inputBg, borderTop: `1px solid ${colors.border}` }}>
            <div className="input-wrapper">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                disabled={!user}
                multiline
                maxRows={4}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: colors.secondary,
                    color: colors.background
                  }
                }}
              />
              <div className="input-actions">
                <IconButton size="small" disabled sx={{ color: colors.primary }}>
                  <AttachFile />
                </IconButton>
                <IconButton size="small" disabled sx={{ color: colors.primary }}>
                  <EmojiEmotions />
                </IconButton>
                <IconButton
                  type="submit"
                  disabled={!input.trim() || !user || isSending}
                  sx={{ 
                    backgroundColor: colors.primary,
                    color: colors.background,
                    '&:hover': { backgroundColor: colors.accent },
                    '&:disabled': { backgroundColor: '#a5a5a5' }
                  }}
                >
                  <Send />
                </IconButton>
              </div>
            </div>
          </form>
          {showScrollTop && (
            <Fab
              size="small"
              color="primary"
              onClick={scrollToTop}
              sx={{
                position: 'absolute',
                bottom: 100,
                right: 16,
                backgroundColor: colors.primary,
                color: colors.background,
                '&:hover': { backgroundColor: colors.accent }
              }}
            >
              <KeyboardArrowUp />
            </Fab>
          )}
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMessageMenu}
          sx={{
            '& .MuiPaper-root': {
              bgcolor: colors.background,
              color: colors.secondary,
              minWidth: 160
            }
          }}
        >
          <MenuItem onClick={handleReply} sx={{ color: colors.primary }}>
            <Reply fontSize="small" sx={{ mr: 1 }} />
            Reply
          </MenuItem>
          <MenuItem onClick={handleEdit} sx={{ color: colors.primary }}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Message;