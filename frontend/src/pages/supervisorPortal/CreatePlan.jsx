import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";

const CreatePlan = () => {
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

    return (
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
    );
};

export default CreatePlan;
