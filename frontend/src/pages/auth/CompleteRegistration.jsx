import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "../../provider/authProvider";

const CompleteRegistration = () => {
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [notMatchedPasswordAlert, setNotMatchedPasswordAlert] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

      // Input validation
      if (!newPassword || newPassword.trim() === "") {
        setShowSuccessAlert(false);
        setNotMatchedPasswordAlert(false);
        setPasswordError("Password cannot be empty.");
        return false;
      }

      if (newPassword !== confirmationPassword) {
        setPasswordError("");
        setShowSuccessAlert(false);
        setNotMatchedPasswordAlert(true);
        return false;
      }

      if (!passwordRegex.test(newPassword)) {
        setNotMatchedPasswordAlert(false);
        setShowSuccessAlert(false);
        setPasswordError(
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
        );
        return false;
      }

      const response = await axios.post(
        `${baseUrl}/api/v1/auth/complete-registration`,
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
        setNotMatchedPasswordAlert(false);
        console.log("User Confirmed Account Successfully:", response.data);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data === "token is not valid"
      ) {
        setError("Token is not Valid");
      }
      setShowSuccessAlert(false);
      console.error("Error registering:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className="complete-registration-container"
      >
        <Box
          sx={{
            marginTop: isMobile ? 4 : 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: "large", mb: 1 }} />
          <Typography component="h1" variant="h5">
            Complete Registration
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            <NavLink
              style={{ float: "right", paddingBottom: 10, paddingTop: 5 }}
              to="../"
            >
              Go to Login?
            </NavLink>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
            {notMatchedPasswordAlert && (
              <Alert severity="warning">Passwords don't match</Alert>
            )}
            {passwordError && <Alert severity="warning">{passwordError}</Alert>}
            {showSuccessAlert && (
              <Alert severity="success">Account has been activated</Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CompleteRegistration;
