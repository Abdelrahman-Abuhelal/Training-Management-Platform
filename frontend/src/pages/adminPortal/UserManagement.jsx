import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, IconButton,
  TextField, Checkbox, TableSortLabel, Toolbar, Typography, MenuItem, FormControl, Select, Snackbar
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchComponent from '../../components/Search';
import { useAuth } from "../../provider/authProvider";
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiAlert from '@mui/material/Alert';

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
    userRole: '',
    userEnabled: false // Assuming new users are enabled by default
  });

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    axios.get(`${baseUrl}/api/v1/admin/users`, {
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
        });
    } else {
      axios.post(`${baseUrl}/api/v1/admin/users`, newUser)
        .then(response => {
          setUsers([...users, response.data]);
          setFilteredUsers([...filteredUsers, response.data]);
          handleClose();
          showSnackbar('User created successfully', 'success');
        })
        .catch(error => {
          console.error(error);
          showSnackbar('Failed to create user', 'error');
        });
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
      <Paper elevation={3} sx={{ p: 2, m: 3, width: "95%", maxWidth: 1800 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flex: '1 2 100%' }}>
            User Management
          </Typography>
          <SearchComponent sx={{ maxWidth: '350px', height: '36px' }}
            searchTerm={searchTerm} onSearchChange={handleSearch} />
          <Box style={{ marginLeft: '10px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              startIcon={<AddIcon />}
              sx={{ minWidth: '150px', height: '36px' }}
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userEmail}</TableCell>
                    <TableCell>{user.userFirstName}</TableCell>
                    <TableCell>{user.userLastName}</TableCell>
                    <TableCell>{user.userUsername}</TableCell>
                    <TableCell>{user.userRole}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={user.userEnabled}
                        onChange={handleChange}
                        name="userEnabled"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(user)} color="primary">
                        <EditIcon fontSize="medium" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.userId)} color="error">
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{currentUser ? "Edit User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="userEmail"
              label="Email"
              type="email"
              fullWidth
              value={currentUser ? currentUser.userEmail : newUser.userEmail}
              onChange={handleChange}
              disabled={!!currentUser}
            />
            <TextField
              margin="dense"
              name="userFirstName"
              label="First Name"
              fullWidth
              value={currentUser ? currentUser.userFirstName : newUser.userFirstName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="userLastName"
              label="Last Name"
              fullWidth
              value={currentUser ? currentUser.userLastName : newUser.userLastName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="userUsername"
              label="Username"
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
              <FormControl fullWidth margin="dense">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={currentUser ? currentUser.userEnabled : newUser.userEnabled}
                      onChange={handleChange}
                      name="userEnabled"
                      color="primary"
                    />
                  }
                  label="Enabled User"
                  labelPlacement="end"
                />
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this user?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                handleConfirmDelete(userToDelete);
                setDeleteDialogOpen(false);
              }}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>


        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={closeSnackbar}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

      </Paper>
    </div>
  );
};

export default UserManagement;
