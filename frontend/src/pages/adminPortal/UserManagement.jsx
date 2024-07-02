import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Checkbox, FormControlLabel
} from '@mui/material';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const baseUrl = import.meta.env.VITE_PORT_URL;

  useEffect(() => {
    // Fetch users from API
    axios.get(`${baseUrl}/api/v1/admin/users`)  // Replace with your API endpoint
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSave = () => {
    // Save user details
    axios.put(`/api/users/${currentUser.userId}`, currentUser)  // Replace with your API endpoint
      .then(response => {
        setUsers(users.map(user => (user.userId === currentUser.userId ? currentUser : user)));
        handleClose();
      })
      .catch(error => console.error(error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentUser({ ...currentUser, [name]: checked });
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
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
                  <Button onClick={() => handleEdit(user)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="userEmail"
            label="Email"
            type="email"
            fullWidth
            value={currentUser?.userEmail || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userFirstName"
            label="First Name"
            fullWidth
            value={currentUser?.userFirstName || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userLastName"
            label="Last Name"
            fullWidth
            value={currentUser?.userLastName || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userUsername"
            label="Username"
            fullWidth
            value={currentUser?.userUsername || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="userRole"
            label="Role"
            fullWidth
            value={currentUser?.userRole || ''}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={currentUser?.userEnabled || false}
                onChange={handleCheckboxChange}
                name="userEnabled"
              />
            }
            label="Enabled"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;
