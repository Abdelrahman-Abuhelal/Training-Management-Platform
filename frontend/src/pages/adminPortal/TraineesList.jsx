import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonAppBar from "../../components/admin/NavBar";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, 

} from "@mui/material"; // MUI components (or your preferred library)
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const traineesList = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [usernameToDelete, setUsernameToDelete] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/admin/users/${userId}`
      );
      if (response.status === 200) {
        console.log("Trainee deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/users`);
        if (response.status === 200) {
          const traineeUsers = response.data.filter(
            (item) => item.userRole === "TRAINEE"
          );
          setUsers(traineeUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrainees();
  }, [userIdToDelete]);

  const handleView = (user) => {
    // Implement your view functionality here, e.g., navigate to a view page
    navigate(`/edit-trainee/${user.userId}`);
  };

  const handleDelete = (user) => {
    setUserIdToDelete(user.userId); // Store the user ID for deletion
    setUsernameToDelete(user.userUsername); // Store the username for display
    setOpenDeleteDialog(true); // Open the confirmation dialog
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserIdToDelete(null); // Clear the stored user ID
    setUsernameToDelete(""); // Clear the stored username
  };

  const handleConfirmDelete = () => {
    if (userIdToDelete) {
      // Ensure user ID is available before deleting
      deleteUser(userIdToDelete); // Call the API to delete the user
      setOpenDeleteDialog(false); // Close the dialog after deletion
      setUserIdToDelete(null); // Clear the stored user ID
      setUsernameToDelete(""); // Clear the stored username
    } else {
      console.error("User ID not available for deletion"); // Log an error for debugging
    }
  };
  return (
    <div>
      <ButtonAppBar />

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Email
                </h3>
              </TableCell>
              <TableCell>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Username
                </h3>
              </TableCell>
              <TableCell>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  First Name
                </h3>
              </TableCell>
              <TableCell>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Last Name
                </h3>
              </TableCell>
              <TableCell>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Role
                </h3>
              </TableCell>
              <TableCell>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Actions
                </h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.userId} hover>
                <TableCell>{item.userEmail}</TableCell>
                <TableCell>{item.userUsername}</TableCell>
                <TableCell>{item.userFirstName}</TableCell>
                <TableCell>{item.userLastName}</TableCell>
                <TableCell>{item.userRole.toLowerCase()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(item)} color="primary">
                    <ManageAccountsIcon /> {/* Replace with your desired edit icon */}
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item)} color="error">
                    <DeleteIcon /> {/* Replace with your desired delete icon */}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button variant="contained" color="primary">
    
        </Button>
      </div>
      {/* Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you want to delete '{usernameToDelete}'?
          </Typography>
          {/* Optional: Display additional details about the user being deleted */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default traineesList;
