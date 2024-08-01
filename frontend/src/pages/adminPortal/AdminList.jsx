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

const HR_Superadmin_List = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [superadmins, setSuperAdmins] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [allSuperadmins, setAllSuperadmin] = useState([]);
  const navigate = useNavigate();
  const [usernameToDelete, setUsernameToDelete] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSuperadmin, setSelectedSuperadmin] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredSuperadmins = superadmins.filter((superadmin) =>
    (superadmin.userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
    superadmin.userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    superadmin.userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    superadmin.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))&&
    (branchFilter === "" || superadmin.userBranch === branchFilter)
  );


  const paginatedSupervisors = filteredSuperadmins.slice(
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

  const handleBranchFilterChange = (event) => {
    setBranchFilter(event.target.value);
    setPage(0); 
  };


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
        console.log("Super Admin deleted successfully");
        setSuperAdmins(superadmins.filter((user) => user.userId !== userId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/users`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      if (response.status === 200) {
        const superadminUsers = response.data.filter(
          (item) => item.userRole === "SUPER_ADMIN"
        );
        const sortedSuperadmins = superadminUsers.sort((a, b) => {
          const isAsc = sortDirection === "asc";
          if (orderBy === "userUsername") {
            return isAsc
              ? a.userUsername.localeCompare(b.userUsername)
              : b.userUsername.localeCompare(a.userUsername);
          }
          return 0;
        });
        setAllSuperadmin(sortedSuperadmins);
        setSuperAdmins(sortedSuperadmins);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [userIdToDelete, sortDirection, orderBy]);



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




  return (
    <div style={{ padding: isMobile ? "0.5rem" : "3rem" }}>
      <Paper sx={{ padding: '2rem', backgroundColor: '#E1EBEE', borderRadius: '1rem', alignItems: 'right' }}>
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
      <Paper sx={{ p: '1rem', backgroundColor: '#E1EBEE', borderRadius: '1rem', marginTop: '1.5rem' }}>
      <Typography
          className="concert-one-regular" variant='inherit'
          gutterBottom
          align="center"
          sx={{ fontSize: "1.7rem", mt: 2, ml: 1, color: theme.palette.primary.main }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <PeopleOutlineIcon fontSize="large" />
            &nbsp; Active Admins
          </Box>
        </Typography>
        <TableContainer component={Paper} sx={{ mt: '1rem', p: '1rem' }}>
          <Table aria-label="supervisor table" >
            <TableHead>
              <TableRow>

                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Full Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Username
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Branch
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              {paginatedSupervisors.map((item) => (
                <TableRow key={item.userId} hover>
                  <TableCell>{item.userFirstName + " " + item.userLastName}</TableCell>
                  <TableCell>{item.userEmail}</TableCell>
                  <TableCell>{item.userUsername}</TableCell>
                  <TableCell>{item.userBranch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        component="div"
        count={filteredSuperadmins.length}
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


    </div>
  );
};

export default HR_Superadmin_List;
