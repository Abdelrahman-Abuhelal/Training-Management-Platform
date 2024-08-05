import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  Box,
  TableRow,
  TableCell,
  Toolbar,
  TableBody,
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
import SearchComponent from "../../components/Search";
import DownloadIcon from "@mui/icons-material/Download";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { useAuth } from "../../provider/authProvider";
import { useMediaQuery, useTheme } from '@mui/material';

const HR_Supervisors_List = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [supervisors, setSupervisors] = useState([]);
  const [allSupervisors, setAllSupervisors] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredSupervisors = supervisors.filter((supervisor) =>
    (supervisor.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (branchFilter === "" || supervisor.userBranch === branchFilter)
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const deleteUser = async (userId) => {
  //   try {
  //     const response = await axios.delete(
  //       `${baseUrl}/api/v1/admin/users/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${login_token}`
  //       }
  //     }
  //     );
  //     if (response.status === 200) {
  //       console.log("Supervisor deleted successfully");
  //       setSupervisors(supervisors.filter((user) => user.userId !== userId));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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


  const handleBranchFilterChange = (event) => {
    setBranchFilter(event.target.value);
    setPage(0); // Reset page when branch filter changes
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
    <div style={{ padding: isMobile ? "0.5rem" : "3rem" }}>
      <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: theme.palette.background.paper, borderRadius: '1rem' }}>
        <Toolbar sx={{ flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'center' : 'normal', gap: isMobile ? 2 : 0 }}>
        <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
            <SearchComponent
              searchTerm={searchTerm} onSearchChange={handleSearchChange} />
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
          </Grid>

        </Toolbar>
      </Paper>
      <Paper elevation={3} sx={{ p: '2rem', backgroundColor: theme.palette.background.paper, borderRadius: '1rem', marginTop: '1.5rem' }}>
        <Typography
          className="concert-one-regular" variant='inherit'
          gutterBottom
          align="center"
          sx={{ fontSize: "1.7rem", mt: 2, ml: 1, color: theme.palette.primary.dark }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <PeopleOutlineIcon fontSize="large" />
            &nbsp; Active Supervisors
          </Box>
        </Typography>
        <TableContainer component={Paper} sx={{ mt:'2rem', p: '1rem',backgroundColor:'#fff',borderRadius:'0.5rem' }}>
          <Table aria-label="supervisor table" >
            <TableHead>
              <TableRow>

                <TableCell>
                  <Typography variant="subtitle2" >
                    Full Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" >
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" >
                    Branch
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography align="center" variant="subtitle2" >
                    Related Trainees
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {paginatedSupervisors.map((item) => (
                <TableRow key={item.userId} hover>
                  <TableCell>{item.userFirstName + " " + item.userLastName}</TableCell>
                  <TableCell>{item.userEmail}</TableCell>
                  <TableCell>
                    {item.userBranch}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() =>
                        navigate(`/supervisors/${item.userId}/trainees`)
                      }
                      color="primary"
                    >
                      View <GroupIcon fontSize="large"
                      />
                    </IconButton>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>



    </div>
  );
};

export default HR_Supervisors_List;
