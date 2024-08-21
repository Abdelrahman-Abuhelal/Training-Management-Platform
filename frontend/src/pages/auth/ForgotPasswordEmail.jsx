import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header.jsx";
import { NavLink } from "react-router-dom";
import { Container, Paper, Box, Typography, TextField, Button, Link, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email cannot be empty. Please enter a valid email address.");
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const response = await axios.post(`${baseUrl}/api/v1/auth/forgot-password-email`, {
        email
      });

      if (response.status === 200) {
        setError("");
        setSuccess(true);
        console.log("Forgot password email sent:", response.data);
      } else {
        setError(response.data.message || "Failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("There is no registered user with this email");
      } else {
        setError(error.response?.data?.message || "An unexpected error occurred");
      }
    }
  };
  return (
    <Paper sx={{ display: "flex", justifyContent: "center",backgroundColor: theme.palette.background.paper}}>
        <Box sx={{width:'50%', backgroundColor: theme.palette.background.paper }}  flexDirection="column" alignItems="center" minHeight="100vh">
        <Container component="main" maxWidth="xs">
        <Box textAlign="center" mb={1}>
            <Box display="flex" justifyContent="center" mb={2}>
              <img
                src="/EXALT_LOGO2.png"
                alt="Exalt Logo"
                style={{ height: "50px", marginBottom: "20px" }}
              />
            </Box>
            <Box display="flex" justifyContent="center" mb={2}>

              <img
                src="/TMS_LOGO.jpg"
                alt="TMS Logo"
                style={{ height: "180px", borderRadius: "10px" }}
              />
            </Box>
            <Typography variant="h4" component="h1" mt={2}>
              Forgot your password?
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Enter your email address to receive a password reset link.
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
              sx={{backgroundColor:'#fff'}}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box textAlign="right" my={1}>
              <Link component={NavLink} to="../">
                Go to Login?
              </Link>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Send Reset Link
            </Button>
            {error && (
              <Alert severity="warning" style={{ marginTop: "20px" }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" style={{ marginTop: "20px" }}>
                Check your email for instructions on resetting your password.
              </Alert>
            )}
          </Box>
          </Container>
        </Box>
      </Paper>
  );
};

export default ForgotPasswordEmail;
