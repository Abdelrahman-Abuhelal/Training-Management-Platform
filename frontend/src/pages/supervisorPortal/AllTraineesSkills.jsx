import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  FormControl,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText
} from "@mui/material";
import { useAuth } from "../../provider/authProvider";
import { Link } from "react-router-dom";
import { useMediaQuery, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const AllTraineesSkills = () => {

  const theme = useTheme();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;

  const [trainees, setTrainees] = useState([]);
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [skillFilter, setSkillFilter] = useState([]);
  const [topicFilter, setTopicFilter] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const proficiencyLevels = {
    GOOD: "#cce7ff", // light blue
    VERY_GOOD: "#99d0ff", // slightly darker blue
    EXCELLENT: "#66b8ff", // medium blue
    EXPERT: "#339fff" // darker blue
  };
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

    // // Filter by topic
    // if (topicFilter) {
    //   filtered = filtered.map(trainee => ({
    //     ...trainee,
    //     skills: trainee.skills.filter(skill => skill.topic === topicFilter)
    //   })).filter(trainee => trainee.skills.length > 0);
    // }

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
        <Typography className="concert-one-regular" align="center" sx={{ color: theme.palette.primary.dark,
          marginBottom: "2rem"
        }} gutterBottom>
           Trainees Experience and Skills <AutoAwesomeIcon sx={{fontSize:'28px'}}/>
        </Typography>
  
        <Box sx={{ mb: 2 }}>
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
          {/* <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
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
          </FormControl> */}
  
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
            <Grid item xs={12} key={index} sx={{  mb: '2rem' }}>
              <Typography className="concert-one-regular" variant='inherit' align="center" component="h3" gutterBottom sx={{ marginBottom: "1rem" }}>
                <Link to={`/view-trainee/${trainee.userId}`} style={{ textDecoration: 'none', color: theme.palette.primary.dark }}>
                  <PersonIcon /> {trainee.traineeName}
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
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
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
                          maxWidth: '100%'
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              {/* Add Divider here to separate trainees */}
              {index < filteredTrainees.length - 1 && <Divider sx={{ }} />} 
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AllTraineesSkills;
