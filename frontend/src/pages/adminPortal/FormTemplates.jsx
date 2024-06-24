import React, { useEffect, useState } from "react";
import { deleteFormTemplateAPI, fetchFormTemplatesAPI } from "../../apis/forms";
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  Button,
  Dialog, 
  DialogActions,
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Snackbar,
  Alert } from "@mui/material";

const FormTemplates = () => {
  const [formTemplates, setFormTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate  = useNavigate();

  const handleViewForm = (formId) => {
    navigate(`/form-templates/${formId}`);
  };

  const viewConfirmation = (formId) => {
    setIdToDelete(formId);
    setShowConfirmation(true);
  }

  const handleDeleteForm = (formId) => {
    deleteFormTemplateAPI(formId)
      .then(() => {
        setSnackbarMessage("Form deleted successfully.");
        setSnackbarOpen(true);
        setIdToDelete(null);
        fetchFormTemplates(); // Refresh form templates after deletion
      })
      .catch((error) => {
        console.error("Error deleting form template:", error);
        setSnackbarMessage("Error deleting form template.");
        setSnackbarOpen(true);
      })
      .finally(() => {
        setShowConfirmation(false);
      });
  } 

  const handleCancel = () => {
    setShowConfirmation(false);
    setIdToDelete(null);
  };

  const fetchFormTemplates = () => {
    fetchFormTemplatesAPI()
      .then((data) => {
        setFormTemplates(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching form templates:", error);
      });
  };

  useEffect(() => {
    fetchFormTemplates();
  }, []); // Empty dependency array means this effect runs once on component mount

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ margin: '2rem auto', maxWidth: '1000px' }}>
        <Paper sx={{ padding: '2rem', border: '0.5px solid #ccc' }}>
        <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          marginBottom: "1rem", // Example of custom margin
        }}
      >
        Form Templates
      </Typography>
      <TableContainer component={Paper} sx={{  border: '1px solid #ddd' }}>
        <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
        <TableRow>
        <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
        <Typography variant="subtitle1" fontWeight="bold">
                  Title
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                  Description
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formTemplates.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.title}</TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleViewForm(form.id)}>
                    <EditIcon/>
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => viewConfirmation(form.id)}>
                    <DeleteIcon/>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>

      <Dialog open={showConfirmation} onClose={handleCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete this form?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteForm(idToDelete)} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default FormTemplates;
