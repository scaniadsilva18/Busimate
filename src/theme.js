import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#0a66c2',
    },
    secondary: {
      main: '#e3e8ee',
    },
    background: {
      default: mode === 'dark' ? '#18191a' : '#f3f6f8',
      paper: mode === 'dark' ? '#23272f' : '#fff',
    },
    text: {
      primary: mode === 'dark' ? '#f3f6f8' : '#142850',
      secondary: mode === 'dark' ? '#b0b8c1' : '#64748b',
    },
  },
  typography: {
    fontFamily: 'Inter, Segoe UI, Poppins, Arial, sans-serif',
    h4: { fontWeight: 900, letterSpacing: 1 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
    body1: { fontWeight: 400 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px 0 rgba(20,40,80,0.08)',
          borderRadius: 10,
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

export default getDesignTokens;
