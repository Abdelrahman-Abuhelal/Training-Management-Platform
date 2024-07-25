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

// Define proficiency levels and their background colors
const proficiencyLevels = {
  GOOD: "#d4edda", // light green
  VERY_GOOD: "#c3e6cb", // green
  EXCELLENT: "#f8d7da", // light red
  EXPERT: "#f5c6cb" // dark red
};

const AllTraineesSkills = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;

  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [skillFilter, setSkillFilter] = useState([]);
  const [topicFilter, setTopicFilter] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState([]);
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    fetchTraineesWithSkills();
    fetchAllSkills();
  }, []);

  useEffect(() => {
    filterTrainees();
  }, [skillFilter, topicFilter, proficiencyFilter, trainees]);

  const fetchTraineesWithSkills = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/trainee-skills/mine`, {
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
    if (topicFilter) {
      filtered = filtered.map(trainee => ({
        ...trainee,
        skills: trainee.skills.filter(skill => skill.topic === topicFilter)
      })).filter(trainee => trainee.skills.length > 0);
    }

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, width: "80%", maxWidth: 1200, backgroundColor: '#F5F7F8' }}>
        <Typography className="concert-one-regular" variant='inherit' align="center" component="h2" sx={{mb:'2rem'}} gutterBottom>
          Trainee Skills List
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

          {/* Topic Filter */}
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Filter by Topic</InputLabel>
            <Select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              label="Filter by Topic"
              sx={{ backgroundColor: '#fff' }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="PROGRAMMING_LANGUAGES">Programming Languages</MenuItem>
              <MenuItem value="TECHNOLOGIES">Technologies</MenuItem>
              <MenuItem value="CONCEPTS">Concepts</MenuItem>
              <MenuItem value="SOFT_SKILLS">Soft Skills</MenuItem>
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
        <Grid container spacing={2} sx={{marginTop:'2rem'}}>
          {filteredTrainees.map((trainee, index) => (
            <Grid item xs={12} key={index} sx={{ backgroundColor: '#F7F9FC ', mb: '2rem'}}>
              <Typography className="concert-one-regular" variant='inherit' align="center" component="h3" gutterBottom sx={{mb:'1rem'}}>
                <strong>Name: </strong> 
                <Link to={`/edit-trainee/${trainee.userId}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                  {trainee.traineeName}
                </Link>
              </Typography>
              <Grid container spacing={1}>
                {trainee.skills.map((skill, idx) => (
                  <Grid item xs={6} sm={3} md={2} key={idx}>
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

export default AllTraineesSkills;
