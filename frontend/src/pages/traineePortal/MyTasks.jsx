import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Container, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Link, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../provider/authProvider";
import { useNavigate } from "react-router-dom";
import TaskIcon from '@mui/icons-material/Task';

const TASK_STATUS_LABELS = {
    TODO: "To Do",
    IN_PROGRESS: "Working On",
    STUCK: "Stuck",
    IN_REVIEW: "Waiting Review",
    COMPLETED: "Done"
};

const PRIORITY_COLORS = {
    LOW: "#d3f9d8",       // Light green
    MEDIUM: "#fff4d9",    // Light orange
    HIGH: "#f9d8d8"       // Light red
};

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dialogType, setDialogType] = useState(null);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;
    const theme = useTheme();

    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/trainee-operations/my-tasks`, {
            headers: {
                Authorization: `Bearer ${login_token}`,
            },
        })
            .then(response => {
                const formattedTasks = response.data.map(task => ({
                    ...task,
                    deadline: new Date(task.deadline),
                    dateAssigned: new Date(task.dateAssigned).toLocaleDateString(),
                }));

                // Sort tasks based on the deadline
                formattedTasks.sort((a, b) => a.deadline - b.deadline);

                // Format the deadline date after sorting
                formattedTasks.forEach(task => {
                    task.deadline = task.deadline.toLocaleDateString();
                });

                setTasks(formattedTasks);
            })
            .catch(error => {
                console.error("There was an error fetching the tasks!", error);
            });
    }, [login_token, baseUrl]);

    const handleClickOpen = (task, type) => {
        setSelectedTask(task);
        setDialogType(type);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTask(null);
        setDialogType(null);
    };

    const handleStatusChange = (event, traineeTaskId) => {
        const newStatus = event.target.value;
        axios.put(`${baseUrl}/api/v1/traineeTasks/${traineeTaskId}/status`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            }
        )
            .then(response => {
                setTasks(tasks.map(task =>
                    task.traineeTaskId === traineeTaskId ? { ...task, status: newStatus } : task
                ));
            })
            .catch(error => {
                console.error("There was an error updating the task status!", error);
            });
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
        { field: 'taskName', headerName: 'Task', width: 220 },
        {
            field: 'status',
            headerName: 'Status',
            width: 200,
            renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <FormControl variant="outlined" size="small" style={{ flex: 1 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={params.value}
                            onChange={(event) => handleStatusChange(event, params.row.traineeTaskId)}
                            label="Status"
                        >
                            {Object.keys(TASK_STATUS_LABELS).map(statusKey => (
                                <MenuItem key={statusKey} value={statusKey}>
                                    {TASK_STATUS_LABELS[statusKey]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            ),
        },
        {
            field: 'viewDetails',
            headerName: 'View Details',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleClickOpen(params.row, 'details')}
                >
                    View Details
                </Button>
            ),
        },
        {
            field: 'viewResources',
            headerName: 'View Resources',
            width: 200,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleClickOpen(params.row, 'resources')}
                >
                    View Resources
                </Button>
            ),
        },
        { field: 'deadline', headerName: 'Deadline', width: 120 },
        {
            field: 'priority',
            headerName: 'Priority',
            width: 120,
            renderCell: (params) => (
                <div style={{
                    backgroundColor: PRIORITY_COLORS[params.value] || '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px'
                }}>
                    {params.value}
                </div>
            ),
        },
        { field: 'dateAssigned', headerName: 'Date Assigned', width: 120 },
    ];


    const viewCompletedTasks = () => {
        navigate("/completed-tasks");
    }

    return (
        <Container>
            <Typography variant="h4" align='center' sx={{ mt: '2rem' }} gutterBottom>
                My Tasks <TaskIcon sx={{mb:'0.5rem'}} fontSize='large' />
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <Button variant="contained" sx={{ border: '1x solid #ccc' }} onClick={viewCompletedTasks} >
                    View Completed Tasks
                </Button>
            </Box>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={tasks}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    getRowId={(row) => row.traineeTaskId}
                    rowHeight={80} // Increase row height here
                />
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{dialogType === 'details' ? <Typography variant="h6">Task Name: {selectedTask.taskName}</Typography> : 'Resources'}</DialogTitle>
                <DialogContent>
                    {selectedTask && dialogType === 'details' && (
                        <div>
                            <Typography variant="body1">Description: {selectedTask.description}</Typography>
                        </div>
                    )}
                    {selectedTask && dialogType === 'resources' && (
                        <div>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {selectedTask && renderResources(selectedTask.resources)}
                            </ul>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyTasks;
