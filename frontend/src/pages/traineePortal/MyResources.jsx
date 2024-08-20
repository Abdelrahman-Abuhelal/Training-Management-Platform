import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Link,
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useAuth } from '../../provider/authProvider';
import { useTheme } from "@mui/material/styles";
import SourceIcon from '@mui/icons-material/Source';
import SearchComponent from "../../components/Search";


const MyResources = () => {
  const { user } = useAuth();
  const { login_token } = user;
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const [resources, setResources] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const fetchResources = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/trainee-operations/my-resources`, {
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
  useEffect(() => {
    fetchResources();
  }, [searchTerm, baseUrl, login_token]);

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

        let fileName = 'download.pdf'; // Default name
        console.log('Initial filename:', fileName);

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



  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };



  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const filteredResources = resources.filter((resource) =>
    resource.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper elevation={3} sx={{ p: 3, m: 3, width: "85%", minHeight: "450px", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" gutterBottom sx={{ pl: '1rem' }}>
          My Resources   <SourceIcon fontSize='large' />
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={12} md={5} sx={{ml:'1rem'}}>
            <SearchComponent searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </Grid>
        </Grid>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {filteredResources.map((resource) => (
            <Card key={resource.id} sx={{ width: 300, m: 2, backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{resource.resourceName}</Typography>
                <Typography color="text.secondary">
                  {resource.description && resource.description.length > 60
                    ? `${resource.description.substring(0, 60)}...`
                    : resource.description || 'No description provided'}
                </Typography>
              </CardContent>
              <CardActions sx={{ marginTop: 'auto' }}>
                {resource.resourceType === 'link' ? (
                  <Link href={resource.resourceUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="small">Visit Link</Button>
                  </Link>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleDownload(resource)}
                  >
                    Download File
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </div>
      </Paper>
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

export default MyResources;
