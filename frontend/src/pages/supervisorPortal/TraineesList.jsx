import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewsIcon from "@mui/icons-material/Reviews";
import {
  TableContainer,
  Table,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Checkbox, Box,
  Paper,
  Grid,
  Button,
  TableSortLabel,
} from "@mui/material"; // MUI components (or your preferred library)
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../provider/authProvider";
import SearchComponent from "../../components/Search";
import BreadcrumbsComponent from "../../components/BreadCrumbs";
const Supervisor_Trainees_List = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const navigate = useNavigate();
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

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/supervisor/my-trainees`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        const traineeUsers = response.data;
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, [page, rowsPerPage, searchTerm]);

  const handleViewReview = (user) => {
    navigate(`/review-form/${user.userId}`);
  };
  const handleViewProfile = (user) => {
    navigate(`/view-trainee/${user.userId}`);
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
    <div style={{ padding:isMobile?"1rem" : "3rem" }}>
      <Grid container alignItems="center">
        <Grid item xs={isMobile?6:3} style={{ textAlign: 'left' }}>
          <SearchComponent searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        </Grid>

        <Grid item xs={6} >
          <Typography variant="h5" component="h2" align="center">
            My Trainees <GroupsIcon style={{ fontSize: '30px' }} />
          </Typography>
        </Grid>

        <Grid item xs={isMobile?0:3} />

      </Grid>



      <TableContainer component={Paper}>
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
              <TableCell>
                <Typography variant="h6">Role</Typography>
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
                  <Button color="primary" onClick={() => handleViewProfile(item)}>
                    {item.userUsername}
                  </Button>
                </TableCell>
                <TableCell>{item.userFirstName}</TableCell>
                <TableCell>{item.userLastName}</TableCell>
                <TableCell>{item.userEmail}</TableCell>
                <TableCell>{item.userRole}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
