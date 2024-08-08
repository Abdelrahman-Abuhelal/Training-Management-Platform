import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  InputLabel,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TaskIcon from '@mui/icons-material/Task';
import { useAuth } from "../../provider/authProvider";
import { useMediaQuery, useTheme } from '@mui/material';

const AssignTask = () => {
  const theme = useTheme();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const APIkey = import.meta.env.VITE_GOOGLE_AI_KEY;
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [priorityStatus, setPriorityStatus] = useState(""); // New state for task status
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [resources, setResources] = useState("");
  const { user } = useAuth();
  const { login_token } = user;
  const genAI = new GoogleGenerativeAI(APIkey);
  const navigate  = useNavigate();

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/supervisor/my-trainees`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
          'Content-Type': 'application/json'
        }
      }
      );
      if (response.status === 200) {
        const traineeUsers = response.data;
        console.log(traineeUsers);
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const assignTask = async (taskData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/supervisor/assignTask`,
        taskData,
        {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        console.log('Task assigned:', response.data);
    }
    } catch (error) {
      console.log(error);
    }
  };


  const handleSearchResourcesAPI = async () => {
    const prompt = `Search up to 5 different resources, websites related to the task: ${taskName} - ${taskDescription}`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContent(prompt);
      const candidates = result.response.candidates;
      if (candidates && candidates.length > 0) {
        const actualContent = candidates[0].content.parts[0].text;
        console.log("Actual Content:", actualContent);
        // Now you can use actualContent as needed
        setResources(actualContent);
      } else {
        console.error('Error fetching resources:', response.statusText);
      }
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  const filteredTrainees = trainees.length > 0
    ? trainees.filter((trainee) =>
      trainee.userUsername.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const paginatedTrainees = filteredTrainees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleDeadlineChange = (newValue) => {
    setDeadline(newValue);
  };

  const handleTaskPriorityChange = (event) => {
    setPriorityStatus(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page changes
  };

  const handleTraineeSelect = (event, traineeId) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedTrainees([...selectedTrainees, traineeId]);
    } else {
      setSelectedTrainees(selectedTrainees.filter((id) => id !== traineeId));
    }
  };

  const handleAssignTask = () => {
    console.log(
      "Assigning task:",
      taskName,
      taskDescription,
      deadline,
      resources,
      priorityStatus,
      selectedTrainees
    );

    const taskData = {
      taskName,
      taskDescription,
      deadline,
      resources,
      priorityStatus,
      selectedTrainees,
    };
  console.log("Assigning task:", taskData);

    assignTask(taskData);
    // Clear form after assignment
    setTaskName("");
    setTaskDescription("");
    setDeadline(null);
    setResources("");
    setPriorityStatus("");
    setSelectedTrainees([]);
  };

  const handleViewProfile = (user) => {
    navigate(`/view-trainee/${user.userId}`);
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

const backPage = () =>{
  navigate('/tasks');
}
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <Button variant="contained" sx={{ border: '1x solid #ccc' }} onClick={backPage} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Box>
        <Typography className="concert-one-regular" variant='inherit' sx={{ marginBottom: '2rem', color: theme.palette.primary.dark }} align="center">
          &nbsp;Assign Task&nbsp;<TaskIcon fontSize="medium" />
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            label="Task Name"
            variant="outlined"
            value={taskName}
            onChange={handleTaskNameChange}
            fullWidth
            required
            sx={{ backgroundColor: '#fff' }}
          />
          <FormControl fullWidth>
            <TextField
              label="Task Description"
              multiline
              rows={5}
              value={taskDescription}
              onChange={handleTaskDescriptionChange}
              required
              sx={{ backgroundColor: '#fff' }}
            />
          </FormControl>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={handleDeadlineChange}
                renderInput={(params) => <TextField {...params} />}
                sx={{ backgroundColor: '#fff' }}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel >Priority</InputLabel>
            <Select
              label="Priority"
              value={priorityStatus}
              onChange={handleTaskPriorityChange}
              sx={{ backgroundColor: '#fff' }}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSearchResourcesAPI}
          >
            Search Resources
          </Button>
          <TextField
            label="Resources related"
            multiline
            rows={10}
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            fullWidth
            sx={{ backgroundColor: '#fff' }}
          />
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Trainee Selection
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: '#fff' }}>
          <Table aria-label="trainee table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedTrainees.length === paginatedTrainees.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTrainees(
                          paginatedTrainees.map((trainee) => trainee.userId)
                        );
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
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTrainees.map((trainee) => (
                <TableRow key={trainee.userId} hover>
                  <TableCell>
                    <Checkbox
                      checked={selectedTrainees.includes(trainee.userId)}
                      onChange={(e) => handleTraineeSelect(e, trainee.userId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleViewProfile(trainee)}
                    >
                      {trainee.userUsername}
                    </Button>
                  </TableCell>
                  <TableCell>{trainee.userFirstName}</TableCell>
                  <TableCell>{trainee.userLastName}</TableCell>
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
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAssignTask}>
          Assign Task
        </Button>
      </Paper>
    </div>
  );
};

export default AssignTask;
