import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Button,
  List,
  ListItem,
  ListItemText,
  Link,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Checkbox,
  IconButton,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useAuth } from '../../provider/authProvider';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { useTheme } from "@mui/material/styles";
import SourceIcon from '@mui/icons-material/Source';

const Resources = () => {
  const { user } = useAuth();
  const { login_token } = user;
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const theme = useTheme();
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [showSendFormModal, setShowSendFormModal] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  const [resources, setResources] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/supervisor/my-resources`, {
          headers: {
            Authorization: `Bearer ${login_token}`,
          },
        });
        setResources(response.data);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
        setSnackbarMessage('Failed to fetch resources.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchResources();
  }, [baseUrl, login_token]);

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/supervisor/my-trainees`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
        },
      });
      if (response.status === 200) {
        const traineeUsers = response.data.map((trainee) => ({
          ...trainee,
          fullName: `${trainee.userFirstName} ${trainee.userLastName}`
        }));
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const handleDownload = async (resource) => {
    if (resource.resourceType === 'file') {
      const downloadUrl = `${baseUrl}/api/v1/resources/download/${resource.id}`;
      console.log('Download URL:', downloadUrl);
  
      try {
        const response = await axios.get(downloadUrl, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${login_token}`,
          },
        });
  
        let fileName=resource.resourceName+'.pdf';
  
        // Create a URL for the blob data
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // Create a link element and set the download attribute
        const link = document.createElement('a');
        link.href = url;
  
        // Extract the filename from the Content-Disposition header
        const disposition = response.headers['content-disposition'];
        console.log('Content-Disposition:', disposition); // Log the disposition
  
        if (disposition && disposition.indexOf('filename=') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|([^;\n]*))/;
          const matches = filenameRegex.exec(disposition);
          console.log('Matches:', matches); // Log matches for debugging
          
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, ''); // Clean up quotes
            console.log('Extracted filename:', fileName); // Log the extracted filename
          } else {
            console.log('No filename found in matches.'); // Log if no filename is found
          }
        } else {
          console.log('Content-Disposition header not present or does not contain filename.'); // Log if header is not present
        }
  
        link.setAttribute('download', fileName); // Set the correct filename
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Clean up the URL.createObjectURL
      } catch (error) {
        console.error('Error downloading the resource:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
        }
      }
    } else {
      console.log('Resource is not a file.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
        },
      });
      setResources(resources.filter((resource) => resource.id !== id));
      setSnackbarMessage('Resource deleted successfully.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Failed to delete resource:', error);
      setSnackbarMessage('Failed to delete resource.');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleOpenSendDialog = (resourceId) => {
    setSelectedResourceId(resourceId);
    setShowSendFormModal(true);
  };

  const handleSendResource = async () => {
    try {
      await axios.put(`${baseUrl}/api/v1/resources/${selectedResourceId}/assign`, {
        userIds: selectedTrainees
      }, {
        headers: {
          Authorization: `Bearer ${login_token}`,
        },
      });
      alert('Resource sent successfully!');
      setShowSendFormModal(false);
    } catch (error) {
      console.error('Error sending resource:', error);
      alert('Failed to send resource.');
    }
  };

  const handleToggleTrainee = (traineeId) => {
    setSelectedTrainees((prevSelected) =>
      prevSelected.includes(traineeId)
        ? prevSelected.filter(id => id !== traineeId)
        : [...prevSelected, traineeId]
    );
  };

  const handleSendFormCancel = () => {
    setShowSendFormModal(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleNavigateToCreateResource = () => {
    navigate('/create-resource'); // Adjust the path according to your routing
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%",minHeight:"450px", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography className="concert-one-regular" sx={{ml:'1rem'}} gutterBottom>
           Resource List   <SourceIcon sx={{fontSize:'35px' , mb:'0.5rem' , ml:'0.35rem'}}/> 
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNavigateToCreateResource}
          >
            Create Resource
          </Button>
        </div>
        <List>
          {resources.map((resource) => (
            <ListItem key={resource.id} divider style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <ListItemText
                primary={resource.resourceName}
                secondary={resource.description || 'No description provided'}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {resource.resourceType === 'link' ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    href={resource.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ minWidth: '120px' }}
                    sx={{  backgroundColor: "#fff" }}
                    >
                    Visit Link
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDownload(resource)}
                    sx={{  backgroundColor: "#fff" }}
                    style={{ width: '120px' }}
                  >
                    Download 
                  </Button>
                )}
                <Button
                  onClick={() => handleOpenSendDialog(resource.id)}
                  variant="contained"
                  color="primary"
                  style={{ width: '120px' }}
                >
                  Send
                </Button>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(resource.id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </div>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Dialog open={showSendFormModal} onClose={handleSendFormCancel}>
        <DialogTitle>Send Resource</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select trainees to send the resource to:
          </DialogContentText>
          <List>
            {trainees.map(trainee => (
              <ListItem key={trainee.userId}>
                <Checkbox
                  checked={selectedTrainees.includes(trainee.userId)}
                  onChange={() => handleToggleTrainee(trainee.userId)}
                />
                <ListItemText primary={trainee.fullName} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendFormCancel}>Cancel</Button>
          <Button onClick={handleSendResource} variant="contained" color="primary">Send</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Resources;
