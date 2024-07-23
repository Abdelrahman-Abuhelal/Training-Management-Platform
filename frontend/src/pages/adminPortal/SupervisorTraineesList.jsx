import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useParams } from "react-router-dom";
import { InputAdornment } from "@mui/material";

import {
  TableContainer,
  Table,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  TablePagination,
  IconButton,
  Grid,
  Box,
  Button,
  Checkbox,
  Paper,
  TableSortLabel,
} from "@mui/material"; // MUI components (or your preferred library)
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import SearchComponent from "../../components/Search";
import GroupIcon from "@mui/icons-material/Group";

const Supervisor_Trainees_List = () => {
  const { userId } = useParams();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [username, setUsername] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const navigate = useNavigate();

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
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/supervisor/${userId}/trainees`
      );
      if (response.status === 200) {
        const traineeUsers = response.data;
        setTrainees(traineeUsers);
      } else {
        console.error("Failed to fetch trainees. Status:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/users/${userId}`
      );
      if (response.status === 200) {
        const userData = response.data;
        setUsername(userData.userFirstName);
        setUserFullName(
          capitalizeFirstLetter(userData.userFirstName) + " " + capitalizeFirstLetter(userData.userLastName)
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  useEffect(() => {
    fetchTrainees();
  }, [page, rowsPerPage, searchTerm]);

  const handleView = (user) => {
    navigate(`/review-form/${user.userId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setOrderBy(property);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const sortedTrainees = trainees.sort((a, b) => {
    const isAsc = sortDirection === "asc";
    if (orderBy === "userUsername") {
      return isAsc
        ? a.userUsername.localeCompare(b.userUsername)
        : b.userUsername.localeCompare(a.userUsername);
    }
    // Add additional sorting logic for other properties if needed
    return 0;
  });

  return (
    <div style={{ padding: "3rem" }}>
      <Paper sx={{ p:'1rem',  backgroundColor:'#F5F7F8' }}>

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        marginBottom="1rem"
      >
        <Grid item>
          <IconButton
            color="primary"
            onClick={() => {
              navigate(`/supervisors/`);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Typography className="concert-one-regular" variant='inherit' component="h2" gutterBottom>
            {userFullName}'s Trainees <GroupIcon fontSize="large"/>
          </Typography>
        </Grid>
        <Grid item>
          <SearchComponent searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{mt:'2rem' , p:'1rem'}}>
        <Table aria-label="trainee table">
          <TableHead>
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
                <TableSortLabel
                  active={orderBy === "userUsername"}
                  direction={sortDirection}
                  onClick={(e) => handleRequestSort(e, "userUsername")}
                >
                  <Typography variant="h6">Username</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Typography variant="h6">First Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Last Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Email</Typography>
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
                <TableCell>{item.userUsername}</TableCell>
                <TableCell>{item.userFirstName}</TableCell>
                <TableCell>{item.userLastName}</TableCell>
                <TableCell>{item.userEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTrainees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default Supervisor_Trainees_List;
