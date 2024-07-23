import React, { useState, useEffect } from "react";
import axios from "axios";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  TableContainer,
  Table,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TableSortLabel,
  TablePagination,
  Paper,
  IconButton,
  Dialog,
  ListItemText,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControl,
  Grid,
  FormGroup,
  Box,
  FormControlLabel,
  ListItem,
  ListItemAvatar,
  Avatar,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchComponent from "../../components/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { useAuth } from "../../provider/authProvider";
import { useMediaQuery, useTheme } from '@mui/material';

const TraineesList = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [trainees, setTrainees] = useState([]);
  const [traineesDetails, setTraineesDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [orderBy, setOrderBy] = useState("userUsername"); // Default sort order
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction
  const [page, setPage] = useState(0); // Current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [usernameToDelete, setUsernameToDelete] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTrainees, setSelectedTrainees] = useState([]); // State to hold selected trainees
  const [selectedSupervisors, setSelectedSupervisors] = useState([]); // State to hold selected supervisors
  const [supervisors, setSupervisors] = useState([]); // State to hold all supervisors
  const [openAssignDialog, setOpenAssignDialog] = useState(false); // Dialog state
  const navigate = useNavigate();
  const headerTextStyle = { fontSize: '1.1rem', fontWeight: 'bold' }; // Header text style
  const bodyTextStyle = { fontSize: '0.9rem' }; // Body text style
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredTrainees = trainees.filter((trainee) =>
    trainee.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainee.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainee.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainee.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTrainees = filteredTrainees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        console.log("Trainee deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRequestSort = (event, newOrderBy) => {
    setOrderBy(newOrderBy);
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 1 when rows per page changes
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleCheckboxChange = (event, trainee) => {
    if (event.target.checked) {
      setSelectedTrainees((prevSelected) => [...prevSelected, trainee]);
    } else {
      setSelectedTrainees((prevSelected) =>
        prevSelected.filter((item) => item.userId !== trainee.userId)
      );
    }
  };

  const handleAssignToSupervisor = async () => {
    if (selectedTrainees.length === 1) {
      const traineeId = selectedTrainees[0].userId;
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/admin/supervisorsUserIds/${traineeId}`, {
          headers: {
            Authorization: `Bearer ${login_token}`
          }
        }
        );
        if (response.status === 200) {
          const supervisorUserIds = response.data;
          setSelectedSupervisors(
            supervisors.filter((supervisor) =>
              supervisorUserIds.includes(supervisor.userId)
            )
          );
          setOpenAssignDialog(true);
        } else {
          console.error("Failed to fetch supervisors");
        }
      } catch (error) {
        console.error("Error fetching supervisors:", error);
      }
    }
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const preprocessTraineeDetails = (data) => {
    return data.map((trainee) => {
      const { copyOfId, ...rest } = trainee;
      return {
        ID: rest.id,
        "Full Name (Arabic)": rest.fullNameInArabic,
        "Phone Number": rest.phoneNumber,
        "ID Type": rest.idType,
        "ID Number": rest.idNumber,
        City: rest.city,
        Address: rest.address,
        "University Name": rest.universityName,
        "University Major": rest.universityMajor,
        "Expected Graduation Date": rest.expectedGraduationDate,
        "Training Field": rest.trainingField,
        "Branch Location": rest.branchLocation,
      };
    });
  };

  const handleAssignConfirm = async () => {
    try {
      const traineeIds = selectedTrainees.map((user) => user.userId);
      const supervisorIds = selectedSupervisors.map(
        (supervisor) => supervisor.userId
      );

      const response = await axios.put(
        `${baseUrl}/api/v1/admin/assign-trainees`,
        {
          traineeIds,
          supervisorIds,
        }, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );

      if (response.status === 200) {
        console.log("Trainees assigned successfully");
        // Refresh the list of trainees after assignment
        fetchTrainees();
        setOpenAssignDialog(false);
        setSelectedTrainees([]);
        setSelectedSupervisors([]);
      } else {
        console.error("Failed to assign trainees");
      }
    } catch (error) {
      console.error("Error assigning trainees:", error);
    }
  };

  const handleSupervisorCheckboxChange = (event, supervisor) => {
    if (event.target.checked) {
      setSelectedSupervisors((prevSelected) => [...prevSelected, supervisor]);
    } else {
      setSelectedSupervisors((prevSelected) =>
        prevSelected.filter((item) => item.userId !== supervisor.userId)
      );
    }
  };

  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(traineesDetails);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TraineesDetails" + fileExtension;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
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
  useEffect(() => {
    fetchTrainees();
  }, [userIdToDelete]);

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
  useEffect(() => {
    fetchSupervisors();
  }, [openAssignDialog]); // Trigger fetch when dialog opens

  const fetchTraineesDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/trainees`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      if (response.status === 200) {
        const processedData = preprocessTraineeDetails(response.data);
        setTraineesDetails(processedData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTraineesDetails();
  }, [userIdToDelete]);




  return (
    <div style={{ padding: isMobile ? "0.5rem" : "3rem" }}>

      <Paper sx={{ padding: isMobile ? '3px' : '16px' ,  backgroundColor:'#F5F7F8'}}>

        <div>
          <Grid container spacing={2} alignItems="center" >
            <Grid item xs={12} md={6}>
              <Box sx={{ width: '100%' }}>
                <SearchComponent
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={exportToExcel}
                sx={{
                  fontSize: isMobile ? "0.55rem" : "1.0rem",
                  maxWidth: isMobile ? "8rem" : "12rem"
                }}
              >
                Export As Excel
              </Button>
            </Grid>
            <Grid item xs={12} md={3} >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignToSupervisor}
                disabled={selectedTrainees.length !== 1}
                sx={{
                  fontSize: isMobile ? "0.55rem" : "1.0rem",
                  marginTop: isMobile ? '8px' : '0',
                  maxWidth: isMobile ? "8rem" : "12rem"
                }}
              >
                Assign to Supervisor
              </Button>
            </Grid>
          </Grid>
        </div>
      </Paper>
      <Paper sx={{  pt:'1rem' ,  backgroundColor:'#F5F7F8', p:'2rem'}}>
        <Typography
          className="concert-one-regular" variant='inherit' 
          gutterBottom
          align="center"
          sx={{ fontSize: "1.7rem", mt: 2, ml: 1 }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <PeopleOutlineIcon fontSize="large" />
            &nbsp; Active Trainees
          </Box>
        </Typography>
        <TableContainer component={Paper} sx={{mt:'2rem'}}>
          <Table aria-label="trainee table">
            <TableHead sx={{ borderBottom: "1px solid #ccc" }}>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedTrainees.length === paginatedTrainees.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTrainees(paginatedTrainees);
                      } else {
                        setSelectedTrainees([]);
                      }
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography sx={headerTextStyle}>Full Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={headerTextStyle}>Email</Typography>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "userUsername"}
                    direction={sortDirection}
                    onClick={(event) => handleRequestSort(event, "userUsername")}
                  >
                    <Typography sx={headerTextStyle}>Username</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography sx={headerTextStyle}>Role</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={headerTextStyle}>Profile</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography sx={headerTextStyle}>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTrainees.map((item) => (
                <TableRow key={item.userId} hover>
                  <TableCell>
                    <Checkbox
                      checked={selectedTrainees.some(
                        (trainee) => trainee.userId === item.userId
                      )}
                      onChange={(e) => handleCheckboxChange(e, item)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={bodyTextStyle}>{item.userFirstName + " " + item.userLastName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={bodyTextStyle}>{item.userEmail}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={bodyTextStyle}>{item.userUsername}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={bodyTextStyle}>
                      {item.userRole.charAt(0).toUpperCase() + item.userRole.slice(1).toLowerCase()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => navigate(`/edit-trainee/${item.userId}`)}
                      color="primary"
                    >
                      <ManageAccountsIcon fontSize="large" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDelete(item)}
                      color="secondary"
                    >
                      <DeleteIcon fontSize="medium" />
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
        count={filteredTrainees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />



      {/* Delete Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog}>
        <DialogTitle>Assign Supervisors</DialogTitle>
        <DialogContent dividers>
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormGroup>
                  {supervisors.map((supervisor) => (
                    <ListItem
                      key={supervisor.userId}
                      disablePadding
                      dense
                      button
                      onClick={(e) =>
                        handleSupervisorCheckboxChange(e, supervisor)}
                    >
                      <ListItemAvatar>
                        <Avatar>{supervisor.userUsername.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={supervisor.userUsername} />
                      <Checkbox
                        edge="end"
                        checked={selectedSupervisors.some(
                          (item) => item.userId === supervisor.userId
                        )}
                        onChange={(e) =>
                          handleSupervisorCheckboxChange(e, supervisor)
                        }
                      />
                    </ListItem>
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button onClick={handleCloseAssignDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignConfirm}
            >
              Assign
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TraineesList;
