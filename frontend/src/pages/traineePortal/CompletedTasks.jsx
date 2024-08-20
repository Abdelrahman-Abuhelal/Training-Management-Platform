import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Container, Typography, Button,Box, Dialog, DialogTitle, DialogContent, DialogActions, Link, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../provider/authProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const TASK_STATUS_LABELS = {
    TODO: "To Do",
    IN_PROGRESS: "Working On",
    STUCK: "Stuck",
    IN_REVIEW: "Waiting Review",
    COMPLETED: "Done"
};

const CompletedTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();
    const [dialogType, setDialogType] = useState(null);
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
                const formattedTasks = response.data
                    .filter(task => task.approved) // Filter only approved tasks
                    .map(task => ({
                        ...task,
                        deadline: new Date(task.deadline),
                        dateAssigned: new Date(task.dateAssigned).toLocaleDateString(),
                        dateFinished: new Date(task.dateFinished).toLocaleDateString(),
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

    const renderResources = (resources) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return resources.split('\n').map((resource, index) => {
            const parts = resource.split(urlRegex);
            return (
                <li key={index}>
                    {parts.map((part, i) =>
                        urlRegex.test(part) ? (
                            <Link key={i} href={part} target="_blank" rel="noopener">
                                {part}
                            </Link>
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
        { field: 'description', headerName: 'Description', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'deadline', headerName: 'Deadline', width: 120 },
        { field: 'priority', headerName: 'Priority', width: 120 },
        {
            field: 'dateFinished',
            headerName: 'Date Finished',
            width: 150,
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor: '#d4edda', // Light green background color
                        color: '#155724',           // Dark green text color
                        textAlign: 'center',
                    }}
                >
                    {params.value}
                </Box>
            )
        },        { field: 'approved', headerName: 'Approved', width: 120, type: 'boolean' },

    ];

    return (
        <Container>
            <Button variant='contained' sx={{ mt: "2rem" }} onClick={() => {
                navigate(`/tasks`);
            }} startIcon={<ArrowBackIcon />}>
                Back to Tasks
            </Button>
            <Typography variant="h4" align='center' sx={{mb:'2rem'}} gutterBottom>
                Completed Tasks <TaskAltIcon fontSize='large'/>
            </Typography>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={tasks}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    getRowId={(row) => row.traineeTaskId}
                />
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{dialogType === 'details' ? 'Task Details' : 'Resources'}</DialogTitle>
                <DialogContent>
                    {selectedTask && dialogType === 'details' && (
                        <div>
                            <Typography variant="h6">Task Name: {selectedTask.taskName}</Typography>
                            <Typography variant="body1">Description: {selectedTask.description}</Typography>
                        </div>
                    )}
                    {selectedTask && dialogType === 'resources' && (
                        <div>
                            <Typography variant="body1">Resources:</Typography>
                            <ul>
                                {renderResources(selectedTask.resources)}
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

export default CompletedTasks;
