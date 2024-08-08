import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Typography,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from "../../provider/authProvider";
import { useParams, useNavigate } from "react-router-dom";
import StarsIcon from '@mui/icons-material/Stars';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const skillCategories = [
  "PROGRAMMING_LANGUAGES",
  "TECHNOLOGIES",
  "CONCEPTS",
  "SOFT_SKILLS"
];


const proficiencyLevels = {
  GOOD: "#cce7ff", // light blue
  VERY_GOOD: "#99d0ff", // slightly darker blue
  EXCELLENT: "#66b8ff", // medium blue
  EXPERT: "#339fff" // darker blue
};
const TraineeSkills = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const { userId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [userFullName, setUserFullName] = useState("");

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState({
    PROGRAMMING_LANGUAGES: [],
    TECHNOLOGIES: [],
    CONCEPTS: [],
    SOFT_SKILLS: []
  });
  const [proficiencies, setProficiencies] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchSkills();
    fetchTraineeSkills();
    userData();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/skills`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills", error);
    }
  };

  const fetchTraineeSkills = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/trainee-skills/${userId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      console.log(response.data);

      const savedSkills = response.data.skills;
      const initialSelectedSkills = {
        PROGRAMMING_LANGUAGES: [],
        TECHNOLOGIES: [],
        CONCEPTS: [],
        SOFT_SKILLS: []
      };
      const initialProficiencies = {};

      savedSkills.forEach(({ skillId, proficiencyLevel, topic }) => {
        initialSelectedSkills[topic].push(skillId);
        initialProficiencies[skillId] = proficiencyLevel;
      });

      setSelectedSkills(initialSelectedSkills);
      setProficiencies(initialProficiencies);
    } catch (error) {
      console.error("Error fetching trainee skills", error);
    }
  };

  const userData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      if (response.status === 200) {
        const userData = response.data;
        setUserFullName(userData.userFirstName + " " + userData.userLastName);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSkillChange = (category, skillId, event) => {
    const proficiency = event.target.value;
    setProficiencies(prev => ({
      ...prev,
      [skillId]: proficiency
    }));
  };

  const handleSkillSelect = (category) => (event) => {
    const selected = event.target.value;
    setSelectedSkills(prev => ({
      ...prev,
      [category]: selected
    }));
  };

  const handleDeleteSkill = async (category, skillId) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/trainee-skills/${userId}/${skillId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`,
          'Content-Type': 'application/json'
        }
      });
      setSelectedSkills(prev => ({
        ...prev,
        [category]: prev[category].filter(id => id !== skillId)
      }));
      setProficiencies(prev => {
        const { [skillId]: _, ...rest } = prev;
        return rest;
      });
      setSnackbarMessage("Skill deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting skill", error);
    }
  };

  const handleSaveSkills = async () => {
    const skillsData = Object.keys(selectedSkills).flatMap(category => 
      selectedSkills[category].map(skillId => ({
        skillId,
        proficiencyLevel: proficiencies[skillId] || "GOOD", // Default to Good if not set
        topic: category
      }))
    );

    try {
      await axios.post(`${baseUrl}/api/v1/trainee-skills/${userId}`, { skills: skillsData }, {
        headers: {
          Authorization: `Bearer ${login_token}`,
          'Content-Type': 'application/json'
        }
      });
      setSnackbarMessage("Skills updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error saving skills", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const navigateBack = () => {
    navigate(`/my-trainees`);
  };


  return (
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', marginTop: '2rem', marginBottom: '4rem' }}>
  <Paper elevation={3} sx={{ p: 3, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <Button onClick={navigateBack} startIcon={<ArrowBackIcon />} variant='contained' sx={{ alignSelf: 'flex-start', mb: '1rem' }}>
      Back to Trainees
    </Button>
    <Typography className="concert-one-regular" variant='inherit' sx={{ color: theme.palette.primary.dark, mb: '1.5rem', alignSelf: 'center ' }} gutterBottom>
     {userFullName} Skills <AutoAwesomeIcon fontSize="large" sx={{mb:'0.5rem'}} />
    </Typography>
        <Grid container spacing={2}>
          {skillCategories.map(category => (
            <Grid item xs={12} key={category}>
              <Typography variant="h6" component="h3" sx={{marginTop:'2rem'}} align="center" gutterBottom>
                {category.replace(/_/g, ' ')}
              </Typography>
              <FormControl fullWidth variant="outlined" sx={{ mb: '1rem' ,mt:'1rem'}}>
                <InputLabel>Select Skill</InputLabel>
                <Select
                  multiple
                  value={selectedSkills[category]}
                  onChange={handleSkillSelect(category)}
                  label='Select Skill'
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selected.map((id) => {
                        const skill = skills.find(skill => skill.id === id);
                        return (
                          <Chip
                            key={id}
                            label={skill?.name || "Unknown Skill"}
                            onDelete={() => handleDeleteSkill(category, id)}
                            deleteIcon={<IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>}
                            sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                          />
                        );
                      })}
                    </Box>
                  )}
                  sx={{ backgroundColor: '#fff' }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Fixed height for dropdown
                        width: 250, // Width of dropdown
                      },
                    },
                  }}
                >
                  {skills.filter(skill => skill.topic === category).map((skill) => (
                    <MenuItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid container spacing={2}>
                {selectedSkills[category].filter(skillId => skillId).map((skillId, index) => (
                  <Grid item xs={12} sm={6} key={skillId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: proficiencyLevels[proficiencies[skillId] || "GOOD"], p: 1, borderRadius: 1 }}>
                      <Typography sx={{ flexGrow: 1, color: '#000' }}>
                        {skills.find(skill => skill.id === skillId)?.name || "Unknown Skill"}
                      </Typography>
                      <FormControl variant="outlined" sx={{ minWidth: 120, ml: 2 }}>
                        <InputLabel>Proficiency</InputLabel>
                        <Select
                          value={proficiencies[skillId] || "GOOD"}
                          onChange={(event) => handleSkillChange(category, skillId, event)}
                          label="Proficiency"
                          sx={{ backgroundColor: '#fff' }}
                        >
                          {Object.keys(proficiencyLevels).map(level => (
                            <MenuItem
                              key={level}
                              value={level}
                              sx={{ backgroundColor: proficiencyLevels[level] }}
                            >
                              {level}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton size="small" onClick={() => handleDeleteSkill(category, skillId)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid> 
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSkills}
          sx={{ mt: '3rem'}}
          fullWidth
        >
          Save Skills
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose}   severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default TraineeSkills;
