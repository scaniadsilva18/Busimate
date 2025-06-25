import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Alert,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Autocomplete,
  Slider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fade,
  Grow,
  Collapse,
  LinearProgress,
  AppBar,
  Toolbar,
  Badge,
  Stack,
  ButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  TabPanel,
  Fab,
  Snackbar,
} from '@mui/material';
import {
  Business,
  TrendingUp,
  Group,
  LocationOn,
  AttachMoney,
  Schedule,
  Visibility,
  Edit,
  CheckCircle,
  ArrowForward,
  ArrowBack,
  Save,
  Publish,
  Analytics,
  Description,
  Category,
  People,
  Place,
  Assessment,
  Timeline,
  RocketLaunch,
  Close,
} from '@mui/icons-material';
import { collection, addDoc, Timestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { auth, db } from './firebase';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Message from './Message';

const Post = () => {
  const [idea, setIdea] = useState({
    name: '',
    tagline: '',
    description: '',
    industry: '',
    stage: '',
    skillsNeeded: '',
    location: '',
    budget: '',
    timeline: '',
    teamSize: 1,
    isRemote: false,
    experience: '',
    equity: 0,
  });

  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postedIdeas, setPostedIdeas] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();

  const userPlan = localStorage.getItem('posterPlan') || 'Startup Basic';

  const ideaLimits = {
    'Startup Basic': 1,
    'Startup Growth': 5,
    'Startup Pro': Infinity,
  };

  // Fetch recent posts for inspiration
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentPosts(posts);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
        showAlert('Failed to load recent posts', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIdea({ 
      ...idea, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleAutocompleteChange = (field, value) => {
    setIdea({ ...idea, [field]: value });
  };

  const handleSliderChange = (field, value) => {
    setIdea({ ...idea, [field]: value });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const validateForm = () => {
    if (!idea.name.trim()) {
      showAlert('Business name is required', 'error');
      return false;
    }
    if (!idea.description.trim()) {
      showAlert('Business description is required', 'error');
      return false;
    }
    if (idea.description.trim().length < 20) {
      showAlert('Business description should be at least 20 characters', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        showAlert('Please sign in to post your business idea', 'error');
        setIsSubmitting(false);
        return;
      }

      // Check post limits
      const userPostsSnapshot = await getDocs(collection(db, 'posts'));
      const userPosts = userPostsSnapshot.docs.filter(doc => doc.data().uid === user.uid);
      const postLimit = ideaLimits[userPlan];

      if (userPosts.length >= postLimit) {
        showAlert(
          `Post limit reached for ${userPlan} plan. Please upgrade to post more ideas.`,
          'warning'
        );
        setIsSubmitting(false);
        return;
      }

      // Prepare post data
      const postData = {
        name: idea.name.trim(),
        tagline: idea.tagline.trim() || '',
        description: idea.description.trim(),
        industry: idea.industry.trim() || '',
        stage: idea.stage || '',
        skillsNeeded: idea.skillsNeeded.trim() || '',
        location: idea.location.trim() || '',
        budget: idea.budget || '',
        timeline: idea.timeline || '',
        teamSize: idea.teamSize || 1,
        isRemote: idea.isRemote || false,
        experience: idea.experience || '',
        equity: idea.equity || 0,
        postedBy: user.displayName || user.email || 'Anonymous User',
        email: user.email || '',
        uid: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        planUsed: userPlan,
        status: 'active',
        views: 0,
        likes: 0,
        matches: 0
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'posts'), postData);
      
      if (docRef && docRef.id) {
        showAlert(
          'Business idea posted successfully! You can now connect with potential collaborators.',
          'success'
        );
        
        // Add to local state for preview
        const newPost = { id: docRef.id, ...postData };
        setPostedIdeas([newPost, ...postedIdeas]);
        
        // Reset form
        setIdea({
          name: '',
          tagline: '',
          description: '',
          industry: '',
          stage: '',
          skillsNeeded: '',
          location: '',
          budget: '',
          timeline: '',
          teamSize: 1,
          isRemote: false,
          experience: '',
          equity: 0,
        });
        setCurrentTab(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showAlert('Failed to confirm posting with Firebase. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Error posting idea:', err);
      showAlert('Failed to post business idea. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
    'Food & Beverage', 'Real Estate', 'Transportation', 'Entertainment',
    'Agriculture', 'Manufacturing', 'Consulting', 'Gaming', 'SaaS',
    'Mobile Apps', 'AI/ML', 'Blockchain', 'Fintech', 'Biotech', 'Other'
  ];

  const stages = [
    { value: 'Idea', label: 'Concept Stage' },
    { value: 'Research', label: 'Market Research' },
    { value: 'MVP', label: 'MVP Development' },
    { value: 'Beta', label: 'Beta Testing' },
    { value: 'Launched', label: 'Product Launch' },
    { value: 'Growing', label: 'Growth Phase' },
    { value: 'Scaling', label: 'Scaling Phase' },
  ];

  const skillOptions = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'UI/UX Designer', 'Product Manager', 'Marketing Manager',
    'Sales Manager', 'Data Scientist', 'DevOps Engineer', 'Business Analyst',
    'Content Creator', 'Social Media Manager', 'SEO Specialist', 'Copywriter'
  ];

  const locationOptions = [
    'Remote', 'New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Boston',
    'Seattle', 'Austin', 'Denver', 'Miami', 'London', 'Toronto', 'Berlin',
    'Amsterdam', 'Singapore', 'Sydney', 'Mumbai', 'Bangalore', 'Dubai'
  ];

  const budgetRanges = [
    'No funding needed', 'Under $10K', '$10K - $50K', '$50K - $100K',
    '$100K - $500K', '$500K - $1M', '$1M - $5M', 'Over $5M'
  ];

  const timelineOptions = [
    '1-3 months', '3-6 months', '6-12 months', '1-2 years', '2+ years'
  ];

  return (
    <>
      <Navbar />
      
      {/* Notification Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          sx={{ width: '100%', boxShadow: 3 }}
          onClose={handleCloseAlert}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseAlert}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Container maxWidth={false} disableGutters sx={{ 
        height: '100vh', 
        width: '100vw', 
        minWidth: 0, 
        minHeight: 0, 
        p: 0, 
        m: 0, 
        display: 'flex', 
        alignItems: 'stretch', 
        justifyContent: 'center', 
        background: '#f8fafc' 
      }}>
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 0, 
            backgroundColor: 'white',
            overflow: 'hidden',
            border: 'none',
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            mx: 0,
            my: 0,
            boxShadow: 'none',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            position: 'relative',
          }}
        >
          {/* Clean Tab Navigation */}
          <Box sx={{ 
            backgroundColor: '#1e3a8a',
            color: 'white',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 64,
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                },
                '& .Mui-selected': {
                  color: 'white !important',
                  backgroundColor: 'rgba(255,255,255,0.15)'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3
                }
              }}
            >
              <Tab 
                label="Basic Information" 
                icon={<Description />} 
                iconPosition="start"
              />
              <Tab 
                label="Business Details" 
                icon={<Business />} 
                iconPosition="start"
              />
              <Tab 
                label="Team & Requirements" 
                icon={<People />} 
                iconPosition="start"
              />
              <Tab 
                label="Review & Publish" 
                icon={<Visibility />} 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ 
            p: { xs: 2, md: 8 }, 
            backgroundColor: 'white', 
            flex: 1, 
            minHeight: 0, 
            overflowY: 'auto',
            position: 'relative'
          }}>
            {isSubmitting && (
              <LinearProgress 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  zIndex: 10
                }} 
              />
            )}

            {/* Basic Information Tab */}
            {currentTab === 0 && (
              <Fade in timeout={500}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <Description sx={{ 
                      fontSize: 32, 
                      color: '#1e3a8a', 
                      mr: 2
                    }} />
                    <Box>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: '#1e3a8a',
                        mb: 1
                      }}>
                        Basic Information
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Tell us about your business concept
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        name="name"
                        label="Business Name"
                        fullWidth
                        required
                        value={idea.name}
                        onChange={handleChange}
                        helperText="Enter the name of your business or project"
                        inputProps={{ maxLength: 100 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#1e3a8a'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#1e3a8a'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#1e3a8a'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="tagline"
                        label="Value Proposition"
                        fullWidth
                        value={idea.tagline}
                        onChange={handleChange}
                        helperText="A clear, compelling statement of what your business offers"
                        inputProps={{ maxLength: 150 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#1e3a8a'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#1e3a8a'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#1e3a8a'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="description"
                        label="Business Description"
                        multiline
                        rows={6}
                        fullWidth
                        required
                        value={idea.description}
                        onChange={handleChange}
                        helperText={`Provide a detailed description of your business concept (${idea.description.length}/500 characters)`}
                        inputProps={{ maxLength: 500 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#1e3a8a'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#1e3a8a'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#1e3a8a'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* Business Details Tab */}
            {currentTab === 1 && (
              <Fade in timeout={500}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <Business sx={{ 
                      fontSize: 32, 
                      color: '#1e3a8a', 
                      mr: 2
                    }} />
                    <Box>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: '#1e3a8a',
                        mb: 1
                      }}>
                        Business Details
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Define your industry and market positioning
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="industry"
                        label="Industry"
                        select
                        fullWidth
                        value={idea.industry}
                        onChange={handleChange}
                        helperText="Select your primary industry"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: '#f8fafc',
                            border: '2px solid #e2e8f0',
                            '&:hover': {
                              borderColor: '#10b981',
                              backgroundColor: 'white'
                            },
                            '&.Mui-focused': {
                              borderColor: '#10b981',
                              backgroundColor: 'white',
                              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            color: '#374151'
                          }
                        }}
                      >
                        {industries.map((industry) => (
                          <MenuItem key={industry} value={industry}>
                            {industry}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="stage"
                        label="Development Stage"
                        select
                        fullWidth
                        value={idea.stage}
                        onChange={handleChange}
                        helperText="Current development phase"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            backgroundColor: '#f8fafc',
                            border: '2px solid #e2e8f0',
                            '&:hover': {
                              borderColor: '#10b981',
                              backgroundColor: 'white'
                            },
                            '&.Mui-focused': {
                              borderColor: '#10b981',
                              backgroundColor: 'white',
                              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            color: '#374151'
                          }
                        }}
                      >
                        {stages.map((stage) => (
                          <MenuItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={locationOptions}
                        freeSolo
                        value={idea.location}
                        onChange={(_, value) => handleAutocompleteChange('location', value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Location"
                            helperText="Business location or Remote"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="budget"
                        label="Funding Requirements"
                        select
                        fullWidth
                        value={idea.budget}
                        onChange={handleChange}
                        helperText="Initial funding needed"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      >
                        {budgetRanges.map((budget) => (
                          <MenuItem key={budget} value={budget}>
                            {budget}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        name="timeline"
                        label="Project Timeline"
                        select
                        fullWidth
                        value={idea.timeline}
                        onChange={handleChange}
                        helperText="Expected duration"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      >
                        {timelineOptions.map((timeline) => (
                          <MenuItem key={timeline} value={timeline}>
                            {timeline}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* Team & Requirements Tab */}
            {currentTab === 2 && (
              <Fade in timeout={500}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <People sx={{ 
                      fontSize: 32, 
                      color: '#1e3a8a', 
                      mr: 2
                    }} />
                    <Box>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: '#1e3a8a',
                        mb: 1
                      }}>
                        Team & Requirements
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Specify the talent and resources you need
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={skillOptions}
                        freeSolo
                        value={idea.skillsNeeded ? idea.skillsNeeded.split(',').map(s => s.trim()) : []}
                        onChange={(_, newValue) => handleAutocompleteChange('skillsNeeded', newValue.join(', '))}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Required Skills & Expertise"
                            helperText="Select or type the skills and expertise you need"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              color="primary"
                              variant="outlined"
                              key={index}
                              sx={{ borderRadius: 1 }}
                            />
                          ))
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
                          Team Size: {idea.teamSize} {idea.teamSize === 1 ? 'person' : 'people'}
                        </Typography>
                        <Slider
                          value={idea.teamSize}
                          onChange={(_, value) => handleSliderChange('teamSize', value)}
                          valueLabelDisplay="auto"
                          step={1}
                          marks={[
                            { value: 1, label: '1' },
                            { value: 5, label: '5' },
                            { value: 10, label: '10+' }
                          ]}
                          min={1}
                          max={10}
                          sx={{ 
                            color: '#3b82f6',
                            '& .MuiSlider-thumb': {
                              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600, color: '#374151' }}>
                          Equity Offering: {idea.equity}%
                        </Typography>
                        <Slider
                          value={idea.equity}
                          onChange={(_, value) => handleSliderChange('equity', value)}
                          valueLabelDisplay="auto"
                          step={5}
                          marks={[
                            { value: 0, label: '0%' },
                            { value: 25, label: '25%' },
                            { value: 50, label: '50%' },
                            { value: 75, label: '75%' },
                            { value: 100, label: '100%' }
                          ]}
                          min={0}
                          max={100}
                          sx={{ 
                            color: '#10b981',
                            '& .MuiSlider-thumb': {
                              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* Review & Publish Tab */}
            {currentTab === 3 && (
              <Fade in timeout={500}>
                <Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    pb: 2,
                    borderBottom: '2px solid #f1f5f9'
                  }}>
                    <Visibility sx={{ 
                      fontSize: 32, 
                      color: '#1e3a8a', 
                      mr: 2
                    }} />
                    <Box>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        color: '#1e3a8a',
                        mb: 1
                      }}>
                        Review & Publish
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Final review before publishing your opportunity
                      </Typography>
                    </Box>
                  </Box>
                  <Card sx={{ 
                    mb: 4, 
                    border: '2px solid #e5e7eb', 
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: '#1e293b', 
                        mb: 2,
                        fontSize: '1.5rem'
                      }}>
                        {idea.name || 'Business Name'}
                      </Typography>
                      {idea.tagline && (
                        <Typography variant="body1" sx={{ 
                          color: '#6b7280', 
                          mb: 3, 
                          fontStyle: 'italic',
                          fontSize: '1.1rem'
                        }}>
                          {idea.tagline}
                        </Typography>
                      )}
                      <Typography variant="body1" sx={{ 
                        mb: 3, 
                        lineHeight: 1.7, 
                        color: '#374151',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {idea.description || 'Business description will appear here...'}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {idea.industry && (
                          <Chip 
                            label={idea.industry} 
                            icon={<Category />} 
                            variant="outlined" 
                            color="primary"
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                        {idea.stage && (
                          <Chip 
                            label={idea.stage} 
                            icon={<Assessment />} 
                            variant="outlined" 
                            color="secondary"
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                        {idea.location && (
                          <Chip 
                            label={idea.location} 
                            icon={<Place />} 
                            variant="outlined" 
                            color="info"
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                        {idea.budget && (
                          <Chip 
                            label={idea.budget} 
                            icon={<AttachMoney />} 
                            variant="outlined" 
                            color="success"
                            sx={{ borderRadius: 1 }}
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Fade>
            )}

            {/* Navigation */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 4, 
              pt: 3, 
              borderTop: '1px solid #e2e8f0'
            }}>
              <Button
                disabled={currentTab === 0}
                onClick={() => setCurrentTab(currentTab - 1)}
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#1e3a8a',
                    backgroundColor: '#f8fafc',
                    color: '#1e3a8a'
                  },
                  '&:disabled': {
                    opacity: 0.5
                  }
                }}
              >
                Previous Step
              </Button>
              <Box>
                {currentTab === 3 ? (
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Publish />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      backgroundColor: '#1e3a8a',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 700,
                      '&:hover': { 
                        backgroundColor: '#1e40af'
                      },
                      '&:disabled': {
                        backgroundColor: '#9ca3af'
                      }
                    }}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Opportunity'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentTab(currentTab + 1)}
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      backgroundColor: '#1e3a8a',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': { 
                        backgroundColor: '#1e40af'
                      }
                    }}
                  >
                    Next Step
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      {/* Floating Button */}
      <Fab
        color="primary"
        aria-label="scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          backgroundColor: '#1e3a8a',
          '&:hover': {
            backgroundColor: '#1e40af',
            transform: 'scale(1.1)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        <RocketLaunch />
      </Fab>

      {/* Posted Ideas Section */}
      {postedIdeas.length > 0 && (
        <Grow in timeout={1500}>
          <Box sx={{ 
            mt: 6,
            pb: 8,
            background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)'
          }}>
            <Container maxWidth="lg">
              <Typography variant="h4" sx={{ 
                mb: 4, 
                textAlign: 'center',
                fontWeight: 700,
                color: '#1e293b',
                position: 'relative',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '80px',
                  height: '4px',
                  background: '#1e3a8a',
                  margin: '16px auto 0',
                  borderRadius: '2px'
                }
              }}>
                Your Posted Ideas
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {postedIdeas.map((post) => (
                  <Grid item xs={12} md={6} lg={4} key={post.id}>
                    <Card sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 4,
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
                      },
                      overflow: 'hidden'
                    }}>
                      <CardContent sx={{ p: 4, flex: 1 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start', 
                          mb: 2 
                        }}>
                          <Typography variant="h5" sx={{ 
                            fontWeight: 'bold', 
                            color: '#142850',
                            fontSize: '1.3rem'
                          }}>
                            {post.name}
                          </Typography>
                          <Chip 
                            label="Published" 
                            color="success" 
                            size="small" 
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        {post.tagline && (
                          <Typography variant="subtitle1" sx={{ 
                            fontStyle: 'italic', 
                            color: '#666', 
                            mb: 2,
                            fontSize: '0.95rem'
                          }}>
                            {post.tagline}
                          </Typography>
                        )}
                        <Typography sx={{ 
                          mb: 3, 
                          lineHeight: 1.6, 
                          color: '#333',
                          fontSize: '0.95rem'
                        }}>
                          {post.description.length > 200 
                            ? `${post.description.substring(0, 200)}...` 
                            : post.description}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1, 
                          mb: 3 
                        }}>
                          {post.industry && (
                            <Chip 
                              label={post.industry} 
                              color="primary" 
                              variant="outlined" 
                              icon={<Business />}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                          {post.stage && (
                            <Chip 
                              label={post.stage} 
                              color="secondary" 
                              variant="outlined" 
                              icon={<TrendingUp />}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                          {post.location && (
                            <Chip 
                              label={post.location} 
                              color="info" 
                              variant="outlined" 
                              icon={<LocationOn />}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ 
                        p: 2, 
                        borderTop: '1px solid #eee',
                        justifyContent: 'space-between'
                      }}>
                        <Typography variant="caption" sx={{ 
                          color: '#64748b',
                          fontSize: '0.75rem'
                        }}>
                          Posted on: {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/message/${post.id}`)}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 2,
                            fontWeight: 'bold',
                            minWidth: 140,
                            px: 2,
                            py: 1,
                            fontSize: '0.85rem',
                            boxShadow: '0 2px 8px rgba(102,126,234,0.12)',
                            transition: 'all 0.2s',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                              boxShadow: '0 4px 16px rgba(102,126,234,0.18)'
                            }
                          }}
                        >
                          View Chats
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
        </Grow>
      )}
    </>
  );
};

export default Post;