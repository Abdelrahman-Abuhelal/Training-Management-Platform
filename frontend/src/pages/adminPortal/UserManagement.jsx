import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, IconButton,
  TextField, Checkbox, TableSortLabel, Toolbar, Typography, MenuItem, FormControl, Select, Snackbar, CircularProgress
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from '../../components/Search';
import { useAuth } from "../../provider/authProvider";
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const UserManagement = () => {
  const { user } = useAuth();
  const { login_token } = user;
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('userEmail');
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    userUsername: '',
    userRole: ''
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for save button

  useEffect(() => {
    axios.get(`${baseUrl}/api/v1/admin/all-users`, {
      headers: {
        Authorization: `Bearer ${login_token}`
      }
    }).then(response => {
      setUsers(response.data);
      setFilteredUsers(response.data);
    })
      .catch(error => console.error(error));
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (userId) => {
    axios.delete(`${baseUrl}/api/v1/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${login_token}`
      }
    })
      .then(() => {
        setUsers(users.filter(user => user.userId !== userId));
        setFilteredUsers(filteredUsers.filter(user => user.userId !== userId));
        showSnackbar('User deleted successfully', 'success');
      })
      .catch(error => {
        console.error(error);
        showSnackbar('Failed to delete user', 'error');
      });
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSave = () => {
    setLoading(true);
    if (currentUser) {
      axios.put(`${baseUrl}/api/v1/admin/users/${currentUser.userId}`, currentUser, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      })
        .then(response => {
          const updatedUser = response.data;
          setUsers(users.map(user => (user.userId === currentUser.userId ? updatedUser : user)));
          setFilteredUsers(filteredUsers.map(user => (user.userId === currentUser.userId ? updatedUser : user)));
          handleClose();
          showSnackbar('User updated successfully', 'success');
        })
        .catch(error => {
          console.error(error);
          showSnackbar('Failed to update user', 'error');
        })
        .finally(() => setLoading(false));
    } else {
      axios.post(`${baseUrl}/api/v1/admin/create-user`, newUser, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      })
        .then(response => {
          if (response.status === 200) {
            setUsers([...users, response.data]);
            setFilteredUsers([...filteredUsers, response.data]);
            handleClose();
            showSnackbar('Email verification sent to the user', 'success');
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 400) {
            const validationErrors = error.response.data.detailMessageArguments;
            showSnackbar(`Validation error: ${validationErrors.join(', ')}`, 'error');
          } else if (error.response && error.response.status === 409) {
            showSnackbar('User with this email or username exists already!', 'error');
          } else {
            showSnackbar('Failed to create user', 'error');
          }
        })
        .finally(() => setLoading(false)); // Set loading to false when request is done
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (currentUser) {
      setCurrentUser({ ...currentUser, [name]: type === 'checkbox' ? checked : value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const term = e.target.value.toLowerCase();
    setFilteredUsers(users.filter(user =>
      user.userEmail.toLowerCase().includes(term) ||
      user.userFirstName.toLowerCase().includes(term) ||
      user.userLastName.toLowerCase().includes(term) ||
      user.userUsername.toLowerCase().includes(term) ||
      String(user.userEnabled).toLowerCase().includes(term)
    ));
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[property] < b[property]) return order === 'asc' ? -1 : 1;
      if (a[property] > b[property]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 3, m: 3, width: "90%", maxWidth: 1800,  backgroundColor:'#f8f5f5' }}>
      <Toolbar sx={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ?'center': 'normal', gap: isMobile ? 2 : 0 }}>
      <Typography className="concert-one-regular" variant='inherit' component="div" sx={{ flex: isMobile ? '1 1 100%' : '1 2 100%', textAlign: isMobile ? 'center' : 'left' }}>
            User Management
          </Typography>
          <SearchComponent
            searchTerm={searchTerm} onSearchChange={handleSearch} />
          <Box style={{ marginLeft: isMobile ? 0 : '10px', marginBottom: isMobile ? '10px' : 0 }}>
          <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              startIcon={<AddIcon />}
              sx={{ minWidth: '150px', minHeight: '40px' }}
            >
              New User
            </Button>
          </Box>
        </Toolbar>
        <Paper sx={{ border: "1px solid #ccc", p: "1rem" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userEmail'}
                      direction={orderBy === 'userEmail' ? order : 'asc'}
                      onClick={() => handleSort('userEmail')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userFirstName'}
                      direction={orderBy === 'userFirstName' ? order : 'asc'}
                      onClick={() => handleSort('userFirstName')}
                    >
                      First Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userLastName'}
                      direction={orderBy === 'userLastName' ? order : 'asc'}
                      onClick={() => handleSort('userLastName')}
                    >
                      Last Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userUsername'}
                      direction={orderBy === 'userUsername' ? order : 'asc'}
                      onClick={() => handleSort('userUsername')}
                    >
                      Username
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userRole'}
                      direction={orderBy === 'userRole' ? order : 'asc'}
                      onClick={() => handleSort('userRole')}
                    >
                      Role
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userEnabled'}
                      direction={orderBy === 'userEnabled' ? order : 'asc'}
                      onClick={() => handleSort('userEnabled')}
                    >
                      Enabled
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'userVerified'}
                      direction={orderBy === 'userVerified' ? order : 'asc'}
                      onClick={() => handleSort('userVerified')}
                    >
                      Verified
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userEmail}</TableCell>
                    <TableCell>{user.userFirstName}</TableCell>
                    <TableCell>{user.userLastName}</TableCell>
                    <TableCell>{user.userUsername}</TableCell>
                    <TableCell>{user.userRole}</TableCell>
                    <TableCell>
                      <Checkbox checked={user.userEnabled} disabled />
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={user.userVerified} disabled />
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDelete(user.userId)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{currentUser ? 'Edit User' :  'Add New User' }  </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="userEmail"
            label="Email"
            type="email"
            fullWidth
            value={currentUser ? currentUser.userEmail : newUser.userEmail}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userFirstName"
            label="First Name"
            type="text"
            fullWidth
            value={currentUser ? currentUser.userFirstName : newUser.userFirstName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userLastName"
            label="Last Name"
            type="text"
            fullWidth
            value={currentUser ? currentUser.userLastName : newUser.userLastName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userUsername"
            label="Username"
            type="text"
            fullWidth
            value={currentUser ? currentUser.userUsername : newUser.userUsername}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <Select
              name="userRole"
              value={currentUser ? currentUser.userRole : newUser.userRole}
              onChange={handleChange}
              displayEmpty
              disabled={!!currentUser}
            >
              <MenuItem value="" disabled>
                Select Role
              </MenuItem>
              <MenuItem value="TRAINEE">Trainee</MenuItem>
              <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
              <MenuItem value="SUPER_ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
          {currentUser && (
            <FormControlLabel
              control={
                <Checkbox
                  name="userEnabled"
                  checked={currentUser ? currentUser.userEnabled : null}
                  onChange={handleChange}
                />
              }
              label="Enabled"
            />)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button
            onClick={() => {
              handleConfirmDelete(userToDelete);
              setDeleteDialogOpen(false);
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={closeSnackbar}>
        <MuiAlert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserManagement;
