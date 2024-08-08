import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Typography, Chip, Box } from '@mui/material';
import { useAuth } from "../../provider/authProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from 'react-router-dom';

const AddCourseComponent = () => {
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const [courses, setCourses] = useState([]);
    const [newCourseName, setNewCourseName] = useState('');
    const { user } = useAuth();
    const { login_token } = user;
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/courses`, {
                headers: {
                    Authorization: `Bearer ${login_token}`
                }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses', error);
        }
    };

    const addCourse = async (e) => {
        e.preventDefault();
        if (newCourseName.trim() === '') return;

        try {
            const response = await axios.post(`${baseUrl}/api/v1/courses`, {
                name: newCourseName
            }, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                    'Content-Type': 'application/json'
                }
            });

            setCourses([...courses, response.data]);
            setNewCourseName('');
        } catch (error) {
            console.error('Error adding course', error);
        }
    };

    const deleteCourse = async (id) => {
        try {
            await axios.delete(`${baseUrl}/api/v1/courses/${id}`, {
                headers: {
                    Authorization: `Bearer ${login_token}`
                }
            });
            setCourses(courses.filter(course => course.id !== id));
        } catch (error) {
            console.error('Error deleting course', error);
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
                Add New Course
            </Typography>
            <form onSubmit={addCourse} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Course Name"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                    sx={{ backgroundColor: '#fff' }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Add
                </Button>
            </form>
            <Typography variant="h6" sx={{ color: theme.palette.primary.dark }} component="h3" gutterBottom>
                Existing Courses
            </Typography>
            <Paper elevation={3} style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', borderRadius: '0.5rem' }}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {courses.map((course) => (
                        <Chip
                            key={course.id}
                            label={`${course.name}`}
                            onDelete={() => deleteCourse(course.id)}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                        />
                    ))}
                </Box>
            </Paper>
        </Paper>
    );
};

export default AddCourseComponent;
