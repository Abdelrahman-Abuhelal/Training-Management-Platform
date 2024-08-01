import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Button , Box} from '@mui/material';
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

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
    backgroundColor: '#D1E4F3',
    color: '#333',
  };

  return (
    <Grid container spacing={5} >
      <Grid item xs={12} sm={4} md={4}>
        <Paper style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.main }} >Active Trainees</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>{traineeSize}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/trainees')}>
              View
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.main }} >Active Supervisors</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>{supervisorSize}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/supervisors')}>
              View
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Paper style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.main }} >Active Admin Managers</Typography>
          <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>{superadminSize}</Typography>
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={() => navigate('/superadmins')}>
              View
            </Button>
          </Box>
        </Paper>
      </Grid>

    </Grid>
  );
}

export default Overview;
