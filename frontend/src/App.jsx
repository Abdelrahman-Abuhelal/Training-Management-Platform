import './index.css';
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Import the custom theme


function App() {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </ThemeProvider>
  );
}

export default App;
