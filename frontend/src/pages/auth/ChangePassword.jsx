import React, { useState } from "react";
import axios from "axios";
import { NavLink } from 'react-router-dom';
import {
    Box,
    Container,
    Button,
    Paper,
    CssBaseline,
    TextField,
    Typography,
    Avatar,
    Alert,
} from '@mui/material';
import { useAuth } from "../../provider/authProvider";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const ChangePassword = () => {
    const { user } = useAuth();
    const { login_token } = user;
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [notMatchedPasswordAlert, setNotMatchedPasswordAlert] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const baseUrl = import.meta.env.VITE_PORT_URL;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

            // Input validation (enhanced with clear messages)
            if (!currentPassword || currentPassword.trim() === "") {
                setShowSuccessAlert(false);
                setNotMatchedPasswordAlert(false);
                setCurrentPasswordError("Current password cannot be empty. Please enter your current password.");
                return false;
            }

            if (!newPassword || newPassword.trim() === "") {
                setShowSuccessAlert(false);
                setNotMatchedPasswordAlert(false);
                setPasswordError("New password cannot be empty. Please enter a new password.");
                return false;
            }

            if (newPassword !== confirmationPassword) {
                setCurrentPasswordError("");
                setPasswordError("");
                setShowSuccessAlert(false);
                setNotMatchedPasswordAlert(true);
                setPasswordError("Passwords do not match. Please re-enter the same password in both fields.");
                return false;
            }

            if (!passwordRegex.test(newPassword)) {
                setCurrentPasswordError("");
                setNotMatchedPasswordAlert(false);
                setShowSuccessAlert(false);
                setPasswordError(
                    "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
                );
                return false;
            }

            const response = await axios.put(
                `${baseUrl}/api/v1/users/change-password`,
                {
                    currentPassword,
                    newPassword,
                    confirmationPassword,
                }, {
                headers: {
                    Authorization: `Bearer ${login_token}`
                }
            }
            );

            if (response.status === 200) {
                setShowSuccessAlert(true);
                setPasswordError("");
                console.log("Password changed successfully:", response.data);
            }
        } catch (error) {
            setShowSuccessAlert(false);
            if (error.response && error.response.data) {
                setPasswordError(error.response.data || "An error occurred while changing your password. Please try again later.");
            } else {
                setPasswordError("An error occurred while changing your password. Please try again later.");
            }
            console.error("Error changing password:", error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper elevation={3} sx={{ p: isMobile ? 1:3, width: isMobile ? '70%' : '150%',  backgroundColor:'#f8f5f5' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar sx={{ m: 1, bgcolor: 'black' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Change Your Password
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Current Password"
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="New Password"
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                id="confirmationPassword"
                                value={confirmationPassword}
                                onChange={(e) => setConfirmationPassword(e.target.value)}
                            />
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
                            {currentPasswordError && (
                                <Alert severity="warning">{currentPasswordError}</Alert>
                            )}
                            {passwordError && (
                                <Alert severity="warning">{passwordError}</Alert>
                            )}
                            {showSuccessAlert && (
                                <Alert severity="success">Password has been changed</Alert>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default ChangePassword;
