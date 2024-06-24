import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Grid,
  InputAdornment,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TableSortLabel,
  TablePagination,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";

const HR_Supervisors_List = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [supervisors, setSupervisors] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const navigate = useNavigate();
  const [usernameToDelete, setUsernameToDelete] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [availableTrainees, setAvailableTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);

  const filteredSupervisors = supervisors.filter((supervisor) =>
    supervisor.userUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSupervisors = filteredSupervisors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleRequestSort = (event, newOrderBy) => {
    const isAsc = orderBy === newOrderBy && sortDirection === "asc";
    setOrderBy(newOrderBy);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/admin/users/${userId}`
      );
      if (response.status === 200) {
        console.log("Supervisor deleted successfully");
        setSupervisors(supervisors.filter((user) => user.userId !== userId));
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
        const sortedSupervisors = supervisorUsers.sort((a, b) => {
          const isAsc = sortDirection === "asc";
          if (orderBy === "userUsername") {
            return isAsc
              ? a.userUsername.localeCompare(b.userUsername)
              : b.userUsername.localeCompare(a.userUsername);
          }
          return 0;
        });
        setAllSupervisors(sortedSupervisors);
        setSupervisors(sortedSupervisors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, [userIdToDelete, sortDirection, orderBy]);

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/users`);
        if (response.status === 200) {
          const traineeUsers = response.data.filter(
            (item) => item.userRole === "TRAINEE"
          );
          setAvailableTrainees(traineeUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrainees();
  }, []);

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

  const handleTraineeSelect = (event) => {
    setSelectedTrainees(event.target.value);
  };

  const handleAssignConfirm = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/supervisor/${selectedSupervisor.userId}/assign`,
        {
          trainees: selectedTrainees,
        }
      );
      if (response.status === 200) {
        console.log("Trainees assigned successfully");
        fetchSupervisors();
        setSelectedSupervisor(null);
        setSelectedTrainees([]);
      }
    } catch (error) {
      console.log(error);
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
    <div style={{ padding: "5rem" }}>
      <Paper sx={{ border: "1px solid #ccc", mt: 2 }}>
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h5"
              component="h2"
              align="right"
              sx={{ fontWeight: "bold", mt: 3, ml: 1 }}
            >
              List of Supervisors
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder="Search username"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: "250px" }} // Adjust the maxWidth as needed
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table aria-label="supervisor table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "userUsername"}
                    direction={sortDirection}
                    onClick={(event) =>
                      handleRequestSort(event, "userUsername")
                    }
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Username
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    First Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Last Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Role
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSupervisors.map((item) => (
                <TableRow key={item.userId} hover>
                  <TableCell>{item.userUsername}</TableCell>
                  <TableCell>{item.userFirstName}</TableCell>
                  <TableCell>{item.userLastName}</TableCell>
                  <TableCell>{item.userEmail}</TableCell>
                  <TableCell>
                    {item.userRole.charAt(0).toUpperCase() +
                      item.userRole.slice(1).toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(`/supervisors/${item.userId}/trainees`)
                      }
                      color="primary"
                    >
                      <GroupIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        component="div"
        count={filteredSupervisors.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 1 }}
      />
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
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

      <Dialog
        open={!!selectedSupervisor}
        onClose={() => setSelectedSupervisor(null)}
      >
        <DialogTitle>Assign Trainees</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="trainee-select-label">Select Trainees</InputLabel>
            <Select
              labelId="trainee-select-label"
              id="trainee-select"
              multiple
              value={selectedTrainees}
              onChange={handleTraineeSelect}
              renderValue={(selected) => (
                <div>
                  {selected.map((trainee) => (
                    <Chip key={trainee.userId} label={trainee.userUsername} />
                  ))}
                </div>
              )}
            >
              {availableTrainees.map((trainee) => (
                <MenuItem key={trainee.userId} value={trainee}>
                  {trainee.userUsername}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSupervisor(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignConfirm}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HR_Supervisors_List;
