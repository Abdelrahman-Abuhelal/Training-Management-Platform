import React, { useState,useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";
import { useTheme } from '@mui/material/styles';

const Overview =()=>{
const [traineeSize,setTraineeSize] = useState([]);
const [supervisorSize,setSupervisorSize] = useState([]);
const { user } = useAuth();
const { login_token } = user;
const baseUrl = import.meta.env.VITE_PORT_URL;
const theme = useTheme();

useEffect(() => {
  traineeSizeAPI();
  supervisorSizeAPI();
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

  const paperStyle = {
    padding: 20,
    backgroundColor: '#D1E4F3', 
    color: '#333', 
  };

  return (
    <Grid container spacing={3} >
      <Grid item xs={12} sm={6} md={6}>
        <Paper style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{color:  theme.palette.primary.main}} >Active Trainees</Typography>
          <Typography variant="h4"  sx={{color:  theme.palette.primary.main}}>{traineeSize}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Paper style={paperStyle}>
          <Typography className="concert-one-regular" variant='inherit' sx={{color:  theme.palette.primary.main}} >Active Supervisors</Typography>
          <Typography variant="h4"  sx={{color:  theme.palette.primary.main}}>{supervisorSize}</Typography>
        </Paper>
      </Grid>
     
    </Grid>
  );
}

export default Overview;
