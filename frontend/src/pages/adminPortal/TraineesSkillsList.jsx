import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText
} from "@mui/material";
import { useAuth } from "../../provider/authProvider";
import { Link } from "react-router-dom";
import { useMediaQuery, useTheme } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// Define proficiency levels and their background colors

 // const proficiencyLevels = {
 // GOOD: "#d0ebff", // light blue
  // VERY_GOOD: "#a4c8e5", // slightly darker blue
 // EXCELLENT: "#81a7d1", // medium blue
 // EXPERT: "#4a90e2" // darker blue
// };
const proficiencyLevels = {
  GOOD: "#cce7ff", // light blue
  VERY_GOOD: "#99d0ff", // slightly darker blue
  EXCELLENT: "#66b8ff", // medium blue
  EXPERT: "#339fff" // darker blue
};



const TraineesSkillsList = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;

  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [skillFilter, setSkillFilter] = useState([]);
  const [topicFilter, setTopicFilter] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    fetchTraineesWithSkills();
    fetchAllSkills();
  }, []);

  useEffect(() => {
    filterTrainees();
  }, [skillFilter, topicFilter, proficiencyFilter, trainees]);

  const fetchTraineesWithSkills = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/trainee-skills/all`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      setTrainees(response.data);
      setFilteredTrainees(response.data);
    } catch (error) {
      console.error("Error fetching trainees", error);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/skills`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      setAllSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills", error);
    }
  };

  const filterTrainees = () => {
    let filtered = trainees;

    // Filter by multiple skill names
    if (skillFilter.length > 0) {
      filtered = filtered.map(trainee => ({
        ...trainee,
        skills: trainee.skills.filter(skill =>
          skillFilter.includes(skill.skillName)
        )
      })).filter(trainee => trainee.skills.length > 0);
    }

    // Filter by topic


    // Filter by proficiency levels
    if (proficiencyFilter.length > 0) {
      filtered = filtered.map(trainee => ({
        ...trainee,
        skills: trainee.skills.filter(skill => proficiencyFilter.includes(skill.proficiencyLevel))
      })).filter(trainee => trainee.skills.length > 0);
    }

    setFilteredTrainees(filtered);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', p: '3rem' }}>
      <Paper elevation={3} sx={{ p: 3, width: "80%", maxWidth: 1800, backgroundColor: theme.palette.background.paper, borderRadius: '1rem', p: '2rem' }}>
        <Typography className="concert-one-regular" variant='inherit' align="center" component="h2" sx={{ mb: '2rem', color: theme.palette.primary.dark }} gutterBottom>
          Trainee Skills List <AutoAwesomeIcon />
        </Typography>

        {/* Filters */}
        <Box sx={{ mb: 2 }}>
          {/* Skill Name Filter */}
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Filter by Skill Name</InputLabel>
            <Select
              multiple
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
              label="Filter by Skill Name"
              sx={{ backgroundColor: '#fff' }}
            >
              {allSkills.map(skill => (
                <MenuItem key={skill.skillId} value={skill.name}>
                  <Checkbox checked={skillFilter.indexOf(skill.name) > -1} />
                  <ListItemText primary={skill.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          {/* Proficiency Filter */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filter by Proficiency</InputLabel>
            <Select
              multiple
              value={proficiencyFilter}
              onChange={(e) => setProficiencyFilter(e.target.value)}
              renderValue={(selected) => selected.join(', ')}
              label="Filter by Proficiency"
              sx={{ backgroundColor: '#fff' }}
            >
              {Object.keys(proficiencyLevels).map(level => (
                <MenuItem key={level} value={level}>
                  <Checkbox checked={proficiencyFilter.indexOf(level) > -1} />
                  <ListItemText primary={level} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Trainees List */}
        <Grid container spacing={2} sx={{ marginTop: '2rem' }}>
          {filteredTrainees.map((trainee, index) => (
            <Grid item xs={12} key={index} sx={{ backgroundColor: '#F5FFFA', mb: '2rem', borderRadius: '1rem' }}>
              <Typography  variant='h5' align="center" component="h3" gutterBottom  >
                <Link to={`/edit-trainee/${trainee.userId}`} style={{ textDecoration: 'none', color:  theme.palette.primary.dark}}>
                 <AccountCircleIcon sx={{mb:'0.4rem'}} fontSize="large"/> {trainee.traineeName}
                </Link>
              </Typography>
              <Typography  variant='h6'  component="h3" gutterBottom  sx={{ml:'0.5rem', color:  theme.palette.primary.dark}}>
              Skills:
              </Typography>

              <Grid container spacing={1} >
                {trainee.skills.map((skill, idx) => (
                  <Grid item xs={6} sm={3} md={2} key={idx} >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: proficiencyLevels[skill.proficiencyLevel],
                        p: 1,
                        borderRadius: 1,
                        mb: 2,
                        minWidth: 100,
                        overflow: 'hidden', // Hide overflowing content
                        textOverflow: 'ellipsis', // Show ellipsis for overflowing text
                        whiteSpace: 'nowrap' // Prevent wrapping of text
                      }}
                    >
                      <Typography
                        sx={{
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: 'center'
                        }}
                      >
                        <strong>{skill.skillName}</strong>
                      </Typography>
                      <Chip
                        label={skill.proficiencyLevel}
                        sx={{
                          backgroundColor: proficiencyLevels[skill.proficiencyLevel],
                          color: '#000',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%' // Ensure Chip doesn't exceed its container
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TraineesSkillsList;
