import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LoginIcon from "@mui/icons-material/Login";
import Navbar from "./Navbar";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_PORT_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.length || !password.length) {
      setError("Please enter both email and password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    await axios
      .post(`${baseUrl}/api/v1/auth/login`, {
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          setError("");
          setUserData(response.data);
          navigate("/", { replace: true });
        } else if (response.status === 401) {
          setError("Invalid email or password");
        } else {
          setError(response.data.message || "Login failed");
        }
      })
      .catch((error) => {
        setError("Login failed");
        console.error("Login failed:", error);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Paper sx={{ backgroundColor: theme.palette.background.paper }}>
      <Navbar />
      <Paper style={{ height: "89.5vh" }}>
        <Grid container style={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            flexDirection="column"
            justifyContent="flex-end" 
            alignItems="center"
            style={{
              backgroundImage: 'url("/back11.jpg")',
              backgroundSize: "cover",
              color: "white",
              paddingBottom: "50px", 
            }}
          >

            {/* <img
    src="/TMS_LOGO.jpg"
    alt="Exalt Logo"
    style={{ height: "200px", marginBottom: "20px" }}
  /> */}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box component="form" onSubmit={handleSubmit} width="100%" maxWidth={400}>
              <Box display="flex" justifyContent="center" mb={1}>
                <img
                  src="./EXALT_LOGO2.png"
                  alt="EXALT_LOGO"
                  style={{ height: "100px", marginBottom: "20px" }}
                />
              </Box>
              <Typography variant="h5" component="h1" textAlign="center" mb={2}>
                Login <LoginIcon fontSize="large" />
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                id="email"
                label="Email address"
                type="email"
                value={email}
                sx={{ backgroundColor: "#fff" }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth
                margin="normal"
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: "#fff" }}

              />
              <Box textAlign="right" my={1}>
                <Link component={NavLink} to="/forgot-password-email">
                  Forgot Password?
                </Link>
              </Box>
              <Button fullWidth variant="contained" color="primary" type="submit">
                Login
              </Button>
              {error && (
                <Alert severity="warning" style={{ marginTop: "20px" }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Paper>
  );
};

export default Login;
