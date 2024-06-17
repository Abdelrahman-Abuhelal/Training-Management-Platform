import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

function Overview() {
  return (
    <Grid container spacing={3} style={{ marginTop: 20 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">Total Trainees</Typography>
          <Typography variant="h4">120</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">Total Supervisors</Typography>
          <Typography variant="h4">15</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">Active Training Programs</Typography>
          <Typography variant="h4">5</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6">Upcoming Trainings</Typography>
          <Typography variant="h4">3</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Overview;
