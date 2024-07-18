import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox,
  Grid,
} from "@mui/material";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the icon
import { useAuth } from "../../provider/authProvider";
import SearchComponent from "../../components/Search";
import FactCheckIcon from '@mui/icons-material/FactCheck';

const FormTemplates = () => {
  const { user } = useAuth();
  const { login_token } = user;
  const [searchTerm, setSearchTerm] = useState("");
  const [formTemplates, setFormTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSendFormModal, setShowSendFormModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersAlreadySent, setUsersAlreadySent] = useState([]);
  const [idToSend, setIdToSend] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectAllTrainees, setSelectAllTrainees] = useState(false);
  const [selectAllSupervisors, setSelectAllSupervisors] = useState(false);

  const handleViewForm = (formId) => {
    navigate(`/form-templates/${formId}`);
  };

  const viewConfirmation = (formId) => {
    setIdToDelete(formId);
    setShowConfirmation(true);
  }

  const formBuilderPage = () => {
    navigate("/create-forms")
  }
  const openSubmissonsPage = (formId) => {
    navigate(`/form-templates/${formId}/submissions`);
  }
  const handleSearchUsers = (query) => {
    setSearchQuery(query);
  };

  const handleToggleAllTrainees = () => {
    const newSelected = selectAllTrainees
      ? selectedUsers.filter(
        (userId) =>
          !filteredTrainees.find((trainee) => trainee.userId === userId)
      )
      : [
        ...selectedUsers,
        ...filteredTrainees
          .filter((trainee) => !selectedUsers.includes(trainee.userId))
          .map((trainee) => trainee.userId),
      ];

    setSelectAllTrainees(!selectAllTrainees);
    setSelectedUsers(newSelected);
  };

  const handleToggleAllSupervisors = () => {
    const newSelected = selectAllSupervisors
      ? selectedUsers.filter(
        (userId) =>
          !filteredSupervisors.find(
            (supervisor) => supervisor.userId === userId
          )
      )
      : [
        ...selectedUsers,
        ...filteredSupervisors
          .filter((supervisor) => !selectedUsers.includes(supervisor.userId))
          .map((supervisor) => supervisor.userId),
      ];

    setSelectAllSupervisors(!selectAllSupervisors);
    setSelectedUsers(newSelected);
  };

  const filteredTrainees = trainees.filter((trainee) =>
    trainee.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainee.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainee.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainee.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSupervisors = supervisors.filter((supervisor) =>
    supervisor.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteForm = (formId) => {
    axios.delete(`${baseUrl}/api/v1/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${login_token}`
      }
    }).then(() => {
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
    axios.get(`${baseUrl}/api/v1/forms`, {
      headers: {
        Authorization: `Bearer ${login_token}`
      }
    }).then((response) => {
      setFormTemplates(response.data);
      setLoading(false);
    })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching form templates:", error);
      });
  };

  useEffect(() => {
    fetchFormTemplates();
  }, []);

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
    try {
      const response = await axios.get(`${baseUrl}/api/v1/forms/${idToSend}/users-assigned`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      setUsersAlreadySent(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const sendFormAPI = async () => {
    try {
      const response = await axios.put(`${baseUrl}/api/v1/forms/${idToSend}/send`,
        selectedUsers
        , {
          headers: {
            Authorization: `Bearer ${login_token}`
          }
        });
      setIdToSend(null)
      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/users`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
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
      const response = await axios.get(`${baseUrl}/api/v1/admin/users`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
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

  const openSendFormModal = (formId) => {
    setIdToSend(formId);
    setShowSendFormModal(true);
  };

  useEffect(() => {
    if (idToSend !== null) {
      getUsersAssignedTo();
    }
  }, [idToSend]);

  useEffect(() => {
    if (showSendFormModal) {
      fetchTrainees();
      fetchSupervisors();
    }
  }, [showSendFormModal]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
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

    <Box sx={{ margin: '2rem auto', maxWidth: '1200px' }}>
      <Paper sx={{ padding: '2rem', border: '0.5px solid #ccc' , backgroundColor: '#F3F7EC' }}>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          <FactCheckIcon fontSize="large" sx={{mr:'0.3rem'}}/> EXALT Form Templates
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button variant="outlined"  onClick={formBuilderPage} startIcon={<AddIcon />}>
            Create new Form
          </Button>
        </Box>                

        <TableContainer component={Paper} sx={{ border: '1px solid #ddd',minHeight: 450, width: '100%' }}>
          <Table>
            <TableHead >
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
                    Actions</Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Submissions
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
                    <Button variant="outlined" color="primary" onClick={() => handleViewForm(form.id)}
                      startIcon={<EditIcon />}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="secondary"
                      onClick={() => viewConfirmation(form.id)} startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => openSendFormModal(form.id)}
                      startIcon={<SendIcon />}>
                      Send
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openSubmissonsPage(form.id)}
                      startIcon={<QuestionAnswerIcon />}>
                      View Submissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={handleCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this form template?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteForm(idToDelete)}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Form Modal */}
      <Dialog open={showSendFormModal} onClose={handleCancelSendForm} maxWidth="lg" fullWidth>
        <DialogTitle>Select Users to Send Form</DialogTitle>
        <DialogContent>
          <SearchComponent
            placeholder="Search users..."
            searchQuery={searchTerm}
            onSearch={handleSearchChange}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Trainees</Typography>
            <Button
              onClick={handleToggleAllTrainees}
              variant="contained"
              color="primary"
              size="small"
              sx={{ mb: 1 }}
            >
              {selectAllTrainees ? "Deselect All Trainees" : "Select All Trainees"}
            </Button>
            <List>
              {filteredTrainees.map((trainee) => (
                <ListItem key={trainee.userId} button onClick={handleUserToggle(trainee.userId)}>
                  <ListItemAvatar>
                    <Avatar alt={trainee.userUsername} src={trainee.userAvatar} />
                  </ListItemAvatar>
                  <ListItemText primary={`${trainee.userFirstName} ${trainee.userLastName}`} secondary={trainee.userEmail} />
                  <Checkbox
                    edge="end"
                    checked={selectedUsers.includes(trainee.userId)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Supervisors</Typography>
            <Button
              onClick={handleToggleAllSupervisors}
              variant="contained"
              color="primary"
              size="small"
              sx={{ mb: 1 }}
            >
              {selectAllSupervisors ? "Deselect All Supervisors" : "Select All Supervisors"}
            </Button>
            <List>
              {filteredSupervisors.map((supervisor) => (
                <ListItem key={supervisor.userId} button onClick={handleUserToggle(supervisor.userId)}>
                  <ListItemAvatar>
                    <Avatar alt={supervisor.userUsername} src={supervisor.userAvatar} />
                  </ListItemAvatar>
                  <ListItemText primary={`${supervisor.userFirstName} ${supervisor.userLastName}`} secondary={supervisor.userEmail} />
                  <Checkbox
                    edge="end"
                    checked={selectedUsers.includes(supervisor.userId)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItem>
              ))}
            </List>
          </Box>
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
    </Box>
  );
};

export default FormTemplates;
