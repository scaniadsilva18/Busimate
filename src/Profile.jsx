import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Box, Typography, TextField, Button, Paper, Avatar, Divider, Grid, Stack, Stepper, Step, StepLabel, Fade, LinearProgress, IconButton, Card, CardContent, CardHeader, Slide, Grow } from '@mui/material';
import Navbar from './Navbar';
import EditIcon from '@mui/icons-material/Edit';

const initialProfile = {
  displayName: '',
  photoURL: '',
  headline: '',
  whoAmI: '',
  knowWho: '',
  education: [],
  experience: [],
  skills: '',
  location: '',
  website: '',
  bio: '',
  licenses: [],
  projects: [],
  languages: '',
  volunteer: [],
  accomplishments: '',
  contact: '',
};

const steps = [
  'Basic Info',
  'Who Am I',
  'My Know-Who',
  'Education',
  'Experience',
  'Skills & Bio',
  'Licenses & Certifications',
  'Projects',
  'Languages',
  'Volunteer Experience',
  'Accomplishments',
  'Contact Info',
];

const genderAvatars = {
  male: '👨',
  female: '👩',
  other: '🧑',
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setProfile({ ...initialProfile, ...userDoc.data() });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!currentUser) {
      alert('You must be signed in to save your profile.');
      return;
    }
    try {
      await setDoc(doc(db, 'users', currentUser.uid), profile, { merge: true });
      setEditMode(false);
      alert('Profile saved successfully!');
    } catch (error) {
      alert('Error saving profile: ' + error.message);
      console.error('Save error:', error);
    }
  };

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  if (loading) return <Box sx={{ p: 6, textAlign: 'center' }}>Loading...</Box>;

  return (
    <>
      <Navbar />
      <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #f8fafc 60%, #e3e8ee 100%)', pb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>
        <Box sx={{ width: '100%', maxWidth: 1400, minHeight: '90vh', mx: 'auto', mt: 0, p: { xs: 1, md: 4 }, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
          {/* Main Profile Edit/Display */}
          <Grow in timeout={600}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Card elevation={8} sx={{ p: 4, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.98)', width: '100%', minHeight: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 12px 48px 0 rgba(20,40,80,0.13)', backdropFilter: 'blur(4px)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ width: 100, height: 100, fontSize: 48, bgcolor: '#e3e8ee', color: '#142850', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', boxShadow: '0 4px 24px 0 rgba(20,40,80,0.10)' }}>
                      {profile.gender ? genderAvatars[profile.gender] : (profile.displayName && profile.displayName[0]) || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#142850', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif', letterSpacing: 1 }}>{profile.displayName || 'Your Name'}</Typography>
                      <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 600, fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>{profile.headline || 'Headline / Role'}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>{profile.location || 'Location'}</Typography>
                    </Box>
                  </Box>
                  {!editMode && (
                    <IconButton onClick={() => setEditMode(true)} sx={{ background: '#FFE082', color: '#142850', '&:hover': { background: '#FFD600' }, ml: 2 }} size="large">
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>
                <Divider sx={{ mb: 3, bgcolor: '#e3e8ee' }} />
                {editMode ? (
                  <React.Fragment>
                    <Slide direction="down" in={editMode} mountOnEnter unmountOnExit>
                      <Box>
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                          {steps.map((label) => (
                            <Step key={label}>
                              <StepLabel sx={{ fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>{label}</StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                        <LinearProgress variant="determinate" value={((activeStep + 1) / steps.length) * 100} sx={{ mb: 3, height: 8, borderRadius: 4, bgcolor: '#e3e8ee', '& .MuiLinearProgress-bar': { bgcolor: '#FFD600' } }} />
                      </Box>
                    </Slide>
                    <Fade in={editMode}>
                      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {activeStep === 0 && (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <TextField label="Full Name" name="displayName" value={profile.displayName} onChange={handleChange} fullWidth InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField label="Headline / Role" name="headline" value={profile.headline} onChange={handleChange} fullWidth InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField label="Location" name="location" value={profile.location} onChange={handleChange} fullWidth InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField label="Website" name="website" value={profile.website} onChange={handleChange} fullWidth InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                            </Grid>
                          </Grid>
                        )}
                        {activeStep === 1 && (
                          <TextField label="Who am I?" name="whoAmI" value={profile.whoAmI} onChange={handleChange} fullWidth multiline minRows={3} InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                        )}
                        {activeStep === 2 && (
                          <TextField label="My Know-Who (network, partners, etc)" name="knowWho" value={profile.knowWho} onChange={handleChange} fullWidth multiline minRows={3} InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                        )}
                        {activeStep === 3 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Education</Typography>
                            {Array.isArray(profile.education) && profile.education.length > 0 && profile.education.map((edu, idx) => (
                              <Card key={idx} sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{edu.degree || 'Degree'}</Typography>
                                    <Typography variant="body2">{edu.school || 'School'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{edu.duration || 'Duration'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{edu.description || 'Description'}</Typography>
                                  </Box>
                                  <Button color="error" onClick={() => {
                                    const newEdu = [...profile.education];
                                    newEdu.splice(idx, 1);
                                    setProfile({ ...profile, education: newEdu });
                                  }}>Delete</Button>
                                </Stack>
                              </Card>
                            ))}
                            <Button variant="outlined" sx={{ mb: 2 }} onClick={() => {
                              setProfile({ ...profile, education: [...(profile.education || []), { degree: '', school: '', duration: '', description: '' }] });
                            }}>Add Education</Button>
                            {Array.isArray(profile.education) && profile.education.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2">Edit Last Entry:</Typography>
                                <TextField label="Degree" value={profile.education[profile.education.length-1].degree} onChange={e => {
                                  const newEdu = [...profile.education];
                                  newEdu[newEdu.length-1].degree = e.target.value;
                                  setProfile({ ...profile, education: newEdu });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="School" value={profile.education[profile.education.length-1].school} onChange={e => {
                                  const newEdu = [...profile.education];
                                  newEdu[newEdu.length-1].school = e.target.value;
                                  setProfile({ ...profile, education: newEdu });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Duration" value={profile.education[profile.education.length-1].duration} onChange={e => {
                                  const newEdu = [...profile.education];
                                  newEdu[newEdu.length-1].duration = e.target.value;
                                  setProfile({ ...profile, education: newEdu });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Description" value={profile.education[profile.education.length-1].description} onChange={e => {
                                  const newEdu = [...profile.education];
                                  newEdu[newEdu.length-1].description = e.target.value;
                                  setProfile({ ...profile, education: newEdu });
                                }} fullWidth multiline minRows={2} />
                              </Box>
                            )}
                          </Box>
                        )}
                        {/* Experience Step */}
                        {activeStep === 4 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Experience</Typography>
                            {Array.isArray(profile.experience) && profile.experience.length > 0 && profile.experience.map((exp, idx) => (
                              <Card key={idx} sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{exp.title || 'Job Title'}</Typography>
                                    <Typography variant="body2">{exp.company || 'Company'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{exp.duration || 'Duration'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{exp.description || 'Description'}</Typography>
                                  </Box>
                                  <Button color="error" onClick={() => {
                                    const newExp = [...profile.experience];
                                    newExp.splice(idx, 1);
                                    setProfile({ ...profile, experience: newExp });
                                  }}>Delete</Button>
                                </Stack>
                              </Card>
                            ))}
                            <Button variant="outlined" sx={{ mb: 2 }} onClick={() => {
                              setProfile({ ...profile, experience: [...(profile.experience || []), { title: '', company: '', duration: '', description: '' }] });
                            }}>Add Experience</Button>
                            {Array.isArray(profile.experience) && profile.experience.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2">Edit Last Entry:</Typography>
                                <TextField label="Job Title" value={profile.experience[profile.experience.length-1].title} onChange={e => {
                                  const newExp = [...profile.experience];
                                  newExp[newExp.length-1].title = e.target.value;
                                  setProfile({ ...profile, experience: newExp });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Company" value={profile.experience[profile.experience.length-1].company} onChange={e => {
                                  const newExp = [...profile.experience];
                                  newExp[newExp.length-1].company = e.target.value;
                                  setProfile({ ...profile, experience: newExp });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Duration" value={profile.experience[profile.experience.length-1].duration} onChange={e => {
                                  const newExp = [...profile.experience];
                                  newExp[newExp.length-1].duration = e.target.value;
                                  setProfile({ ...profile, experience: newExp });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Description" value={profile.experience[profile.experience.length-1].description} onChange={e => {
                                  const newExp = [...profile.experience];
                                  newExp[newExp.length-1].description = e.target.value;
                                  setProfile({ ...profile, experience: newExp });
                                }} fullWidth multiline minRows={2} />
                              </Box>
                            )}
                          </Box>
                        )}
                        {/* Skills & Bio Step */}
                        {activeStep === 5 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Skills & Bio</Typography>
                            <TextField label="Skills (comma separated)" name="skills" value={profile.skills} onChange={handleChange} fullWidth InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                            <TextField label="Short Bio" name="bio" value={profile.bio} onChange={handleChange} fullWidth multiline minRows={3} InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                          </Box>
                        )}
                        {/* Licenses & Certifications Step */}
                        {activeStep === 6 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Licenses & Certifications</Typography>
                            {Array.isArray(profile.licenses) && profile.licenses.length > 0 && profile.licenses.map((lic, idx) => (
                              <Card key={idx} sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{lic.name || 'License/Certification'}</Typography>
                                    <Typography variant="body2">{lic.issuer || 'Issuer'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{lic.date || 'Date'}</Typography>
                                  </Box>
                                  <Button color="error" onClick={() => {
                                    const newLic = [...profile.licenses];
                                    newLic.splice(idx, 1);
                                    setProfile({ ...profile, licenses: newLic });
                                  }}>Delete</Button>
                                </Stack>
                              </Card>
                            ))}
                            <Button variant="outlined" sx={{ mb: 2 }} onClick={() => {
                              setProfile({ ...profile, licenses: [...(profile.licenses || []), { name: '', issuer: '', date: '' }] });
                            }}>Add License/Certification</Button>
                            {Array.isArray(profile.licenses) && profile.licenses.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2">Edit Last Entry:</Typography>
                                <TextField label="Name" value={profile.licenses[profile.licenses.length-1].name} onChange={e => {
                                  const newLic = [...profile.licenses];
                                  newLic[newLic.length-1].name = e.target.value;
                                  setProfile({ ...profile, licenses: newLic });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Issuer" value={profile.licenses[profile.licenses.length-1].issuer} onChange={e => {
                                  const newLic = [...profile.licenses];
                                  newLic[newLic.length-1].issuer = e.target.value;
                                  setProfile({ ...profile, licenses: newLic });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Date" value={profile.licenses[profile.licenses.length-1].date} onChange={e => {
                                  const newLic = [...profile.licenses];
                                  newLic[newLic.length-1].date = e.target.value;
                                  setProfile({ ...profile, licenses: newLic });
                                }} fullWidth sx={{ mb: 1 }} />
                              </Box>
                            )}
                          </Box>
                        )}
                        {/* Projects Step */}
                        {activeStep === 7 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Projects</Typography>
                            {Array.isArray(profile.projects) && profile.projects.length > 0 && profile.projects.map((proj, idx) => (
                              <Card key={idx} sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{proj.title || 'Project Title'}</Typography>
                                    <Typography variant="body2">{proj.description || 'Description'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{proj.link || 'Project Link'}</Typography>
                                  </Box>
                                  <Button color="error" onClick={() => {
                                    const newProj = [...profile.projects];
                                    newProj.splice(idx, 1);
                                    setProfile({ ...profile, projects: newProj });
                                  }}>Delete</Button>
                                </Stack>
                              </Card>
                            ))}
                            <Button variant="outlined" sx={{ mb: 2 }} onClick={() => {
                              setProfile({ ...profile, projects: [...(profile.projects || []), { title: '', description: '', link: '' }] });
                            }}>Add Project</Button>
                            {Array.isArray(profile.projects) && profile.projects.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2">Edit Last Entry:</Typography>
                                <TextField label="Title" value={profile.projects[profile.projects.length-1].title} onChange={e => {
                                  const newProj = [...profile.projects];
                                  newProj[newProj.length-1].title = e.target.value;
                                  setProfile({ ...profile, projects: newProj });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Description" value={profile.projects[profile.projects.length-1].description} onChange={e => {
                                  const newProj = [...profile.projects];
                                  newProj[newProj.length-1].description = e.target.value;
                                  setProfile({ ...profile, projects: newProj });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Link" value={profile.projects[profile.projects.length-1].link} onChange={e => {
                                  const newProj = [...profile.projects];
                                  newProj[newProj.length-1].link = e.target.value;
                                  setProfile({ ...profile, projects: newProj });
                                }} fullWidth sx={{ mb: 1 }} />
                              </Box>
                            )}
                          </Box>
                        )}
                        {/* Languages Step */}
                        {activeStep === 8 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Languages</Typography>
                            <TextField label="Languages (comma separated)" name="languages" value={profile.languages} onChange={handleChange} fullWidth InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                          </Box>
                        )}
                        {/* Volunteer Experience Step */}
                        {activeStep === 9 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Volunteer Experience</Typography>
                            {Array.isArray(profile.volunteer) && profile.volunteer.length > 0 && profile.volunteer.map((vol, idx) => (
                              <Card key={idx} sx={{ mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{vol.role || 'Role'}</Typography>
                                    <Typography variant="body2">{vol.organization || 'Organization'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{vol.duration || 'Duration'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{vol.description || 'Description'}</Typography>
                                  </Box>
                                  <Button color="error" onClick={() => {
                                    const newVol = [...profile.volunteer];
                                    newVol.splice(idx, 1);
                                    setProfile({ ...profile, volunteer: newVol });
                                  }}>Delete</Button>
                                </Stack>
                              </Card>
                            ))}
                            <Button variant="outlined" sx={{ mb: 2 }} onClick={() => {
                              setProfile({ ...profile, volunteer: [...(profile.volunteer || []), { role: '', organization: '', duration: '', description: '' }] });
                            }}>Add Volunteer Experience</Button>
                            {Array.isArray(profile.volunteer) && profile.volunteer.length > 0 && (
                              <Box>
                                <Typography variant="subtitle2">Edit Last Entry:</Typography>
                                <TextField label="Role" value={profile.volunteer[profile.volunteer.length-1].role} onChange={e => {
                                  const newVol = [...profile.volunteer];
                                  newVol[newVol.length-1].role = e.target.value;
                                  setProfile({ ...profile, volunteer: newVol });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Organization" value={profile.volunteer[profile.volunteer.length-1].organization} onChange={e => {
                                  const newVol = [...profile.volunteer];
                                  newVol[newVol.length-1].organization = e.target.value;
                                  setProfile({ ...profile, volunteer: newVol });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Duration" value={profile.volunteer[profile.volunteer.length-1].duration} onChange={e => {
                                  const newVol = [...profile.volunteer];
                                  newVol[newVol.length-1].duration = e.target.value;
                                  setProfile({ ...profile, volunteer: newVol });
                                }} fullWidth sx={{ mb: 1 }} />
                                <TextField label="Description" value={profile.volunteer[profile.volunteer.length-1].description} onChange={e => {
                                  const newVol = [...profile.volunteer];
                                  newVol[newVol.length-1].description = e.target.value;
                                  setProfile({ ...profile, volunteer: newVol });
                                }} fullWidth multiline minRows={2} />
                              </Box>
                            )}
                          </Box>
                        )}
                        {/* Accomplishments Step */}
                        {activeStep === 10 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Accomplishments</Typography>
                            <TextField label="Accomplishments" name="accomplishments" value={profile.accomplishments} onChange={handleChange} fullWidth multiline minRows={3} InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                          </Box>
                        )}
                        {/* Contact Info Step */}
                        {activeStep === 11 && (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>Contact Info</Typography>
                            <TextField label="Email" name="email" value={currentUser?.email} onChange={handleChange} fullWidth disabled InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                            <TextField label="Phone" name="phone" value={profile.phone} onChange={handleChange} fullWidth InputProps={{ style: { fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' } }} />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                          <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0} sx={{ flex: 1, mr: 1, borderColor: '#e3e8ee', color: '#142850', '&:hover': { borderColor: '#FFD600', color: '#FFD600' } }}>
                            Back
                          </Button>
                          <Button variant="contained" onClick={activeStep === steps.length - 1 ? handleSave : handleNext} disabled={activeStep === 11 && !profile.email} sx={{ flex: 1, ml: 1, bgcolor: '#FFD600', color: '#142850', '&:hover': { bgcolor: '#FFC107' } }}>
                            {activeStep === steps.length - 1 ? 'Save Profile' : 'Next'}
                          </Button>
                        </Box>
                      </Box>
                    </Fade>
                  </React.Fragment>
                ) : (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 2, color: '#142850', fontFamily: 'Poppins, Segoe UI, Arial, sans-serif' }}>
                      Your profile is almost complete! Please click the "Complete Profile" button to finish.
                    </Typography>
                    <Button variant="contained" onClick={() => setEditMode(true)} sx={{ bgcolor: '#FFD600', color: '#142850', '&:hover': { bgcolor: '#FFC107' } }}>
                      Complete Profile
                    </Button>
                  </Box>
                )}
              </Card>
            </Box>
          </Grow>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
