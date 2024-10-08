import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Typography, Chip, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useAuth } from "../../provider/authProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';

const SkillTopics = [
    { value: 'PROGRAMMING_LANGUAGES', label: 'Programming Languages' },
    { value: 'TECHNOLOGIES', label: 'Technologies' },
    { value: 'CONCEPTS', label: 'Concepts' },
    { value: 'SOFT_SKILLS', label: 'Soft Skills' },
];

const AddSkillComponent = () => {
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const { user } = useAuth();
    const { login_token } = user;
    const theme = useTheme();
    const navigate  = useNavigate();

    useEffect(() => {
        fetchSkills();
    }, [newSkill]);

    const fetchSkills = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/skills`, {
                headers: {
                    Authorization: `Bearer ${login_token}`
                }
            });
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills', error);
        }
    };

    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() === '' || selectedTopic === '') return;

        axios.post(`${baseUrl}/api/v1/skills`, { name: newSkill, topic: selectedTopic }, {
            headers: {
                Authorization: `Bearer ${login_token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setSkills([...skills, response.data]);
                setNewSkill('');
                setSelectedTopic('');
            })
            .catch(error => {
                console.error('Error adding skill', error);
            });
    };

    const deleteSkill = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/v1/skills/${id}`, {
                headers: {
                    Authorization: `Bearer ${login_token}`
                }
            });
            setSkills(skills.filter(skill => skill.id !== id));
        } catch (error) {
            console.error('Error deleting skill', error);
        }
    };

    const navigateBack = () => {
        navigate(`/settings`);
      };
    return (
        <Paper elevation={3} style={{ padding: '30px', maxWidth: '600px', margin: '40px auto', backgroundColor: theme.palette.background.paper, borderRadius: '1rem' }}>
            <Button sx={{ backgroundColor: '#fff' }} variant="outlined" onClick={navigateBack} startIcon={<ArrowBackIcon />}>
                Settings
            </Button>
            <Typography className="concert-one-regular" variant='inherit' align='center' sx={{ color: theme.palette.primary.dark }} gutterBottom>
                Add New Skill
            </Typography>
            <form onSubmit={addSkill} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <FormControl variant="outlined" style={{ marginBottom: '10px' }}>
                    <InputLabel>Skill Topic</InputLabel>
                    <Select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        label="Skill Topic"
                        sx={{ backgroundColor: '#fff' }}
                    >
                        {SkillTopics.map((topic) => (
                            <MenuItem key={topic.value} value={topic.value}>
                                {topic.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Skill Name"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                    sx={{ backgroundColor: '#fff' }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Add
                </Button>
            </form>
            <Typography variant="h6" sx={{ color: theme.palette.primary.dark }} component="h3" gutterBottom>
                Existing Skills
            </Typography>
            <Paper elevation={3} style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', borderRadius: '0.5rem' }}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {skills.map((skill) => (
                        <Chip
                            key={skill.id}
                            label={`${skill.name} (${SkillTopics.find(topic => topic.value === skill.topic)?.label || "Unknown Topic"})`}
                            onDelete={() => deleteSkill(skill.id)}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                            sx={{ backgroundColor: '#fff' }}
/>
                    ))}
                </Box>
            </Paper>
        </Paper>
    );
};

export default AddSkillComponent;
