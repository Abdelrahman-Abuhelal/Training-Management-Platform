import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonAppBar from "../../components/admin/NavBar";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
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
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";

const SupervisorsList = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [supervisors, setSupervisors] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
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
    fetchSupervisors();
  }, [userIdToDelete]);

  useEffect(() => {
    allSupervisorsInfo();
  }, []);

  const allSupervisorsInfo = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/supervisors`);
      if (response.status === 200) {
        setAllSupervisors(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleView = (user) => {
    navigate(`/edit-supervisor/${user.userId}`);
  };

  const handleDelete = (user) => {
    setUserIdToDelete(user.userId); 
    setUsernameToDelete(user.userUsername); 
    setOpenDeleteDialog(true); 
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserIdToDelete(null); 
    setUsernameToDelete("");
  };

  const handleConfirmDelete = () => {
    if (userIdToDelete) {
      deleteUser(userIdToDelete); 
      setOpenDeleteDialog(false); 
      setUserIdToDelete(null); 
      setUsernameToDelete(""); 
    } else {
      console.error("User ID not available for deletion"); 
    }
  };

  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(allSupervisors);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "supervisorList" + fileExtension;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div>
      <div className="flex items-center justify-end">
      {/* <h1 className="text-base font-bold leading-7 text-gray-900">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Trainees List</h1> */}
      <IconButton  style={{ paddingRight: '20px' }} color="primary" onClick={exportToExcel}>
       <DownloadIcon />&nbsp;Export 
        </IconButton>
      </div>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell  variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Username
                </h3>
              </TableCell>
              <TableCell  variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  First Name
                </h3>
              </TableCell>
              <TableCell  variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Last Name
                </h3>
              </TableCell>
              <TableCell  variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Email
                </h3>
              </TableCell>
              <TableCell variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Role
                </h3>
              </TableCell>
              <TableCell variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Actions
                </h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supervisors.map((item) => (
              <TableRow key={item.userId} hover>
                <TableCell>{item.userUsername}</TableCell>
                <TableCell>{item.userFirstName}</TableCell>
                <TableCell>{item.userLastName}</TableCell>
                <TableCell>{item.userEmail}</TableCell>
                <TableCell>{item.userRole.charAt(0).toUpperCase() + item.userRole.slice(1).toLowerCase()}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleView(item)} color="primary">
                    <ManageAccountsIcon />View Profile
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(item)} color="error">
                     <DeleteIcon /> Delete User
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you want to delete '{usernameToDelete}'?
          </Typography>
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

export default SupervisorsList;
