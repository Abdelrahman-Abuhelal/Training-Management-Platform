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
  Select,
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
   DialogContentText 
} from "@mui/material";
import SearchComponent from "../../components/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { useAuth } from "../../provider/authProvider";
import { useMediaQuery, useTheme } from '@mui/material';
import DownloadIcon from "@mui/icons-material/Download";

const TraineesList = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [trainees, setTrainees] = useState([]);
  const [traineesDetails, setTraineesDetails] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const navigate = useNavigate();
  const bodyTextStyle = { fontSize: '0.9rem' };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredTrainees = trainees.filter((trainee) =>
    (trainee.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (branchFilter === "" || trainee.userBranch === branchFilter)
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



  const handleBranchFilterChange = (event) => {
    setBranchFilter(event.target.value);
    setPage(0); // Reset page when branch filter changes
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
    setSelectedTrainees([]);
    setSelectedSupervisors([]);
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
        "Training Year": rest.trainingYear,
        "Training Season": rest.trainingSeason,
        "Start Training Date": rest.startTrainingDate,
        "End Training Date": rest.endTrainingDate,
        "Bugzella URL": rest.bugzillaURL,
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
      setSelectedSupervisors([supervisor]);
    } else {
      setSelectedSupervisors([]);
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
      const response = await axios.get(`${baseUrl}/api/v1/admin/trainees-info`, {
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
    <div style={{ padding: isMobile ? "0.5rem" : "4rem" }}>

      <Paper elevation={3} sx={{ padding: isMobile ? '3px' : '2rem', backgroundColor: theme.palette.background.paper, borderRadius: '1rem' }}>
        <div>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ width: '100%' }}>
                <SearchComponent
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl variant="outlined" fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '24px', backgroundColor: '#fff'
                }
              }}>
                <Select
                  value={branchFilter}
                  onChange={handleBranchFilterChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Branch Filter' }}
                >
                  <MenuItem value="">
                    <em>All Branches</em>
                  </MenuItem>
                  {/* Add other branches as needed */}
                  <MenuItem value="RAMALLAH">Ramallah</MenuItem>
                  <MenuItem value="NABLUS">Nablus</MenuItem>
                  <MenuItem value="BETHLEHEM">Bethlehem</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={exportToExcel}
                sx={{
                  fontSize: isMobile ? "0.55rem" : "1.0rem",
                  maxWidth: isMobile ? "8rem" : "12rem",
                  marginRight: isMobile ? '8px' : '16px'
                }}
              >
                Export As Excel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignToSupervisor}
                disabled={selectedTrainees.length !== 1}
                sx={{
                  fontSize: isMobile ? "0.55rem" : "1.0rem",
                  maxWidth: isMobile ? "8rem" : "12rem"
                }}
              >
                Assign to Supervisor
              </Button>
            </Grid>
          </Grid>
        </div>
      </Paper>


      <Paper elevation={3} sx={{ pt: '1rem', backgroundColor: theme.palette.background.paper, p: '2rem', borderRadius: '1rem', marginTop: '1.5rem' }}>
        <Typography
          className="concert-one-regular" variant='inherit'
          gutterBottom
          align="center"
          sx={{color: theme.palette.primary.dark }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <PeopleOutlineIcon fontSize="large" />
            &nbsp; Active Trainees
          </Box>
        </Typography>
        <TableContainer component={Paper} sx={{ mt: '2rem' ,backgroundColor:'#fff'}}>
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
                  <Typography variant="subtitle2">Profile</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Full Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">Email</Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="subtitle2">Branch</Typography>
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
                  <TableCell >
                    <IconButton
                      onClick={() => navigate(`/edit-trainee/${item.userId}`)}
                      color="primary"
                    >
                      <ManageAccountsIcon fontSize="large" /><Typography sx={bodyTextStyle}>{item.userUsername}</Typography>
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography sx={bodyTextStyle}>{item.userFirstName + " " + item.userLastName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={bodyTextStyle}>{item.userEmail}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={bodyTextStyle}>
                      {item.userBranch}
                    </Typography>
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



      <Dialog
        open={openAssignDialog}
        onClose={handleCloseAssignDialog}
        PaperProps={{
          style: { width: '600px' }, // Adjust width as needed
        }}
      >
        <DialogTitle>Assign Supervisor</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Please select a supervisor for the selected trainee.
          </DialogContentText>
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
                        handleSupervisorCheckboxChange(e, supervisor)
                      }
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
              disabled={selectedSupervisors.length === 0} // Ensure a supervisor is selected
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
