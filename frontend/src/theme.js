import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#f2f8f8",
      main: "#32c1c1",
      dark: "#2ca4a4",
      contrastText: "#fff",
    },
    secondary: {
      light: "#fff",
      main: "#ff4081",
      dark: "#ff0051",
      contrastText: "#32c1c1",
    },
    background: {
      paper: "#F5FFFA",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
});



 
const lightTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      light: "#f2f8f8",
      main: "#32c1c1",
      dark: "#2ca4a4",
      contrastText: "#fff",
    },
    secondary: {
      light: "#fff",
      main: "#fff",
      dark: "#fff",
      contrastText: "#32c1c1",
    },
  },
});

export default theme;
