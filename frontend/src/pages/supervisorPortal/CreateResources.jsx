import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";

const CreateResources = () => {
  const { user } = useAuth();
  const { login_token } = user;
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const navigate = useNavigate();

  const [resourceType, setResourceType] = useState('link');
  const [resourceName, setResourceName] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [resourceValue, setResourceValue] = useState('');
  const [file, setFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resourceType === 'link' && !resourceValue) {
      setSnackbarMessage({ severity: 'error', text: 'Please enter a URL.' });
      setOpenSnackbar(true);
      return;
    }

    if (resourceType === 'file' && !file) {
      setSnackbarMessage({ severity: 'error', text: 'Please select a file.' });
      setOpenSnackbar(true);
      return;
    }

    const requestData = {
      resourceName,
      description: resourceDescription,
      resourceType,
      resourceFile: resourceType === 'file' ? await getFileData(file) : null,
      resourceUrl: resourceType === 'link' ? resourceValue : null,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/v1/resources`, requestData, {
        headers: {
          Authorization: `Bearer ${login_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSnackbarMessage({ severity: 'success', text: 'Resource assigned successfully!' });
      } else {
        setSnackbarMessage({ severity: 'error', text: 'Failed to assign resource.' });
      }
    } catch (error) {
      console.error('Error creating resource:', error);
      setSnackbarMessage({ severity: 'error', text: 'Failed to assign resource.' });
    } finally {
      setOpenSnackbar(true);
      resetForm();
    }
  };


  const getFileData = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(Array.from(new Uint8Array(reader.result)));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const resetForm = () => {
    setResourceName('');
    setResourceDescription('');
    setResourceValue('');
    setFile(null);
    setResourceType('link');
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const navigateBack = () => {
    navigate(-1);
};


  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>                   

        <Button onClick={navigateBack} startIcon={<ArrowBackIcon />} variant='outlined' sx={{  backgroundColor: "#fff",alignSelf: 'flex-start', mb: '1rem' }}>
          Back 
        </Button>
        <Typography variant="h5" align='center' sx={{pb:'1rem'}} gutterBottom>
          Create Resources
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resource Name"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                required
                sx={{ backgroundColor: '#fff' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                multiline
                rows={3}
                sx={{ backgroundColor: '#fff' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Resource Type"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                SelectProps={{
                  native: true,
                }}
                sx={{ backgroundColor: '#fff' }}
              >
                <option value="link">Link</option>
                <option value="file">File</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              {resourceType === 'link' ? (
                <TextField
                  fullWidth
                  label="Resource URL"
                  type="url"
                  value={resourceValue}
                  onChange={(e) => setResourceValue(e.target.value)}
                  required
                  sx={{ backgroundColor: '#fff' }}
                />
              ) : (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Assign Resource
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} severity={snackbarMessage.severity} onClose={handleSnackbarClose}>
          {snackbarMessage.text}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default CreateResources;
