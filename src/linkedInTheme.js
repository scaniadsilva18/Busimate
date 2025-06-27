import { createTheme } from '@mui/material/styles';

const linkedInTheme = createTheme({
  palette: {
    primary: {
      main: '#0a66c2', // LinkedIn blue
    },
    secondary: {
      main: '#e3e8ee', // subtle gray
    },
    background: {
      default: '#f3f6f8',
      paper: '#fff',
    },
    text: {
      primary: '#142850',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Poppins, Arial, sans-serif',
    h4: { fontWeight: 900, letterSpacing: 1 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
    body1: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
  },
});

export default linkedInTheme;
