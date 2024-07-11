import React from 'react';
import { Breadcrumbs, Link, Typography, Grid } from '@mui/material';

const BreadcrumbsComponent = () => {
  return (
    <Grid container justifyContent="flex-start">
      <Grid item>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="#">
            Home
          </Link>
          <Typography color="textPrimary">Dashboard v1</Typography>
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
};

export default BreadcrumbsComponent;
