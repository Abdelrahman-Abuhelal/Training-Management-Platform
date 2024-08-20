import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Grid, Paper, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Checkbox, Avatar } from '@mui/material';
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";
import { useNavigate } from 'react-router-dom';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { CalendarIcon } from '@heroicons/react/24/outline';

const TrainingPlan = () => {
    const { user } = useAuth();
    const { login_token } = user;
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const [trainees, setTrainees] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [trainingPlans, setTrainingPlans] = useState([]); 
    const [selectedTrainees, setSelectedTrainees] = useState([]);
    const [showSendFormModal, setShowSendFormModal] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileName(uploadedFile.name);
    };

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
                    fullName: `${trainee.userFirstName} ${trainee.userLastName}`
                }));
                setTrainees(traineeUsers);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTrainees();
    }, []);
    
    const handleSubmitTrainingPlan = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const planFile = reader.result;

            const requestData = {
                planFile: Array.from(new Uint8Array(planFile)),
                fileName: fileName,
            };

            try {
                const response = await axios.post(`${baseUrl}/api/v1/trainingPlan`, requestData, {
                    headers: {
                        Authorization: `Bearer ${login_token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    alert('Training plan created successfully!');
                    fetchTrainingPlans();
                }
            } catch (error) {
                console.error('Error creating training plan:', error);
                alert('Failed to create training plan.');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const fetchTrainingPlans = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/supervisor/my-plans`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            setTrainingPlans(response.data);
        } catch (error) {
            console.error('Error fetching training plans:', error);
        }
    };

    useEffect(() => {
        fetchTrainingPlans();
    }, []);

    const downloadFile = (base64Data, fileName) => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64Data}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const deleteTrainingPlan = async (planId) => {
        try {
            await axios.delete(`${baseUrl}/api/v1/trainingPlan/${planId}`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            setTrainingPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
            alert('Training plan deleted successfully!');
        } catch (error) {
            console.error('Error deleting training plan:', error);
            alert('Failed to delete training plan.');
        }
    };

    const handleOpenSendDialog = (planId) => {
        setSelectedPlanId(planId);
        setShowSendFormModal(true);
    };

    const handleSendForm = async () => {
        console.log(selectedTrainees);
        console.log(selectedPlanId);
        try {
            await axios.put(`${baseUrl}/api/v1/trainingPlan/${selectedPlanId}/assign`, {
                userIds: selectedTrainees
            }, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            alert('Training plan sent successfully!');
            setShowSendFormModal(false);
        } catch (error) {
            console.error('Error sending training plan:', error);
            alert('Failed to send training plan.');
        }
    };

    const handleToggleTrainee = (traineeId) => {
        setSelectedTrainees((prevSelected) =>
            prevSelected.includes(traineeId)
                ? prevSelected.filter(id => id !== traineeId)
                : [...prevSelected, traineeId]
        );
    };

    const handleSendFormCancel = () => {
        setShowSendFormModal(false);
    };

    const handleNavigate = () => {
        navigate('/create-plan');
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Grid container spacing={2} justifyContent="center" sx={{ p: "1rem", m: "1rem", width: "90%", maxWidth: "90%" }}>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Upload Training Plan File
                        </Typography>
                        <input
                            type="file"
                            accept=".csv, .xls, .xlsx, .pdf, .doc, .docx"
                            onChange={handleFileChange}
                        />
                        <br />
                        <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
                            <Typography variant="body1" sx={{ mr: 1 }}>
                                Need help to create a training plan?
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={handleNavigate}
                                sx={{ml:'1rem'}}
                            >
                                Create Plan
                            </Button>
                        </Box>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleSubmitTrainingPlan}
                            disabled={!file}
                        >
                            Submit Training Plan
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                       Training Plans 
                       <CalendarIcon style={{marginLeft:'0.5rem', width: '24px', height: '24px', marginBottom:'0.3rem' }}/>
                        </Typography>
                        <List>
                            {trainingPlans.map(plan => (
                                <ListItem key={plan.id}>
                                    <ListItemText
                                        primary={plan.fileName}
                                        secondary={`Supervisor ID: ${plan.supervisorId}`}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => downloadFile(plan.planFile, plan.fileName)}
                                        sx={{ backgroundColor: "#fff" }}
                                    >
                                        Download
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenSendDialog(plan.id)}
                                        sx={{ ml: 1, backgroundColor: "#fff" }}
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => deleteTrainingPlan(plan.id)}
                                        sx={{ ml: 1 , backgroundColor: "#fff" }}
                                    >
                                        Delete
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={showSendFormModal} onClose={handleSendFormCancel}>
                <DialogTitle>Send Training Plan</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select trainees to send the training plan to:
                    </DialogContentText>
                    <List>
                        {trainees.map(trainee => (
                            <ListItem key={trainee.userId}>
                                <Checkbox
                                    checked={selectedTrainees.includes(trainee.userId)}
                                    onChange={() => handleToggleTrainee(trainee.userId)}
                                />
                                <ListItemText primary={trainee.fullName} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSendFormCancel}>Cancel</Button>
                    <Button onClick={handleSendForm} variant="contained">Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TrainingPlan;
