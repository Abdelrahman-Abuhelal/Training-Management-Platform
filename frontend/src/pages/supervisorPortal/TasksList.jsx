import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import {
  Typography,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Box,
  DialogTitle,
  Link
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAuth } from "../../provider/authProvider";
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
const TasksList = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDetailsClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const fetchAssignedTasks = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/supervisor/assigned-tasks`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
        },
      });
      if (response.status === 200) {
        setAssignedTasks(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const handleClickOpen = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };
  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedTask(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/api/v1/tasks/${selectedTask.id}`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
        },
      });
      setAssignedTasks((prevTasks) => prevTasks.filter(task => task.id !== selectedTask.id));
      handleDeleteDialogClose();
    } catch (error) {
      console.log(error);
    }
  };
  const renderResources = (resources) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return resources.split('\n').map((resource, index) => {
      const parts = resource.split(urlRegex);
      return (
        <li key={index}>
          {parts.map((part, i) =>
            urlRegex.test(part) ? (
              <Link key={i} href={part} target="_blank" rel="noopener">{part}</Link>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </li>
      );
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    {
      field: 'details',
      headerName: 'Details',
      width: 150,
      renderCell: (params) => (
        <Button variant="outlined"  sx={{  backgroundColor: "#fff" }} color="primary" onClick={() => handleClickOpen(params.row)}>
          View Details
        </Button>
      ),
    },
    {
      field: 'deadline', headerName: 'Deadline', width: 180,
      valueFormatter: (params) => {
        return params.value; // Directly return the raw date string
      }
    },
    { field: 'priority', headerName: 'Priority', width: 130 },
    {
      field: 'Trainees Task',
      headerName: 'Trainees Task',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDetailsClick(params.row.id)}
        >
          View Progress
        </Button>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
        </IconButton>
    ),
    }
  ];

  const rows = assignedTasks.map((task) => ({
    id: task.id,
    name: task.name,
    description: task.description,
    deadline: task.deadline,
    resources: task.resources,
    priority: task.priority,
  }));

  const assignTaskPage = () => {
    navigate("/assign-task");
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
        <Typography className="concert-one-regular" sx={{ color: theme.palette.primary.dark }} align="center" gutterBottom>
          Assigned Tasks
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button variant="contained" sx={{ border: '1x solid #ccc' }} onClick={assignTaskPage} startIcon={<AddIcon />}>
            New Task
          </Button>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
          />
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <strong>Description:</strong> {selectedTask?.description}
            </DialogContentText>
            <DialogContentText>
              <strong>Resources:</strong>
              <ul>
                {selectedTask && renderResources(selectedTask.resources)}
              </ul>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      </Paper>
    </div>
  );
};

export default TasksList;
