import React, { useState } from "react";
import axios from "axios";
import "../style/CreateUsersForm.css";
import ButtonAppBar from "../../components/admin/NavBar";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

const CreateUsersForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showNotFullDataAlert, setShowNotFullDataAlert] = useState(false);
  const [showError, setShowError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.length) {
      // validate the email
      setShowNotFullDataAlert(true);
      return;
    }
    if (!username.length) {
      setShowNotFullDataAlert(true);
      return;
    }
    if (!firstName.length) {
      setShowNotFullDataAlert(true);
      return;
    }
    if (!lastName.length) {
      setShowNotFullDataAlert(true);
      return;
    }

    if (email && username && firstName && lastName && role) {
      setLoading(true);
      // Simulate successful submission after 2 seconds
      setTimeout(() => {
        setLoading(false);
        setShowSuccessAlert(true);
      }, 2000);
    } else {
      setShowNotFullDataAlert(true);
    }
  

    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const response = await axios.post(`${baseUrl}/api/v1/admin/create-user`, {
        email,
        username,
        firstName,
        lastName,
        role,
      });
      if (response.status === 200) {
        setShowNotFullDataAlert(false);
        setShowSuccessAlert(true);
        setShowError("");
        console.log("Email verification Sent to the user :", response.data);
      } else if (response.status === 409) {
        setShowError("User with this email or username exists already!");
        setShowSuccessAlert(false);
        setShowNotFullDataAlert(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setShowError("Error creating user");
      setShowSuccessAlert(false);
      setShowNotFullDataAlert(false);
    }
  };

  return (
    <div>
      <ButtonAppBar />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={3}
        style={{ marginTop: "2rem" }}
      >
        <Grid item xs={12}>
          {/* <Grid container justifyContent="center">
            <img
              src="/EXALT_LOGO.png"
              alt="Exalt Logo"
              style={{ height: "auto", width: "auto", maxHeight: "80px" }}
            />
          </Grid> */}
            <Typography variant="h4" sx={{ mt: 5,mb:5, textAlign: 'center' , fontSize:35,fontFamily:"Cursive"}}>
            User Registration
            </Typography>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  label="Email address"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  label="Username"
                  fullWidth
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} >
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    label="Role"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="TRAINEE">Trainee</MenuItem>
                    <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                    <MenuItem value="SUPER_ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{mt: 5,mb:5, textAlign: 'center'}}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </Grid>
              <Grid item xs={12}>
                {showNotFullDataAlert && (
                  <div className="alert alert-warning">
                    Please fill all the details
                  </div>
                )}
                {showSuccessAlert && (
                  <div className="alert alert-success">
                    Email verification sent to the user email
                  </div>
                )}
                {showError && (
                  <div className="alert alert-warning">{showError}</div>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateUsersForm;
