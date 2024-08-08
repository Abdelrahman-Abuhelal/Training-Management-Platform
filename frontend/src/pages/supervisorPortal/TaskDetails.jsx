import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
    Paper,
    Typography,
    Select,
    MenuItem,
    Divider,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControl, InputLabel
} from "@mui/material"; import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from "../../provider/authProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
const TaskDetails = () => {
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [traineeTasks, setTraineeTasks] = useState([]);
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [selectedTraineeTask, setSelectedTraineeTask] = useState(null);

    const handleViewProfile = (userId) => {
        navigate(`/view-trainee/${userId}`);
    };

    const fetchTaskDetails = async () => {
        try {
            const taskResponse = await axios.get(`${baseUrl}/api/v1/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            setTask(taskResponse.data);

            const traineeTasksResponse = await axios.get(`${baseUrl}/api/v1/tasks/${taskId}/trainee-tasks`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            setTraineeTasks(traineeTasksResponse.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId, baseUrl, login_token]);

    const handleApprovedChange = async (traineeTaskId, newValue) => {
        try {
            await axios.put(`${baseUrl}/api/v1/traineeTasks/${traineeTaskId}`, {
                approved: newValue === 'Completed'
            }, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });

            setTraineeTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === traineeTaskId ? { ...task, approved: newValue === 'Completed' } : task
                )
            );
            fetchTaskDetails();
        } catch (error) {
            console.log(error);
        }
    };


    const handleDelete = (traineeTask) => {
        setSelectedTraineeTask(traineeTask);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTraineeTask(null);
    };

    const handleConfirmDelete = async () => {
        try {
            console.log(selectedTraineeTask.traineeTaskId);
            await axios.delete(`${baseUrl}/api/v1/traineeTasks/${selectedTraineeTask.traineeTaskId}`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            setTraineeTasks((prevTasks) => prevTasks.filter(task => task.id !== selectedTraineeTask.traineeTaskId));
            handleClose();
            fetchTaskDetails();
        } catch (error) {
            console.log(error);
        }
    };


    const columns = [
        {
            field: 'fullName',
            headerName: 'Trainee Name',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => handleViewProfile(params.row.userId)}
                >
                    {params.value}
                </Button>
            ),
        },
        { field: 'status', headerName: 'Status', width: 120 },
        {
            field: 'dateAssigned',
            headerName: 'Date Assigned',
            width: 150,
            valueFormatter: (params) => {
                return params.value; // Directly return the raw date string
            }
        },
        {
            field: 'comments',
            headerName: 'Comments',
            width: 200,
            renderCell: (params) => (
                <Button variant="contained" color="primary" onClick={() => handleCommentsClick(params.row)}>
                    View Comments
                </Button>
            ),
        },
        {
            field: 'approved',
            headerName: 'Approved',
            width: 200,
            renderCell: (params) => (
                <FormControl variant="outlined" sx={{ minWidth: 140, mt: '0.8rem' }}>
                    <InputLabel >Approved</InputLabel>
                    <Select
                        label="Approved"
                        value={params.value ? 'Completed' : 'Uncompleted'}
                        onChange={(event) => handleApprovedChange(params.row.traineeTaskId, event.target.value)}
                    >
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Uncompleted">Uncompleted</MenuItem>
                    </Select>
                </FormControl>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <IconButton color="error" onClick={() => handleDelete(params.row)}>
                    <DeleteIcon />
                </IconButton>
            ),
        }
    ];

    const handleCommentsClick = (traineeTask) => {
        // Navigate to comments view or open a modal with comments for this traineeTask
        console.log("View comments for trainee task:", traineeTask);
    };

    const navigateBack = () => {
        navigate(-1);
    };


    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
                <Button onClick={navigateBack} startIcon={<ArrowBackIcon />} variant='contained' sx={{ alignSelf: 'flex-start', mb: '1rem' }}>
                    Back to Tasks
                </Button>
                {task && (
                    <>
                        <Typography variant="h4" gutterBottom>{task.name}</Typography>
                        <Typography variant="body1" paragraph>{task.description}</Typography>
                        <Typography variant="body2" paragraph><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</Typography>
                        <Typography variant="body2" paragraph><strong>Priority:</strong> {task.priority}</Typography>

                        <Divider style={{ margin: "20px 0" }} />

                        <Typography variant="h5" gutterBottom>Trainee Tasks</Typography>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={traineeTasks}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                rowHeight={80}
                                disableSelectionOnClick
                                getRowId={(row) => row.traineeTaskId}
                            />
                        </div>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete this trainee task?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                                    Confirm
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Paper>
        </div>
    );
};

export default TaskDetails;
