import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button , Box} from '@mui/material';
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkIcon from "@mui/icons-material/Work";

const Overview = () => {
  const [traineeSize, setTraineeSize] = useState([]);
  const [supervisorSize, setSupervisorSize] = useState([]);
  const [superadminSize, setSuperadminSize] = useState([]);
  const { user } = useAuth();
  const { login_token } = user;
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    traineeSizeAPI();
    supervisorSizeAPI();
    superadminSizeAPI();
  }, []);


  const traineeSizeAPI = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/trainees/size`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        const size = response.data;
        console.log(size);
        setTraineeSize(size);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const supervisorSizeAPI = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/supervisors/size`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        const size = response.data;
        console.log(size);
        setSupervisorSize(size);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const superadminSizeAPI = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/super-admins/size`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        const size = response.data;
        console.log(size);
        setSuperadminSize(size);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const paperStyle = {
    padding: 20,
    backgroundColor: theme.palette.background.paper,
    color: '#333',
  };

  return (
    <Grid container spacing={5} >
      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Active Trainees</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{traineeSize}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/trainees')}>
            <PeopleIcon fontSize='small'/> View 
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Active Supervisors</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{supervisorSize}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/supervisors')}>
            <PeopleIcon fontSize='small'/> View 
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Active Admin Managers</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{superadminSize}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/superadmins')}>
            <PeopleIcon fontSize='small'/> View 
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >User Management</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/users')}>
            <AdminPanelSettingsIcon fontSize='small'/> View
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Forms</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/form-templates')}>
            <DynamicFormIcon fontSize='small'/>   View
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Skills</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/skills')}>
            <AutoAwesomeIcon fontSize='small'/>  View
            </Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Job Hunt</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/job-description-ranking')}>
            <WorkIcon fontSize='small'/> View
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper elevation={3} style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Announcements</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/announcements')}>
            <NotificationImportantIcon fontSize='small'/> View
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
                <Paper elevation={3} style={paperStyle}>
                    <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark }} >Settings</Typography>
                    <Typography variant="h4" sx={{ color: theme.palette.primary.dark }}>{}</Typography>
                    <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={() => navigate('/settings')}>
                            View
                        </Button>
                    </Box>
                </Paper>
            </Grid>

    </Grid>
  );
}

export default Overview;
