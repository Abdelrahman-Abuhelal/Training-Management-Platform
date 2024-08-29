import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useAuth } from "../../provider/authProvider";
import { useTheme } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import WorkIcon from "@mui/icons-material/Work";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function JobDescriptionRanking() {
  const [jobDescription, setJobDescription] = useState("");
  const [rankedTrainees, setRankedTrainees] = useState("");
  const [considerations, setConsiderations] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const theme = useTheme();

  const handleRank = async () => {
    try {
      // Fetch data from APIs
      const skillsResponse = await axios.get(
        `${baseUrl}/api/v1/trainee-skills/all`,
        {
          headers: {
            Authorization: `Bearer ${login_token}`,
          },
        }
      );
      const tasksResponse = await axios.get(`${baseUrl}/api/v1/tasks/all`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
        },
      });
      const jobDataResponse = await axios.get(
        `${baseUrl}/api/v1/admin/trainee-job-data`,
        {
          headers: {
            Authorization: `Bearer ${login_token}`,
          },
        }
      );

      // Process and combine data
      const traineeSkillsMap = new Map();
      skillsResponse.data.forEach(({ userId, traineeName, skills }) => {
        traineeSkillsMap.set(userId, { traineeName, skills });
      });

      const traineeJobDataMap = new Map();
      jobDataResponse.data.forEach(
        ({
          userId,
          universityName,
          universityMajor,
          trainingField,
          expectedGraduationDate,
        }) => {
          traineeJobDataMap.set(userId, {
            universityName,
            universityMajor,
            trainingField,
            expectedGraduationDate,
          });
        }
      );

      const tasksMap = new Map();
      tasksResponse.data.forEach(({ userId, taskId, name, description }) => {
        if (!tasksMap.has(userId)) {
          tasksMap.set(userId, []);
        }
        tasksMap.get(userId).push({ taskId, name, description });
      });

      const trainees = Array.from(traineeSkillsMap.entries()).map(
        ([userId, { traineeName, skills }]) => {
          const jobData = traineeJobDataMap.get(userId);
          const tasks = tasksMap.get(userId) || [];
          return {
            name: traineeName,
            skills,
            tasks,
            jobData,
          };
        }
      );

      // Send combined data to ranking API
      const response = await axios.post("http://localhost:5000/rank_trainees", {
        jobDescription,
        trainees,
      });

      // Set the response data to state
      setRankedTrainees(response.data.ranked_trainees);
      setConsiderations(response.data.considerations);
      setRecommendations(response.data.recommendation);
    } catch (error) {
      console.error("Error ranking trainees:", error);
      setRankedTrainees("Error ranking trainees");
      setConsiderations("");
      setRecommendations("");
    }
  };

  return (
    <Box sx={{ margin: "2rem auto", maxWidth: "1200px" }}>
      <Paper
        elevation={3}
        sx={{
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: theme.palette.background.paper,
          border: "0.5px solid #ccc",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Finding Best Candidates for an Entry Job{" "}
          <WorkIcon fontSize="large" sx={{ mb: "0.2em" }} />
        </Typography>
        <Grid container spacing={2} sx={{p:'2rem'}}>
          <Grid item xs={12} mt={4} >
            <Paper elevation={3} sx={{ backgroundColor: "#fff", p: "20px" }}>
              <Typography variant="h5" sx={{ pb: "2rem" }} gutterBottom>
               <ArrowForwardIcon sx={{mb:'0.2rem'}}/> This feature leverages Generative AI to analyze and understand
                text, allowing HR to quickly rank and identify the best trainees
                and candidates for specific job descriptions.
              </Typography>
              <Typography variant="h5" sx={{ pb: "2rem" }} gutterBottom>
                Job Description
              </Typography>
              <TextField
                label="Enter job description"
                multiline
                rows={20}
                variant="outlined"
                fullWidth
                value={jobDescription}
                sx={{ backgroundColor: "#fff" }}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "20px" }}
                onClick={handleRank}
              >
                Generate Ranking
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} mt={4}>
            <Paper
              elevation={3}
              style={{ padding: "20px", backgroundColor: "#fff" }}
            >
              {/* <Typography variant="h5" sx={{ pb: "2rem" }} gutterBottom>
                The AI evaluates candidates by some data which will retrieved from the database using three APIs,
                such as their skills, completed tasks, and
                relevant job-related details like location, university, major,
                and graduation date. 
              </Typography>
              <Typography variant="h5" sx={{ pb: "2rem" }} gutterBottom>
              The data is parsed and used as criteria to
                rank the candidates according to their fit for the job
                description, and the results are presented in a structured
                response.
              </Typography> */}
              <Typography variant="h5" gutterBottom>
                Ranked Trainees
              </Typography>
              <Typography variant="body1" component="pre">
                {rankedTrainees}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} mt={4}>
            <Paper
              elevation={3}
              style={{ padding: "20px", backgroundColor: "#fff" }}
            >
              <Typography variant="h5" gutterBottom>
                Recommendations
              </Typography>
              <Typography variant="body1" component="pre">
                {recommendations}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} mt={4}>
            <Paper
              elevation={3}
              style={{ padding: "20px", backgroundColor: "#fff" }}
            >
              <Typography variant="h5" gutterBottom>
                Considerations
              </Typography>
              <Typography variant="body1" component="pre">
                {considerations}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default JobDescriptionRanking;
