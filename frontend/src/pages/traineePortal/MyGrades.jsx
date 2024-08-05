import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import { useAuth } from "../../provider/authProvider";
import { useTheme } from '@mui/material';

const MyGrades = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuth();
  const { login_token } = user;
  const [courses, setCourses] = useState([]);

  const fetchUserCourses = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/trainee-operations/my-grades`, {
          headers: {
            Authorization: `Bearer ${login_token}`
          }
        }
      );
      if (response.status === 200) {
        const fetchedCourses = response.data;
        console.log("Fetched Courses:", fetchedCourses); // debugging

        if (Array.isArray(fetchedCourses)) {
          setCourses(
            fetchedCourses.map((course) => ({
              course: course.type,
              grade: course.mark,
            }))
          );
        } else {
          console.error("Error: Response data is not an array");
        }
      } else {
        console.error("Fetch Courses Failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  const averageGrade = () => {
    if (courses.length === 0) return 0; 
    const totalGrades = courses.reduce((sum, course) => sum + course.grade, 0);
    return (totalGrades / courses.length).toFixed(2); 
  };
  return (
    <Paper elevation={3} sx={{ p: '3rem', m: '4rem auto', backgroundColor: theme.palette.background.paper,width:'75%' }}>
      <Typography variant='h4' align="center" sx={{ color: theme.palette.primary.dark,mb:'4rem' }} gutterBottom>
        My Academic Courses <SchoolIcon fontSize="large"/>
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course, index) => (
          <Grid item xs={12} key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, border: `1px solid ${theme.palette.primary.main}`, borderRadius: 2, backgroundColor: '#fff' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold'}}>{course.course}</Typography>
              <Typography variant="body1">{course.grade}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, p: 2, border: `1px solid ${theme.palette.primary.main}`, borderRadius: 2, backgroundColor: '#fff', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Average Grade: {averageGrade()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MyGrades;
