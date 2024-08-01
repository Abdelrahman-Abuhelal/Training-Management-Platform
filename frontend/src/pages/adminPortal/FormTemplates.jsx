import React, { useEffect, useState } from "react";
import axios from "axios";
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
  Alert,
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
  Select,
  List,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Checkbox, FormControl,
  Grid,
} from "@mui/material";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import the icon
import { useAuth } from "../../provider/authProvider";
import SearchComponent from "../../components/Search";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const FormTemplates = () => {
  const theme = useTheme();
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
  const [sendSnackbarOpen, setSendSnackbarOpen] = useState(false);
  const [sendSnackbarMessage, setSendSnackbarMessage] = useState("");
  const [showDuplicationConfirmation, setShowDuplicationConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [
      { question: "", type: "text", options: [] },
    ],
  });
  const [idToDuplicate, setIdToDuplicate] = useState(null);
  const [idToSend, setIdToSend] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectAllTrainees, setSelectAllTrainees] = useState(false);
  const [selectAllSupervisors, setSelectAllSupervisors] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchFormTerm, setSearchFormTerm] = useState('');

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
  
  const filteredForms = formTemplates.filter(form =>
    form.title.toLowerCase().includes(searchFormTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchFormTerm.toLowerCase())
  );

  const filteredTrainees = trainees.filter((trainee) =>
    (trainee.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedBranch === "" || trainee.userBranch === selectedBranch) &&
    (selectedRole === "" || trainee.userRole === selectedRole)
  );

  const filteredSupervisors = supervisors.filter((supervisor) =>
    (supervisor.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supervisor.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedBranch === "" || supervisor.branch === selectedBranch) &&
    (selectedRole === "" || supervisor.userRole === selectedRole)
  );

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
    axios.get(`${baseUrl}/api/v1/forms/all`, {
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

  // const getUsersAssignedTo = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/api/v1/forms/${idToSend}/users-assigned`, {
  //       headers: {
  //         Authorization: `Bearer ${login_token}`
  //       }
  //     });
  //     setUsersAlreadySent(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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
        setSendSnackbarMessage("Form has been sent successfully.");
        setSendSnackbarOpen(true);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const fetchFormDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/forms/${idToDuplicate}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      const form = response.data;
      const mappedForm = {
        title: form.title,
        description: form.description,
        questions: form.questions.map(question => ({
          question: question.question,
          type: question.type,
          options: question.options,
        })),
      };
      setFormData(mappedForm);
    } catch (error) {
      console.error("Error fetching form details:", error);
    }
  };

  useEffect(() => {
    if (idToDuplicate) {
      fetchFormDetails();
    }
  }, [idToDuplicate]);

  const duplicateFormAPI = async () => {
    try {
      if (!formData.title) {
        throw new Error("Form data is empty.");
      }

      const response = await axios.post(
        `${baseUrl}/api/v1/forms/create-form`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${login_token}`,
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Form has been duplicated successfully.");
        setSnackbarOpen(true);
        fetchFormTemplates(); // Refresh form templates after duplication
      }
    } catch (error) {
      console.error("Error duplicating form template:", error);
      setSnackbarMessage("Error duplicating form template.");
      setSnackbarOpen(true);
    } finally {
      setShowDuplicationConfirmation(false);
      setIdToDuplicate(null);
    }
  };

  const fetchUsers = async () => {
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
        const supervisorUsers = response.data.filter(
          (item) => item.userRole === "SUPERVISOR"
        );
        setSupervisors(supervisorUsers);
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleSearchFormChange = (event) => {
    setSearchFormTerm(event.target.value);
  };

  const openSendFormModal = (formId) => {
    setShowSendFormModal(true);
    setIdToSend(formId);
    fetchUsers();
  };

  // useEffect(() => {
  //   if (idToSend !== null) {
  //     getUsersAssignedTo();
  //   }
  // }, [idToSend]);

  useEffect(() => {
    if (showSendFormModal) {
      fetchUsers();
    }
  }, [showSendFormModal]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };


  const handleSendFormCancel = () => {
    setIdToSend(null)
    setShowSendFormModal(false);
    setSelectedUsers([]);
  };
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const viewDuplicationConfirmation = (formId) => {
    setIdToDuplicate(formId);
    setShowDuplicationConfirmation(true);
  };

  const handleDuplicationCancel = () => {
    setShowDuplicationConfirmation(false);
    setIdToDuplicate(null);
  };

  return (

    <Box sx={{ margin: '2rem auto', maxWidth: '1200px' }}>
      <Paper sx={{ padding: '2rem', borderRadius: '1rem', backgroundColor: '#E1EBEE', border: '0.5px solid #ccc' }}>
        <Typography
          className="concert-one-regular" variant='inherit'
          align="center"
          sx={{
            marginBottom: "2rem",
            color: theme.palette.primary.main
          }}
        >
          <FactCheckIcon fontSize="large" sx={{ mr: '0.3rem' }} /> EXALT Form Templates
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button variant="contained" sx={{ border: '1x solid #ccc' }} onClick={formBuilderPage} startIcon={<AddIcon />}>
             New Form
          </Button>
        </Box>
        <Grid item xs={12} md={6} sx={{marginBottom:'0.5rem'}}>
            <SearchComponent
              searchTerm={searchFormTerm} onSearchChange={handleSearchFormChange} />
          </Grid>
        <TableContainer component={Paper} sx={{ border: '1px solid #ddd', minHeight: 450, width: '100%',borderRadius:'1rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: '1px solid #ddd', width: '20%' }}>
                  <Typography variant="subtitle1">
                    Title
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', width: '20%' }}>
                  <Typography variant="subtitle1" >
                    Description
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', width: '40%' }} colSpan={2} align="center">
                  <Typography variant="subtitle1" >
                    Actions
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', width: '20%' }} align="center">
                  <Typography variant="subtitle1" >
                    Submissions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell sx={{ width: '20%' }}>{form.title.length > 50 ? `${form.title.substring(0, 50)}...` : form.title}
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    {form.description.length > 50 ? `${form.description.substring(0, 50)}...` : form.description}
                  </TableCell>
                  <TableCell colSpan={2} sx={{ width: '40%' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleViewForm(form.id)}
                          startIcon={<EditIcon />}
                          fullWidth
                        >
                          Edit
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => openSendFormModal(form.id)}
                          startIcon={<SendIcon />}
                          fullWidth
                        >
                          Send
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => viewConfirmation(form.id)}
                          startIcon={<DeleteIcon />}
                          fullWidth
                        >
                          Delete
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => viewDuplicationConfirmation(form.id)}
                          fullWidth
                        >
                          Duplicate
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openSubmissonsPage(form.id)}
                      startIcon={<QuestionAnswerIcon />}
                    >
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
      <Dialog open={showSendFormModal} onClose={handleSendFormCancel}>
        <DialogTitle>Send Form <SendIcon /> </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select users to send the form to:
          </DialogContentText>
          <Box mt={2}>
            <SearchComponent searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </Box>
          <FormControl fullWidth>
            <Select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              displayEmpty
              sx={{ marginTop: theme.spacing(2), backgroundColor: '#E1EBEE' }}
            >
              <MenuItem value="">
                <em>All Branches</em>
              </MenuItem>
              <MenuItem value="RAMALLAH">Ramallah</MenuItem>
              <MenuItem value="NABLUS">Nablus</MenuItem>
              <MenuItem value="BETHELEHEM">Bethlehem</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              displayEmpty
              sx={{ marginTop: theme.spacing(2), backgroundColor: '#E1EBEE' }}
            >
              <MenuItem value="">
                <em>All Roles</em>
              </MenuItem>
              <MenuItem value="TRAINEE">Trainee</MenuItem>
              <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
            </Select>
          </FormControl>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Trainees</Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Checkbox
                      edge="start"
                      checked={selectAllTrainees}
                      tabIndex={-1}
                      disableRipple
                      onChange={handleToggleAllTrainees}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Select All" />
                </ListItem>
                {filteredTrainees.map((trainee) => (
                  <ListItem key={trainee.userId}>
                    <ListItemAvatar>
                      <Checkbox
                        edge="start"
                        checked={selectedUsers.indexOf(trainee.userId) !== -1}
                        tabIndex={-1}
                        disableRipple
                        onChange={handleUserToggle(trainee.userId)}
                      />
                    </ListItemAvatar>
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${trainee.userFirstName} ${trainee.userLastName}`}
                      secondary={trainee.userBranch}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Supervisors</Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Checkbox
                      edge="start"
                      checked={selectAllSupervisors}
                      tabIndex={-1}
                      disableRipple
                      onChange={handleToggleAllSupervisors}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Select All" />
                </ListItem>
                {filteredSupervisors.map((supervisor) => (
                  <ListItem key={supervisor.userId}>
                    <ListItemAvatar>
                      <Checkbox
                        edge="start"
                        checked={selectedUsers.indexOf(supervisor.userId) !== -1}
                        tabIndex={-1}
                        disableRipple
                        onChange={handleUserToggle(supervisor.userId)}
                      />
                    </ListItemAvatar>
                    <ListItemAvatar>
                      <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${supervisor.userFirstName} ${supervisor.userLastName}`}
                      secondary={supervisor.userBranch}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendFormCancel}>Cancel</Button>
          <Button onClick={handleSendForm} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDuplicationConfirmation}
        onClose={handleDuplicationCancel}
      >
        <DialogTitle>Confirm Duplication</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to duplicate this form?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDuplicationCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={duplicateFormAPI} color="primary">
            Duplicate
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={sendSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSendSnackbarOpen(false)}
        message={sendSnackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSendSnackbarOpen(false)} severity="success">
          Form has been Sent successfully!
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default FormTemplates;
