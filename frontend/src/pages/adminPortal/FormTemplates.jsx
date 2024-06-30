import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteFormTemplateAPI, fetchFormTemplatesAPI } from "../../apis/forms";
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
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
  Alert,
  TextField,
  Checkbox,
  ListItemText,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  IconButton
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the icon

const FormTemplates = () => {
  const [formTemplates, setFormTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSendFormModal, setShowSendFormModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersAlreadySent,setUsersAlreadySent]=useState([]);
  const [idToSend,setIdToSend]=useState(null);
  const [trainees,setTrainees]= useState([]);
  const [supervisors,setSupervisors]= useState([]);
  const navigate  = useNavigate();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewForm = (formId) => {
    navigate(`/form-templates/${formId}`);
  };

  const viewConfirmation = (formId) => {
    setIdToDelete(formId);
    setShowConfirmation(true);
  }
 const formBuilderPage = ()=>{
  navigate("/create-forms")
 }

  const handleSearchUsers = (query) => {
    setSearchQuery(query);
  };

  const filteredTrainees = trainees.filter((user) =>
    user.userUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSupervisors = supervisors.filter((user) =>
    user.userUsername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteForm = (formId) => {
    deleteFormTemplateAPI(formId)
      .then(() => {
        setSnackbarMessage("Form has been deleted successfully.");
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

  const handleSendForm = () => {
    console.log("Sending form to:", selectedUsers);
    sendFormAPI();
    setSelectedUsers([]);
    setShowSendFormModal(false);
    // Additional logic to handle sending the form template
  };

  const handleUserToggle = (userId) => () => {
    const currentIndex = selectedUsers.indexOf(userId);
    const newSelectedUsers = [...selectedUsers];

    if (currentIndex === -1) {
      newSelectedUsers.push(userId);
    } else {
      newSelectedUsers.splice(currentIndex, 1);
    }

    setSelectedUsers(newSelectedUsers);
  };

  const getUsersAssignedTo = async () => {
    try{
      const response = await axios.get(`${baseUrl}/api/v1/forms/${idToSend}/users-assigned`);
      setUsersAlreadySent(response.data);
      console.log(response.data);
    }catch(error){
      console.log(error);
    }
  }

  const sendFormAPI = async () => {
    try {
      const response = await axios.put(`${baseUrl}/api/v1/forms/${idToSend}/send`,
        selectedUsers
      );
      setIdToSend(null)
      if (response.status === 200) {
        console.log(response.data);
      }     
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/users`);
      if (response.status === 200) {
        const traineeUsers = response.data.filter(
          (item) => item.userRole === "TRAINEE"
        );
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/users`);
      if (response.status === 200) {
        const supervisorUsers = response.data.filter(
          (item) => item.userRole === "SUPERVISOR"
        );
        setSupervisors(supervisorUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersAssignedTo();
    fetchTrainees();
    fetchSupervisors();
  }, [showSendFormModal]);

  const openSendFormModal = (formId) => {
    setShowSendFormModal(true);
    setIdToSend(formId);
    // Additional logic to prepare the modal (e.g., fetching users to display)
  };

const handleCancelSendForm = () => {
  setIdToSend(null)
  setSelectedUsers([]);
  setShowSendFormModal(false);
}


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
            marginBottom: "1rem",
          }}
        >
          EXALT Form Templates
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button onClick={formBuilderPage} startIcon={<AddIcon />}>
            Create new Form
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ border: '1px solid #ddd' }}>
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
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
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
                    <Button variant="outlined" color="primary" onClick={() => openSendFormModal(form.id)}>
                      Send
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleViewForm(form.id)}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell>
                  <Button variant="outlined" color="error" onClick={() => viewConfirmation(form.id)}>
                      <DeleteIcon />
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

      <Dialog open={showSendFormModal} onClose={handleCancelSendForm}>
      <DialogTitle>Select Users</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="searchUsers"
            label="Search Users"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(e) => handleSearchUsers(e.target.value)} 
          />
          <List>
            <Typography> Trainees </Typography>
            {filteredTrainees.map((user) => (
            <ListItem key={user.userId} button onClick={handleUserToggle(user.userId)}>
                <ListItemAvatar>
                  <Avatar>
                  {user.userUsername.charAt(0)} {/* Add user avatar or initials */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.userUsername} />
                {usersAlreadySent.includes(user.userId) && (
                  <CheckCircleIcon color="success" /> 
                )}
                <Checkbox
                  edge="end"
                  onChange={handleUserToggle(user.userId)}
                  checked={selectedUsers.indexOf(user.userId) !== -1}
                />
              </ListItem>
            ))}
          </List>
          <List>
            <Typography> Supervisors </Typography>
            {filteredSupervisors.map((user) => (
            <ListItem key={user.userId} button onClick={handleUserToggle(user.userId)}>
                <ListItemAvatar>
                  <Avatar>
                  {user.userUsername.charAt(0)} {/* Add user avatar or initials */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.userUsername} />
                {usersAlreadySent.includes(user.userId) && (
                  <CheckCircleIcon color="success" /> 
                )}
                <Checkbox
                  edge="end"
                  onChange={handleUserToggle(user.userId)}
                  checked={selectedUsers.indexOf(user.userId) !== -1}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSendForm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendForm} color="primary">
            Send
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
