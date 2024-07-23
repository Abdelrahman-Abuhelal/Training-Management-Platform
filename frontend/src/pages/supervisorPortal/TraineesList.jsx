import React, { useState, useEffect } from "react";
import axios from "axios";
import ReviewsIcon from "@mui/icons-material/Reviews";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Checkbox,
  Button,
  TableSortLabel,
} from "@mui/material"; // MUI components (or your preferred library)
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "../../provider/authProvider";
import SearchComponent from "../../components/Search";
import BreadcrumbsComponent from "../../components/BreadCrumbs";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid component
import GroupIcon from '@mui/icons-material/Group';
const Supervisor_Trainees_List = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/supervisor/my-trainees`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
        },
      });
      if (response.status === 200) {
        const traineeUsers = response.data.map((trainee) => ({
          ...trainee,
          id: trainee.userId, // Assigning userId as the id
        }));
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, [searchTerm]); // Removed page and rowsPerPage from useEffect dependencies

  const handleViewReview = (user) => {
    navigate(`/review-form/${user.userId}`);
  };

  const handleViewProfile = (user) => {
    navigate(`/view-trainee/${user.userId}`);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setOrderBy(property);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const handleCheckboxChange = (e, item) => {
    const { checked } = e.target;
    setSelectedTrainees((prevSelected) => {
      if (checked) {
        return [...prevSelected, item];
      } else {
        return prevSelected.filter((trainee) => trainee.userId !== item.userId);
      }
    });
  };

  const columns = [
    {
      field: "userUsername",
      headerName: "Username",
      flex: 1,
      sortDirection,
      sortable: true,
      renderCell: (params) => (
        <Button color="primary" onClick={() => handleViewProfile(params.row)}>
          {params.value}
        </Button>
      ),
    },
    { field: "userFirstName", headerName: "First Name", flex: 1 },
    { field: "userLastName", headerName: "Last Name", flex: 1 },
    { field: "userEmail", headerName: "Email", flex: 1 },
    { field: "userRole", headerName: "Role", flex: 1 },
  ];

  const getRowId = (row) => row.id; // Function to get the id for each row
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: "3%", m: "3%", width: "75%", maxWidth: 1800, backgroundColor: '#F5F7F8' }}>
        <Grid container alignItems="center">
          <Grid item xs={isMobile ? 6 : 3} style={{ textAlign: "left" }}>
            <SearchComponent searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </Grid>
          <Grid item xs={6}>
            <Typography className="concert-one-regular" variant='inherit' component="h2" align="center">
              My Trainees <GroupIcon/>
            </Typography>
          </Grid>
          <Grid item xs={isMobile ? 0 : 3} />
        </Grid>

        <Box sx={{ mt: "1rem", height: 400, width: "100%", backgroundColor: '#fff' }}>
          <DataGrid
            rows={trainees}
            columns={columns}
            sortingOrder={[orderBy]}
            sortModel={[
              {
                field: orderBy,
                sort: sortDirection,
              },
            ]}
            onSelectionModelChange={(selection) => {
              const selectedRows = selection.selectionModel.map(
                (index) => trainees[index]
              );
              setSelectedTrainees(selectedRows);
            }}
            getRowId={getRowId} // Specify the function to get row ids
          />
        </Box>
      </Paper>

    </div>
  );
};

export default Supervisor_Trainees_List;
