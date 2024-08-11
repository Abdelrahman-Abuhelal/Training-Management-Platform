import React, { useEffect, useState } from 'react';
import { Button, Typography, Box,Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";
import { useNavigate } from 'react-router-dom';

const TrainingPlan = () => {
    const { user } = useAuth();
    const { login_token } = user;
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [trainingPlans, setTrainingPlans] = useState([]); // State for training plans
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setFileName(uploadedFile.name);
    };

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
                    console.log('Training plan created:', response.data);
                    alert('Training plan created successfully!');
                    fetchTrainingPlans(); // Fetch training plans after successful upload
                }
            } catch (error) {
                console.error('Error creating training plan:', error);
                alert('Failed to create training plan.');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    // Fetch training plans assigned to the supervisor
    const fetchTrainingPlans = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/supervisor/my-plans`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            setTrainingPlans(response.data); // Set the training plans state
        } catch (error) {
            console.error('Error fetching training plans:', error);
        }
    };

    useEffect(() => {
        fetchTrainingPlans(); // Fetch training plans on component mount
    }, []); // Empty dependency array to run once

    const downloadFile = (base64Data, fileName) => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64Data}`; // Adjust MIME type based on the actual file type
        link.download = fileName; // Set the file name for download
        document.body.appendChild(link); // Append to body to make it work in Firefox
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up
    };

    const deleteTrainingPlan = async (planId) => {
        try {
            await axios.delete(`${baseUrl}/api/v1/trainingPlan/${planId}`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            // Refresh the training plans list after deletion
            setTrainingPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
            alert('Training plan deleted successfully!');
        } catch (error) {
            console.error('Error deleting training plan:', error);
            alert('Failed to delete training plan.');
        }
    };
    const handleNavigate = () => {
        navigate('/create-plan'); // Adjust the path as necessary
    };
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Grid container spacing={2} justifyContent="center" sx={{ p: "1rem", m: "1rem", width: "90%", maxWidth: "90%" }}>
                <Grid item xs={12}>
                    {/* File Upload Section */}
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
                                variant="text" // Use 'outlined' style for the navigation button
                                onClick={handleNavigate}
                            >
                                Create Training Plan
                            </Button>
                        </Box>

                        <Button
                            variant="contained"
                            sx={{ mt: 2 }} // Add margin top for spacing
                            onClick={handleSubmitTrainingPlan}
                            disabled={!file}
                        >
                            Submit Training Plan
                        </Button>
                    </Paper>
                </Grid>


                <Grid item xs={12}>
                    {/* Training Plans List Section */}
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Assigned Training Plans
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
                                        color="error"
                                        onClick={() => deleteTrainingPlan(plan.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        Delete
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default TrainingPlan;
