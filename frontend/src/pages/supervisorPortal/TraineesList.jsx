import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
} from "@mui/material"; // MUI components (or your preferred library)
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "../../provider/authProvider";
import SearchComponent from "../../components/Search";
import GroupIcon from '@mui/icons-material/Group';
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid component
import StarRateIcon from '@mui/icons-material/StarRate';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTheme } from '@mui/material';

const Supervisor_Trainees_List = () => {
  const theme = useTheme();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const navigate = useNavigate();
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
          fullName: `${trainee.userFirstName} ${trainee.userLastName}` // Merging first name and last name
        }));
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, [searchTerm]);

  const handleViewProfile = (user) => {
    navigate(`/view-trainee/${user.userId}`);
  };

  const handleAddSkills = (user) => {
    navigate(`/add-skills/${user.userId}`);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setOrderBy(property);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Profile Name",
      flex: 1,
      minWidth: 200, // Adjust this width as needed
      renderCell: (params) => (
          <Button
            color="primary"
            variant="contained"
            startIcon={<AccountBoxIcon />}
            onClick={() => handleViewProfile(params.row)}
            sx={{ ml: 1, minWidth:'150px' }} // Adds margin to the left
          >
          <span>{params.value}</span> {/* Display the full name */}
          </Button>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          display="flex"
          flexDirection="row" 
          gap={1}
        >
          <Button
            color="primary"
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => handleAddSkills(params.row)}
            sx={{mt:'0.5rem'}}
            >
            Add Experience
          </Button>
        </Box>
      ),
    },
    { field: "userEmail", headerName: "Email", flex: 1 },

  ];

  const getRowId = (row) => row.id; // Function to get the id for each row

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: "3%", m: "3%", width: "75%", maxWidth: 1800, backgroundColor: theme.palette.background.paper,borderRadius:'0.5rem' }}>
        <Grid container alignItems="center">
          <Grid item xs={isMobile ? 6 : 3}  style={{ textAlign: "left" }}>
            <SearchComponent searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </Grid>
          <Grid item xs={6}>
            <Typography className="concert-one-regular" sx={{ color: theme.palette.primary.dark}} align="center">
              My Trainees  <GroupIcon fontSize="large" />
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
            sx={{borderRadius:'1rem'}}
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
