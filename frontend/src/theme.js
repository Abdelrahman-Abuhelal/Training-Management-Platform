// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00538C', // Default primary color for buttons and other components
    },
    secondary: {
      main: '#ff4081', // Example secondary color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // Example to customize button border radius
        },
      },
    },
  },
  typography: {
    fontFamily: '"Concert One", sans-serif', // Example to customize the default font family
    h1: {
      fontSize: '2rem', // Example to customize the default h1 font size
    },
  },
});

export default theme;
