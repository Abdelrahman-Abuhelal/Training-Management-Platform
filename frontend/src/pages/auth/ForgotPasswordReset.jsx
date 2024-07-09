import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Avatar,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const ForgotPasswordReset = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [NotMatchedPasswrodAlert, setNotMatchedPasswrodAlert] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

      // Input validation (enhanced with clear messages)
      if (!newPassword || newPassword.trim() === "") {
        setShowSuccessAlert(false);
        setNotMatchedPasswrodAlert(false);
        setPasswordError("Password cannot be empty. Please enter a new password.");
        return false;
      }

      if (newPassword !== confirmationPassword) {
        setPasswordError("");
        setShowSuccessAlert(false);
        setNotMatchedPasswrodAlert(true);
        setPasswordError("Passwords do not match. Please re-enter the same password in both fields.");
        return false;
      }

      if (!passwordRegex.test(newPassword)) {
        setNotMatchedPasswrodAlert(false);
        setShowSuccessAlert(false);
        setPasswordError(
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
        );
        return false;
      }

      const response = await axios.put(
        `${baseUrl}/api/v1/auth/forgot-password-reset`,
        {
          newPassword,
          confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setPasswordError("");
        setNotMatchedPasswrodAlert(false);
        console.log("Password reset successfully:", response.data);
      } else {
        setShowSuccessAlert(false);
        setPasswordError(
          "An error occurred while resetting your password. Please try again later."
        );
      }
    } catch (error) {
      setShowSuccessAlert(false);
      console.error("Error resetting password:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">

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
          <Typography component="h1" variant="h5">
            Reset Your Password
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            id="confirmationPassword"
            value={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
          />
          <NavLink style={{ float: "right", paddingBottom: 10, paddingTop: 5 }} to="../">Back to Login?</NavLink>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          {NotMatchedPasswrodAlert && (
            <Alert severity="warning">Passwords don't match</Alert>
          )}
          {passwordError && (
            <Alert severity="warning">{passwordError}</Alert>
          )}
          {showSuccessAlert && (
            <Alert severity="success">Password has been changed</Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordReset;
