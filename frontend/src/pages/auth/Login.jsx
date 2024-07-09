import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import { Container, Box, Typography, TextField, Button, Link, Alert } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    await axios.post(`${baseUrl}/api/v1/auth/login`, {
      email,
      password,
    }).then((response) => {
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

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
        <Box textAlign="center" mb={4}>
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/EXALT_LOGO2.png"
              alt="Exalt Logo"
              style={{ height: "50px", marginBottom: "20px" }}
            />
          </Box>
          <Box display="flex" justifyContent="center" mb={2}>

            <img
              src="TMS_LOGO.jpg"
              alt="TMS Logo"
              style={{ height: "180px", borderRadius: "10px" }}
            />                      </Box>

          <Typography variant="h4" component="h1" mt={2}>
            Login Page
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            fullWidth
            margin="normal"
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box textAlign="right" my={1}>
            <Link component={NavLink} to="/forgot-password-email">
              Forgot Password?
            </Link>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
          >
            Login
          </Button>
          {error && (
            <Alert severity="warning" style={{ marginTop: "20px" }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
