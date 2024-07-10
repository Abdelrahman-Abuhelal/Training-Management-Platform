import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

function Overview() {

  const paperStyle = {
    padding: 20,
    backgroundColor: '#D1E4F3', 
    color: '#333', 
  };

  return (
    <Grid container spacing={3} sx={{ marginTop: { xs: 2, sm: 3 } }}>
      <Grid item xs={12} sm={6} md={6}>
        <Paper style={paperStyle}>
          <Typography variant="h6">Active Trainees</Typography>
          <Typography variant="h4">120</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Paper style={paperStyle}>
          <Typography variant="h6">Active Supervisors</Typography>
          <Typography variant="h4">15</Typography>
        </Paper>
      </Grid>
     
    </Grid>
  );
}

export default Overview;
