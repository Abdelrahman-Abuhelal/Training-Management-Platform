import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";

const TrainingPlan = () => {
    const { user } = useAuth();
    const { login_token } = user;
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const APIkey = import.meta.env.VITE_GOOGLE_AI_KEY;
    const genAI = new GoogleGenerativeAI(APIkey);
    const [trainingFrom, setTrainingFrom] = useState('');
    const [trainingTo, setTrainingTo] = useState('');
    const [trainingField, setTrainingField] = useState('');
    const [skills, setSkills] = useState('');
    const [programmingLanguages, setProgrammingLanguages] = useState('');
    const [trainingPlan, setTrainingPlan] = useState(null);
    const [file, setFile] = useState(null);
    const [trainees, setTrainees] = useState([]);
    const [selectedTrainees, setSelectedTrainees] = useState([]);

    // Function to create training plan
    const handleCreatePlanAPI = async () => {
        const planData = {
            trainingFrom,
            trainingTo,
            trainingField,
            skills: skills.split(',').map(skill => skill.trim()),
            programmingLanguages: programmingLanguages.split(',').map(lang => lang.trim()),
        };

        const prompt = `
        Create a detailed training plan for trainees.
        Timeline: From ${planData.trainingFrom} to ${planData.trainingTo}.
        Training Field: ${planData.trainingField}.
        Skills to be learned: ${planData.skills.join(', ')}.
        Programming Languages: ${planData.programmingLanguages.join(', ')}.
        Include weekly tasks for the trainees.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        try {
            const result = await model.generateContent({ prompt });
            const candidates = result.response.candidates;
            if (candidates && candidates.length > 0) {
                const actualContent = candidates[0].content.parts[0].text;
                setTrainingPlan(actualContent);
            }
        } catch (error) {
            console.error("Error generating training plan:", error);
            setTrainingPlan("Failed to generate training plan.");
        }
    };

    // Function to handle file selection
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    };

    // Fetch trainees from API
    const fetchTrainees = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/supervisor/my-trainees`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                const traineeUsers = response.data;
                console.log(response.data);
                setTrainees(traineeUsers);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTrainees();
    }, []);

    // Function to assign file to selected trainees
    const handleAssignFileToTrainees = () => {
        console.log('Assigning file to trainees:', selectedTrainees);
    };

    const handleSelectTrainee = (userId) => {
        setSelectedTrainees((prevSelected) => {
            if (prevSelected.includes(userId)) {
                return prevSelected.filter(id => id !== userId);
            } else {
                return [...prevSelected, userId];
            }
        });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
 <Grid container spacing={2} justifyContent="center" sx={{ p: "1rem", m: "1rem", width: "90%", maxWidth: "90%"}}>
            <Grid item xs={12} sm={6}>
                {/* Training Plan Generation Section */}
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Create Your Training Plan
                    </Typography>
                    <TextField
                        label="Training From (e.g., 2024-01-01)"
                        fullWidth
                        value={trainingFrom}
                        onChange={(e) => setTrainingFrom(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Training To (e.g., 2024-12-31)"
                        fullWidth
                        value={trainingTo}
                        onChange={(e) => setTrainingTo(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Training Field (e.g., backend, frontend, devops, quality assurance)"
                        fullWidth
                        value={trainingField}
                        onChange={(e) => setTrainingField(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Skills to Learn (comma separated, e.g., object oriented, data structure)"
                        fullWidth
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Programming Languages (comma separated, e.g., Java, Python)"
                        fullWidth
                        value={programmingLanguages}
                        onChange={(e) => setProgrammingLanguages(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleCreatePlanAPI}
                    >
                        Generate Training Plan
                    </Button>

                    {trainingPlan && (
                        <Paper elevation={2} style={{ marginTop: '20px', padding: '10px' }}>
                            <Typography variant="h6">Generated Training Plan:</Typography>
                            <Typography>{trainingPlan}</Typography>
                        </Paper>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
                {/* File Upload and Assignment Section */}
                <Paper elevation={3} style={{ padding: '20px' }}>
                    <Typography variant="h6" gutterBottom>
                        Upload Training Plan File
                    </Typography>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />

                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                        Assign File to Trainees
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedTrainees.length > 0 && selectedTrainees.length < trainees.length}
                                            checked={trainees.length > 0 && selectedTrainees.length === trainees.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedTrainees(trainees.map(trainee => trainee.userId));
                                                } else {
                                                    setSelectedTrainees([]);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainees.map((trainee) => (
                                    <TableRow key={trainee.userId}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedTrainees.includes(trainee.userId)}
                                                onChange={() => handleSelectTrainee(trainee.userId)}
                                            />
                                        </TableCell>
                                        <TableCell>{trainee.userFirstName}</TableCell>
                                        <TableCell>{trainee.userLastName}</TableCell>
                                        <TableCell>{trainee.userEmail}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleAssignFileToTrainees}
                        disabled={!file || selectedTrainees.length === 0}
                    >
                        Assign File to Selected Trainees
                    </Button>
                </Paper>
            </Grid>
        </Grid>
        </div>
    );
};

export default TrainingPlan;
