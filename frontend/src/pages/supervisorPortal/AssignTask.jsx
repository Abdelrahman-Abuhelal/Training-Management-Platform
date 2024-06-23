import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const AssignTask = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const APIkey = import.meta.env.VITE_GOOGLE_AI_KEY;
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [aiResponse, setResponse] = useState("");

  const genAI = new GoogleGenerativeAI(APIkey);

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/supervisor/my-trainees`
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

  const handleSearchResourcesAPI = async () => {
    const prompt = `Search up to 5 different resources, websites related to the task: ${taskName} - ${taskDescription}`;
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    
    try {
      const result = await model.generateContent(prompt);
      const candidates = result.response.candidates;
      if (candidates && candidates.length > 0) {
        const actualContent = candidates[0].content.parts[0].text;
        console.log("Actual Content:", actualContent);
        // Now you can use actualContent as needed
        setResponse(actualContent);
    }

      else {
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

  const handleTraineeSelect = (event) => {
    const traineeId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedTrainees([...selectedTrainees, traineeId]);
    } else {
      setSelectedTrainees(selectedTrainees.filter((id) => id !== traineeId));
    }
  };

  const handleAssignTask = () => {
    // Implement logic to assign task to selected trainees with task details (name, description, deadline)
    console.log(
      "Assigning task:",
      taskName,
      taskDescription,
      deadline,
      selectedTrainees
    );
    // Clear form after assignment
    setTaskName("");
    setTaskDescription("");
    setDeadline(null);
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

  return (
    <div style={{ display: "flex", justifyContent: "center"}}>
<Paper elevation={3} sx={{ p: 3, m: 6 , width: "70%", maxWidth: 1000}} >

      <Typography  variant="h4" sx={{ marginBottom: '2rem' }}>&nbsp;&nbsp;Assign Task</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Task Name"
          variant="outlined"
          value={taskName}
          onChange={handleTaskNameChange}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <TextField
            label="Task Description"
            labelId="task-description-label"
            multiline
            rows={5
            }
            value={taskDescription}
            onChange={handleTaskDescriptionChange}
            required
            />
        </FormControl>
        <FormControl fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Deadline"
              value={deadline}
              onChange={handleDeadlineChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </FormControl>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSearchResourcesAPI
          }
        >
          Search Resources
        </Button>
        <TextField
          label="Resources related"
          multiline
          rows={10}
          value={aiResponse}
          onChange={(e) => setResponse(e.target.value)}
          fullWidth
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Trainee Selection
      </Typography>
      <TableContainer component={Paper}>
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
                    checked={selectedTrainees.some(
                      (id) => id === trainee.userId
                    )}
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
