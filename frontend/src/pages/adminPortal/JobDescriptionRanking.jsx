import React, { useState } from 'react';
import axios from 'axios';
import { Container, Grid, TextField, Button, Typography, Paper } from '@mui/material';

function JobDescriptionRanking() {
    const [jobDescription, setJobDescription] = useState('');
    const [rankedTrainees, setRankedTrainees] = useState('');

    const handleRank = async () => {
        try {
            const response = await axios.post('http://localhost:5000/rank_trainees', {
                jobDescription,
                trainees: [
                    { name: 'Abed', skills: ['Spring Boot', 'Java'] },
                    { name: 'Ali', skills: ['Python', 'AI'] }
                ]
            });
            setRankedTrainees(response.data.ranked_trainees);
        } catch (error) {
            console.error('Error ranking trainees:', error);
            setRankedTrainees('Error ranking trainees');
        }
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            Job Description
                        </Typography>
                        <TextField
                            label="Enter job description"
                            multiline
                            rows={10}
                            variant="outlined"
                            fullWidth
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '20px' }}
                            onClick={handleRank}
                        >
                            Generate Ranking
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            Ranked Trainees
                        </Typography>
                        <Typography variant="body1" component="pre">
                            {rankedTrainees}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default JobDescriptionRanking;
