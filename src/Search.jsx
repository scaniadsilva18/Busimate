import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { auth } from './firebase';
import Navbar from './Navbar';
import './Search.css';
import { 
  Alert, 
  Button, 
  Chip, 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Autocomplete,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  Share,
  Visibility,
  FilterList,
  Sort,
  LocationOn,
  AttachMoney,
  Timeline,
  Group,
  Business,
  TrendingUp,
  Close
} from '@mui/icons-material';
import LikeButton from './components/LikeButton';

const Search = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState({});

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create query to get posts ordered by creation date
        const postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(postsQuery);
        
        if (snapshot.empty) {
          setPosts([]);
          setFilteredPosts([]);
          setLoading(false);
          return;
        }

        // Process post data
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          name: doc.data().name || 'Untitled Business',
          tagline: doc.data().tagline || '',
          description: doc.data().description || 'No description provided',
          industry: doc.data().industry || 'Other',
          stage: doc.data().stage || 'Idea Stage',
          skillsNeeded: doc.data().skillsNeeded || 'Various skills needed',
          email: doc.data().email || '',
          imageUrl: doc.data().imageUrl || '',
          postedBy: doc.data().postedBy || 'Anonymous',
          uid: doc.data().uid || '',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        setPosts(postsData);
        setFilteredPosts(postsData);

        // Extract unique industries for filter dropdown
        const industries = [...new Set(postsData.map(post => post.industry).filter(Boolean))];
        const stages = [...new Set(postsData.map(post => post.stage).filter(Boolean))];
        const locations = [...new Set(postsData.map(post => post.location).filter(Boolean))];
        
        setIndustryOptions(industries.sort());
        setStageOptions(stages.sort());
        setLocationOptions(locations.sort());

        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Save search filters to localStorage
  const saveSearch = () => {
    localStorage.setItem('searchFilters', JSON.stringify({
      searchTerm, industryFilter, stageFilter, locationFilter, budgetFilter, showRemoteOnly, sortBy
    }));
  };

  // Load saved search filters
  useEffect(() => {
    const saved = localStorage.getItem('searchFilters');
    if (saved) {
      const filters = JSON.parse(saved);
      setSearchTerm(filters.searchTerm || '');
      setIndustryFilter(filters.industryFilter || '');
      setStageFilter(filters.stageFilter || '');
      setLocationFilter(filters.locationFilter || '');
      setBudgetFilter(filters.budgetFilter || '');
      setShowRemoteOnly(filters.showRemoteOnly || false);
      setSortBy(filters.sortBy || 'newest');
    }
  }, []);

  // Apply search and filter
  useEffect(() => {
    let results = posts;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(post =>
        post.name.toLowerCase().includes(term) ||
        post.tagline.toLowerCase().includes(term) ||
        post.description.toLowerCase().includes(term) ||
        post.skillsNeeded.toLowerCase().includes(term) ||
        post.industry.toLowerCase().includes(term)
      );
    }

    if (industryFilter) {
      results = results.filter(post => post.industry === industryFilter);
    }

    if (stageFilter) {
      results = results.filter(post => post.stage === stageFilter);
    }

    if (locationFilter) {
      results = results.filter(post => post.location === locationFilter);
    }

    if (budgetFilter) {
      results = results.filter(post => post.budget === budgetFilter);
    }

    if (showRemoteOnly) {
      results = results.filter(post => 
        post.location?.toLowerCase().includes('remote') || 
        post.isRemote === true
      );
    }

    // Sort results
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'alphabetical':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stage':
        const stageOrder = ['Idea', 'Research', 'MVP', 'Beta', 'Launched', 'Growing', 'Scaling'];
        results.sort((a, b) => {
          const aIndex = stageOrder.indexOf(a.stage) !== -1 ? stageOrder.indexOf(a.stage) : 999;
          const bIndex = stageOrder.indexOf(b.stage) !== -1 ? stageOrder.indexOf(b.stage) : 999;
          return aIndex - bIndex;
        });
        break;
      default:
        break;
    }

    setFilteredPosts(results);
  }, [searchTerm, industryFilter, stageFilter, locationFilter, budgetFilter, showRemoteOnly, sortBy, posts]);

  const clearFilters = () => {
    setSearchTerm('');
    setIndustryFilter('');
    setStageFilter('');
    setLocationFilter('');
    setBudgetFilter('');
    setShowRemoteOnly(false);
    setSortBy('newest');
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const sharePost = async (post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.name,
          text: post.tagline || post.description,
          url: window.location.origin + `/message/${post.id}`
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/message/${post.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
  };

  const userPlan = localStorage.getItem('joinerPlan') || 'Free Explorer';

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading business ideas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="search-container">
        <div className="search-header">
          <h1 className="main-title">Discover Business Ideas</h1>
          <p className="subtitle">
            Browse through innovative business concepts and find opportunities to collaborate
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="search-controls">
          <div className="search-input-container">
            <div className="input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, description, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-controls">
            <select
              className="filter-select"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">All Industries</option>
              {industryOptions.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">A-Z</option>
              <option value="stage">By Stage</option>
            </select>
            
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDialogOpen(true)}
              sx={{ minWidth: 'auto', borderRadius: '20px' }}
            >
              More Filters
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 2, borderRadius: '20px', fontWeight: 600 }}
              onClick={saveSearch}
            >
              Save Search
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 1, borderRadius: '20px', fontWeight: 600 }}
              onClick={() => setShowBookmarksOnly((prev) => !prev)}
            >
              {showBookmarksOnly ? 'Show All' : 'Show Bookmarks'}
            </Button>
          </div>
          
          {(searchTerm || industryFilter || stageFilter || locationFilter || budgetFilter || showRemoteOnly) && (
            <div className="active-filters">
              {searchTerm && <Chip label={`Search: ${searchTerm}`} onDelete={() => setSearchTerm('')} />}
              {industryFilter && <Chip label={`Industry: ${industryFilter}`} onDelete={() => setIndustryFilter('')} />}
              {stageFilter && <Chip label={`Stage: ${stageFilter}`} onDelete={() => setStageFilter('')} />}
              {locationFilter && <Chip label={`Location: ${locationFilter}`} onDelete={() => setLocationFilter('')} />}
              {budgetFilter && <Chip label={`Budget: ${budgetFilter}`} onDelete={() => setBudgetFilter('')} />}
              {showRemoteOnly && <Chip label="Remote Only" onDelete={() => setShowRemoteOnly(false)} />}
              <Button size="small" onClick={clearFilters}>Clear All</Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
        </div>

        {/* Plan Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          You're currently using the <strong>{userPlan}</strong> plan.
          {userPlan !== 'Pro Joiner' && userPlan !== 'Elite Joiner' && (
            <>
              {' Upgrade for more results and features! '}
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ ml: 2, fontWeight: 600, borderColor: '#FFC107', color: '#142850' }}
                onClick={() => navigate('/pricingj')}
              >
                Upgrade Plan
              </Button>
            </>
          )}
        </Alert>

        {/* Enhanced Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="no-results">
            <img src="https://undraw.co/api/illustrations/empty?color=blue" alt="No Results" style={{ width: 180, marginBottom: 16 }} />
            <h2>No matching posts found</h2>
            <p>Try adjusting your search terms or filters</p>
            <button 
              className="btn btn-primary" 
              onClick={clearFilters}
            >
              Show All Posts
            </button>
          </div>
        ) : (
          <div className="posts-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '40px',
            marginTop: 40,
            marginBottom: 40,
            padding: '0 24px',
          }}>
            {(showBookmarksOnly ? filteredPosts.filter(post => bookmarkedPosts.includes(post.id)) : filteredPosts).map((post) => (
              <Paper key={post.id} elevation={4} sx={{
                borderRadius: 5,
                boxShadow: '0 8px 32px rgba(30,58,138,0.12)',
                p: 4,
                minHeight: 420,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                transition: 'box-shadow 0.2s, transform 0.2s',
                border: '1.5px solid #e3e8ee',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f8fafc 0%, #fff 100%)',
                '&:hover': {
                  boxShadow: '0 16px 48px rgba(30,58,138,0.18)',
                  transform: 'translateY(-6px) scale(1.01)'
                }
              }}>
                {post.imageUrl && (
                  <div className="card-image">
                    <img
                      src={post.imageUrl}
                      alt={post.name}
                      onError={handleImageError}
                    />
                  </div>
                )}
                
                <div className="card-content">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 0 }}>{post.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => toggleBookmark(post.id)}
                        color={bookmarkedPosts.includes(post.id) ? 'primary' : 'default'}
                      >
                        {bookmarkedPosts.includes(post.id) ? <Bookmark /> : <BookmarkBorder />}
                      </IconButton>
                      <IconButton size="small" onClick={() => sharePost(post)}>
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  {post.tagline && (
                    <p className="post-tagline">{post.tagline}</p>
                  )}
                  
                  <p className="post-description">
                    {showFullDescription[post.id]
                      ? post.description
                      : post.description.length > 120
                        ? `${post.description.substring(0, 120)}...`
                        : post.description}
                    {post.description.length > 120 && (
                      <Button
                        size="small"
                        sx={{ ml: 1, fontSize: '0.8rem' }}
                        onClick={() => setShowFullDescription(f => ({ ...f, [post.id]: !f[post.id] }))}
                      >
                        {showFullDescription[post.id] ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </p>
                  
                  <div className="enhanced-meta-tags">
                    {post.industry && (
                      <Chip 
                        size="small" 
                        icon={<Business />} 
                        label={post.industry} 
                        variant="outlined" 
                        color="primary"
                      />
                    )}
                    {post.stage && (
                      <Chip 
                        size="small" 
                        icon={<TrendingUp />} 
                        label={post.stage} 
                        variant="outlined" 
                        color="secondary"
                      />
                    )}
                    {post.location && (
                      <Chip 
                        size="small" 
                        icon={<LocationOn />} 
                        label={post.location} 
                        variant="outlined" 
                        color="info"
                      />
                    )}
                    {post.budget && (
                      <Chip 
                        size="small" 
                        icon={<AttachMoney />} 
                        label={post.budget} 
                        variant="outlined" 
                        color="success"
                      />
                    )}
                    {post.timeline && (
                      <Chip 
                        size="small" 
                        icon={<Timeline />} 
                        label={post.timeline} 
                        variant="outlined" 
                        color="warning"
                      />
                    )}
                  </div>
                  
                  {post.skillsNeeded && (
                    <div className="skills-section">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                        Skills Needed:
                      </Typography>
                      <div className="skills-chips">
                        {post.skillsNeeded.split(',').slice(0, 3).map((skill, index) => (
                          <Chip 
                            key={index} 
                            size="small" 
                            label={skill.trim()} 
                            variant="filled" 
                            color="default"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {post.skillsNeeded.split(',').length > 3 && (
                          <Chip 
                            size="small" 
                            label={`+${post.skillsNeeded.split(',').length - 3} more`} 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Box sx={{ fontSize: 14, color: '#64748b' }}>
                    <span>By: <b>{post.postedBy}</b></span><br />
                    <span>{post.createdAt.toLocaleDateString()}</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <LikeButton postId={post.id} initialLikes={post.likes || 0} likedByUser={post.likedBy?.includes(currentUser?.uid)} currentUser={currentUser} />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/message/${post.id}`)}
                      sx={{ 
                        backgroundColor: '#142850',
                        borderRadius: 2,
                        fontWeight: 600,
                        px: 2.5,
                        fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(20,40,80,0.08)',
                        '&:hover': { backgroundColor: '#0e1e38' }
                      }}
                    >
                      Connect
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.8rem', borderRadius: 2, px: 1.5, color: '#1e3a8a', borderColor: '#1e3a8a' }}
                      onClick={() => {
                        navigator.clipboard.writeText(post.email);
                        alert('Email copied!');
                      }}
                    >
                      Copy Email
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
          </div>
        )}

        {/* Advanced Filter Dialog */}
        <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Advanced Filters
            <IconButton
              aria-label="close"
              onClick={() => setFilterDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <Autocomplete
                options={stageOptions}
                value={stageFilter}
                onChange={(_, value) => setStageFilter(value || '')}
                renderInput={(params) => <TextField {...params} label="Startup Stage" />}
              />
              
              <Autocomplete
                options={locationOptions}
                value={locationFilter}
                onChange={(_, value) => setLocationFilter(value || '')}
                renderInput={(params) => <TextField {...params} label="Location" />}
              />
              
              <TextField
                select
                label="Budget Range"
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="">All Budgets</option>
                <option value="No funding needed">No funding needed</option>
                <option value="Under $10K">Under $10K</option>
                <option value="$10K - $50K">$10K - $50K</option>
                <option value="$50K - $100K">$50K - $100K</option>
                <option value="$100K - $500K">$100K - $500K</option>
                <option value="$500K - $1M">$500K - $1M</option>
                <option value="$1M - $5M">$1M - $5M</option>
                <option value="Over $5M">Over $5M</option>
              </TextField>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={showRemoteOnly} 
                    onChange={(e) => setShowRemoteOnly(e.target.checked)} 
                  />
                }
                label="Remote opportunities only"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={clearFilters}>Clear All</Button>
            <Button onClick={() => setFilterDialogOpen(false)} variant="contained">
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Search;