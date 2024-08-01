import React from 'react';
import { Paper, Grid, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
const AdminSettings = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom sx={{ mt: 2, color: theme.palette.primary.main }}>
      <SettingsIcon fontSize='50px'/> Admin Settings   <SettingsIcon fontSize='50px'/>
      </Typography>
      <Paper elevation={3} sx={{ p: 3, m: 2, width: "90%", borderRadius: '0.5rem', maxWidth: 1200, backgroundColor: '#E1EBEE' ,mt:'2rem'}}>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item sx={{ marginBottom: 2 }}>
            <Button
              variant="contained"
              sx={{
                height: '60px', // Increase button height
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark, // Change color on hover
                },
                width: '400px', // Optional: make buttons full width
              }}
              onClick={() => navigate("/change-password")}
            >
              <Typography variant="h5" color="white">
                Change Password
              </Typography>
            </Button>
          </Grid>
          <Grid item sx={{ marginBottom: 2 }}>
            <Button
              variant="contained"
              sx={{
                height: '60px', // Increase button height
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark, // Change color on hover
                },
                width: '400px', // Optional: make buttons full width
              }}
              onClick={() => navigate("/add-skills")}
            >
              <Typography variant="h5" color="white">
                Add Skills
              </Typography>
            </Button>
          </Grid>
          <Grid item sx={{ marginBottom: 2 }}>
            <Button
              variant="contained"
              sx={{
                height: '60px', // Increase button height
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark, // Change color on hover
                },
                width: '400px', // Optional: make buttons full width
              }}
              onClick={() => navigate("/add-courses")}
            >
              <Typography variant="h5" color="white">
                Add Courses
              </Typography>
            </Button>
          </Grid>
          <Grid item sx={{ marginBottom: 2 }}>
            <Button
              variant="contained"
              sx={{
                height: '60px', // Increase button height
                bgcolor: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark, // Change color on hover
                },
                width: '400px', // Optional: make buttons full width
              }}
              onClick={() => navigate("/users")}
            >
              <Typography variant="h5" color="white">
                Manage Users
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
