import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../provider/authProvider";
import "../style/traineeProfile.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Select, Button,
  Paper,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMediaQuery, useTheme } from '@mui/material';
import TrineeeCompletedTasks from "./TraineeAssignedTasks";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TraineeResources from "./TraineeResources";

const TraineeProfileView = () => {
  const theme = useTheme();

  const [traineeData, setTraineeData] = useState({
    fullNameInArabic: "",
    city: "",
    address: "",
    idType: "",
    idNumber: "",
    phoneNumber: "",
    universityName: "",
    universityMajor: "",
    expectedGraduationYear: "",
    expectedGraduationMonth: "",
    trainingField: "",
    branchLocation: ""
  });
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { userId } = useParams();
  const { user } = useAuth();
  const { login_token } = user;
  const [userFullName, setUserFullName] = useState("");
  const navigate = useNavigate();

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

  const fetchTraineeData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/trainee-info/${userId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      if (response.status === 200) {
        const userData = response.data;
        setTraineeData(userData);
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    userData();
    fetchTraineeData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTraineeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
        <Box mt={1}>
          <Button onClick={navigateBack} startIcon={<ArrowBackIcon />} variant='contained'>
            Back to Trainees
          </Button>
        </Box>
        <Box mt={4}>
          <Typography className="concert-one-regular"  gutterBottom align="center" mb={3}>
          <AccountCircleIcon sx={{fontSize:'30px',mb:'0.2rem'}}/> {userFullName}
          </Typography>
        </Box>

        <form style={{ paddingBottom: "1rem" }}>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Full Name in Arabic (الاسم الرباعي كما في الهوية الشخصية)"
              value={traineeData.fullNameInArabic}
              name="fullNameInArabic"
              inputProps={{ dir: "rtl", lang: "ar" }}
              onChange={handleChange}
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined" disabled
            >
              <InputLabel>Nearest City</InputLabel>
              <Select
                value={traineeData.city}
                label="Nearest City"
                name="city"
                onChange={handleChange}
                sx={{ backgroundColor: '#fff' }}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="Ramallah">Ramallah</MenuItem>
                <MenuItem value="Tulkarm">Tulkarm</MenuItem>
                <MenuItem value="Bethlehem">Bethlehem</MenuItem>
                <MenuItem value="Nablus">Nablus</MenuItem>
                <MenuItem value="Jerusalem">Jerusalem</MenuItem>
                <MenuItem value="Jenin">Jenin</MenuItem>
                <MenuItem value="Jericho">Jericho</MenuItem>
                <MenuItem value="Hebron">Hebron</MenuItem>
                <MenuItem value="Qalqilya">Qalqilya</MenuItem>
                <MenuItem value="Tubas">Tubas</MenuItem>
                <MenuItem value="Salfit">Salfit</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Address ( Village / Street name )"
              value={traineeData.address}
              name="address"
              onChange={handleChange}
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined" disabled
            >
              <InputLabel>ID type</InputLabel>
              <Select
                value={traineeData.idType}
                label="ID type"
                name="idType"
                onChange={handleChange}
                sx={{ backgroundColor: '#fff' }}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="Westbank">Westbank - ضفة</MenuItem>
                <MenuItem value="Jerusalem">Jerusalem - قدس</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="ID Number"
              value={traineeData.idNumber}
              name="idNumber"
              inputProps={{ inputMode: "numeric" }}
              onChange={handleChange}
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number starts with '05'"
              value={traineeData.phoneNumber}
              name="phoneNumber"
              onChange={handleChange}
              disabled
              sx={{ backgroundColor: '#fff' }}
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined" disabled
            >
              <InputLabel>University Name</InputLabel>
              <Select
                value={traineeData.universityName}
                label="University Name"
                name="universityName"
                onChange={handleChange}
                sx={{ backgroundColor: '#fff' }}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="Al-Quds University">Al-Quds University</MenuItem>
                <MenuItem value="Birzeit University">Birzeit University</MenuItem>
                <MenuItem value="Bethlehem University">Bethlehem University</MenuItem>
                <MenuItem value="Al-Quds Open University">Al-Quds Open University</MenuItem>
                <MenuItem value="Arab American University">Arab American University</MenuItem>
                <MenuItem value="Hebron University">Hebron University</MenuItem>
                <MenuItem value="Ibrahimieh College">Ibrahimieh College</MenuItem>
                <MenuItem value="Khodori Institute, Tulkarm">Khodori Institute, Tulkarm</MenuItem>
                <MenuItem value="Palestine Ahliya University">Palestine Ahliya University</MenuItem>
                <MenuItem value="Palestine Polytechnic University">Palestine Polytechnic University</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined" disabled
            >
              <InputLabel>University Major</InputLabel>
              <Select
                value={traineeData.universityMajor}
                label="University Major"
                name="universityMajor"
                onChange={handleChange}
                sx={{ backgroundColor: '#fff' }}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="Computer_Engineering">Computer Engineering</MenuItem>
                <MenuItem value="Computer_Science">Computer Science</MenuItem>
                <MenuItem value="Information_Technology">Information Technology</MenuItem>
                <MenuItem value="Electrical_Engineering">Electrical Engineering</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mb={2} >
            <Box display="flex" justifyContent="space-between">
              <FormControl variant="outlined" style={{ width: "48%" }} disabled
              >
                <InputLabel>Graduation Year Date (expected)</InputLabel>
                <Select
                  value={traineeData.expectedGraduationYear}
                  label="Graduation Year Date (expected)"
                  name="expectedGraduationYear"
                  onChange={handleChange}
                  sx={{ backgroundColor: '#fff' }}
                >
                  <MenuItem value=""></MenuItem>
                  {[...Array(10).keys()].map((i) => (
                    <MenuItem key={i} value={new Date().getFullYear() + i}>
                      {new Date().getFullYear() + i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" style={{ width: "48%" }} disabled
              >
                <InputLabel>Graduation Month Date (expected)</InputLabel>
                <Select
                  value={traineeData.expectedGraduationMonth}
                  label="Graduation Month Date (expected)"
                  name="expectedGraduationMonth"
                  onChange={handleChange}
                  sx={{ backgroundColor: '#fff' }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="01">January</MenuItem>
                  <MenuItem value="02">February</MenuItem>
                  <MenuItem value="03">March</MenuItem>
                  <MenuItem value="04">April</MenuItem>
                  <MenuItem value="05">May</MenuItem>
                  <MenuItem value="06">June</MenuItem>
                  <MenuItem value="07">July</MenuItem>
                  <MenuItem value="08">August</MenuItem>
                  <MenuItem value="09">September</MenuItem>
                  <MenuItem value="10">October</MenuItem>
                  <MenuItem value="11">November</MenuItem>
                  <MenuItem value="12">December</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined" disabled
            >
              <InputLabel>Training Field</InputLabel>
              <Select
                value={traineeData.trainingField}
                label="Training Field"
                name="trainingField"
                onChange={handleChange}
                sx={{ backgroundColor: '#fff' }}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="BACKEND">Backend</MenuItem>
                <MenuItem value="FRONTEND">Frontend</MenuItem>
                <MenuItem value="QUALITY_ASSURANCE">Quality Assurance</MenuItem>
                <MenuItem value="MOBILE">Mobile Development</MenuItem>
                <MenuItem value="DevOps">DevOps</MenuItem>
                <MenuItem value="DESIGN_VERIFICATION">Desgin Verification</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <FormControl fullWidth variant="outlined" disabled
            >
              <InputLabel>Branch Location</InputLabel>
              <Select
                value={traineeData.branchLocation}
                label="Branch Location"
                name="branchLocation"
                onChange={handleChange}
                sx={{ backgroundColor: '#fff' }}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="RAMALLAH">Ramallah</MenuItem>
                <MenuItem value="NABLUS">Nablus</MenuItem>
                <MenuItem value="BETHLEHEM">Bethlehem</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </form>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
        <TrineeeCompletedTasks traineeId={userId} />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, m: 6, width: "80%", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
        <TraineeResources traineeId={userId} />
      </Paper>
    </div>
  );
};

export default TraineeProfileView;
