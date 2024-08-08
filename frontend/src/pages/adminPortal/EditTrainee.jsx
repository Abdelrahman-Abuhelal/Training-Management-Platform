import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Select,
  Grid,
  MenuItem,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useAuth } from "../../provider/authProvider";

import { useTheme } from '@mui/material';


const EditTrainee = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuth();
  const { login_token } = user;
  // user info
  const [username, setUsername] = useState("");
  const [userFullName, setUserFullName] = useState("");
  // trainee info
  const [fullNameInArabic, setFullNameInArabic] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [universityMajor, setUniversityMajor] = useState("");
  const [expectedGraduationMonth, setExpectedGraduationMonth] = useState("");
  const [expectedGraduationYear, setExpectedGraduationYear] = useState("");
  const [expectedGraduationDate, setExpectedGraduationDate] = useState("");
  const [trainingField, setTrainingField] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  const [bugzillaURL, setBugzillaURL] = useState("");
  const [trainingYear, setTrainingYear] = useState("");
  const [trainingSeason, setTrainingSeason] = useState("");
  const [idNumberError, setIdNumberError] = useState("");

  const [trainingStartMonthDate, setTrainingStartMonthDate] = useState('');
  const [trainingStartDayDate, setTrainingStartDayDate] = useState('');
  const [startTrainingDate, setStartTrainingDate] = useState('');

  const [trainingEndMonthDate, setTrainingEndMonthDate] = useState('');
  const [trainingEndDayDate, setTrainingEndDayDate] = useState('');
  const [endTrainingDate, setEndTrainingDate] = useState('');

  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [showGradesConfirmation, setShowGradesConfirmation] = useState(false);
  // courses and grades
  const [courses, setCourses] = useState([]);
  const [academicGrades, setAcademicGrades] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);


  const [traineeDetailsSnackbarSuccess, setTraineeDetailsSnackbarSuccess] =
    useState(false);
  const [traineeDetailsSnackbarError, setTraineeDetailsSnackbarError] =
    useState(false);
  const [
    traineeDetailsSnackbarErrorMessage,
    setTraineeDetailsSnackbarErrorMessage,
  ] = useState("");
  const [gradesSnackbarSuccess, setGradesSnackbarSuccess] = useState(false);
  const [gradesSnackbarError, setGradesSnackbarError] = useState(false);

  const baseUrl = import.meta.env.VITE_PORT_URL;



  const userData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        const userData = response.data;
        setUsername(userData.userUsername);
        setUserFullName(userData.userFirstName + " " + userData.userLastName);
        console.log("Is Ok")
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };


  const fetchCoursesList = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/courses`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        setCourses(response.data);
        console.log(response.data)
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchCoursesList();
    userData();
    fetchUserData();
    fetchUserAcademicGrades();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/trainee-info/${userId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        const userData = response.data;
        setFullNameInArabic(userData.fullNameInArabic || "");
        setPhoneNumber(userData.phoneNumber || "");
        setIdType(userData.idType || "");
        setIdNumber(userData.idNumber || "");
        setAddress(userData.address || "");
        setCity(userData.city || "");
        setUniversityName(userData.universityName || "");
        setUniversityMajor(userData.universityMajor || "");
        setExpectedGraduationDate(userData.expectedGraduationDate || "");
        setExpectedGraduationYear(userData.expectedGraduationDate ? userData.expectedGraduationDate.slice(0, 4) : "");
        setExpectedGraduationMonth(userData.expectedGraduationDate ? userData.expectedGraduationDate.slice(-2) : "");
        setTrainingField(userData.trainingField || "");
        setBranchLocation(userData.branchLocation || "");
        setTrainingYear(userData.trainingYear || "");
        setTrainingSeason(userData.trainingSeason || "");
        setBugzillaURL(userData.bugzillaURL || "");
        const startTrainingDate = userData.startTrainingDate || "";
        setTrainingStartMonthDate(startTrainingDate ? startTrainingDate.slice(0, 2) : "");
        setTrainingStartDayDate(startTrainingDate ? startTrainingDate.slice(-2) : "");
        const endTrainingDate = userData.endTrainingDate || "";
        setTrainingEndMonthDate(endTrainingDate ? endTrainingDate.slice(0, 2) : "");
        setTrainingEndDayDate(endTrainingDate ? endTrainingDate.slice(-2) : "");
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserAcademicGrades = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/academic-courses/trainees/${userId}`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        const fetchedGrades = response.data;
        console.log("Before mapping Grades:", fetchedGrades);

        if (Array.isArray(fetchedGrades)) {
          setAcademicGrades(
            fetchedGrades.map((academicGrade) => ({
              course: academicGrade.course.name,
              grade: academicGrade.mark
            }))
          );
          console.log("after mapping Grades:", academicGrades);

          const selectedCourses = fetchedGrades.map((academicGrade) => academicGrade.course.name);
          setSelectedCourses(selectedCourses);
        } else {
          console.error("Error: Response data is not an array");
        }
      } else {
        console.error("Fetch Academic Grades Failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching Academic Grades:", error);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && bugzillaURL) {
      window.open(bugzillaURL, '_blank');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show confirmation dialog
    if (idNumber.length !== 9) {
      setTraineeDetailsSnackbarError(true);
      setTraineeDetailsSnackbarErrorMessage("ID Number must be 9 digits");
      return;
    }

    if (!/^05\d{8}$/.test(phoneNumber)) {
      setTraineeDetailsSnackbarError(true);
      setTraineeDetailsSnackbarErrorMessage(
        "Phone Number must start with '05' and have 10 digits "
      );
      return;
    }
    const startDate = new Date(`${trainingYear}-${trainingStartMonthDate}-${trainingStartDayDate}`);
    const endDate = new Date(`${trainingYear}-${trainingEndMonthDate}-${trainingEndDayDate}`);
    console.log(startDate);
    console.log(endDate);

    // Validate that start date is before end date
    if (startDate >= endDate) {
      setTraineeDetailsSnackbarError(true);
      setTraineeDetailsSnackbarErrorMessage("Start Training Date must be before End Training Date");
      return;
    }


    setShowDetailsConfirmation(true);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    setShowDetailsConfirmation(false);

    const formData = {
      fullNameInArabic,
      phoneNumber,
      idType,
      idNumber,
      city,
      address,
      universityName,
      universityMajor,
      expectedGraduationDate,
      trainingField,
      branchLocation,
      trainingYear,
      trainingSeason,
      startTrainingDate,
      endTrainingDate,
      bugzillaURL
    };

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/admin/update-trainee/${userId}`,
        formData, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        console.log("Data updated by admin: ", response.data);
        setTraineeDetailsSnackbarSuccess(true);
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    // User cancelled action
    setShowDetailsConfirmation(false);
  };

  const handleCancelGrades = () => {
    // User cancelled action
    setShowGradesConfirmation(false);
  };



  const handleGraduationMonthChange = (e) => {
    setExpectedGraduationMonth(e.target.value);
    updateExpectedGraduationDate(e.target.value, expectedGraduationYear);
  };

  const handleGraduationYearChange = (e) => {
    setExpectedGraduationYear(e.target.value);
    updateExpectedGraduationDate(expectedGraduationMonth, e.target.value);
  };

  const updateExpectedGraduationDate = (month, year) => {
    if (month && year) {
      const formattedMonth = month.length === 1 ? `0${month}` : month;
      setExpectedGraduationDate(`${year}-${formattedMonth}`);
    }
  };


  const handleTrainingStartMonthChange = (e) => {
    setTrainingStartMonthDate(e.target.value);
    updateTrainingStartDate(e.target.value, trainingStartDayDate);
  };

  const handleTrainingStartDayChange = (e) => {
    setTrainingStartDayDate(e.target.value);
    updateTrainingStartDate(trainingStartMonthDate, e.target.value);
  };

  const updateTrainingStartDate = (month, day) => {
    if (month && day) {
      const formattedMonth = month.length === 1 ? `0${month}` : month;
      const formattedDay = day.length === 1 ? `0${day}` : day;
      setStartTrainingDate(`${formattedMonth}-${formattedDay}`);
    }
  };

  const handleTrainingEndMonthChange = (e) => {
    setTrainingEndMonthDate(e.target.value);
    updateTrainingEndDate(e.target.value, trainingEndDayDate);
  };

  const handleTrainingEndDayChange = (e) => {
    setTrainingEndDayDate(e.target.value);
    updateTrainingEndDate(trainingEndMonthDate, e.target.value);
  };

  const updateTrainingEndDate = (month, day) => {
    if (month && day) {
      const formattedMonth = month.length === 1 ? `0${month}` : month;
      const formattedDay = day.length === 1 ? `0${day}` : day;
      setEndTrainingDate(`${formattedMonth}-${formattedDay}`);
    }
  };


  const navigateBack = () => {
    navigate(`/trainees`);
  };




  const handleCourseChange = (index, e) => {
    const value = e.target.value;
    if (value === "") {
      return;
    }
    const updatedGrades = [...academicGrades];
    updatedGrades[index].course = value;

    const updatedSelectedCourses = [...selectedCourses];
    if (academicGrades[index].course) {
      const oldCourseIndex = updatedSelectedCourses.indexOf(academicGrades[index].course);
      if (oldCourseIndex > -1) {
        updatedSelectedCourses.splice(oldCourseIndex, 1);
      }
    }
    updatedSelectedCourses.push(value);

    setAcademicGrades(updatedGrades);
    setSelectedCourses(updatedSelectedCourses);
  };

  const handleGradeChange = (index, e) => {
    const value = e.target.value;
    if (value === "") {
      return;
    }
    const updatedGrades = [...academicGrades];
    updatedGrades[index].grade = Number(value);
    setAcademicGrades(updatedGrades);
  };

  const addCourse = () => {
    setAcademicGrades([...academicGrades, { course: "", grade: "" }]);
  };

  const removeCourse = (index) => {
    const updatedAcademicGrades = [...academicGrades];
    const removedAcademicGrades = updatedAcademicGrades.splice(index, 1)[0];
    const filteredSelectedCourses = selectedCourses.filter(
      (course) => course !== removedAcademicGrades.course
    );
    setSelectedCourses(updatedSelectedCourses);
    setAcademicGrades(updatedAcademicGrades);
  };

  const handleAcademicGradesSubmit = (e) => {
    e.preventDefault();
    console.log(academicGrades);

    const valid = academicGrades.every((academicGrade) => {
      const grade = Number(academicGrade.grade);
      if (isNaN(grade) || grade < 60 || grade > 100) {
        setGradesSnackbarError(true);
        return false;
      }
      academicGrade.grade = grade;
      return true;
    });

    if (!valid) {
      return;
    }

    setShowGradesConfirmation(true);
  };

  const academicGradesAPI = async () => {
    try {
      const finalAcademicGradeObject = academicGrades.reduce((acc, academicGrade) => {
        acc[academicGrade.course] = Number(academicGrade.grade);
        return acc;
      }, {});
      console.log("Final Academic Grade Object: ", finalAcademicGradeObject);

      await axios.put(
        `${baseUrl}/api/v1/academic-courses/trainees/${userId}`,
        finalAcademicGradeObject, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );

      console.log("Grades updated successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleConfrimGrades = async (e) => {
    e.preventDefault();
    setShowGradesConfirmation(false);


    try {
      await academicGradesAPI();
      setGradesSnackbarSuccess(true); // Display success Snackbar
      console.log("Courses and Grades:", academicGrades);
    } catch (error) {
      console.error("Error:", error);
      setGradesSnackbarError(true); // Display error Snackbar
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text(userFullName + " Details", 14, 20);
    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: [
        ["Username", username],
        ["Full Name", userFullName],
        ["Full Name (Arabic)", fullNameInArabic],
        ["Phone Number", phoneNumber],
        ["ID Type", idType],
        ["ID Number", idNumber],
        ["City", city],
        ["Address", address],
        ["University Name", universityName],
        ["University Major", universityMajor],
        ["Expected Graduation Date", expectedGraduationDate],
        ["Training Field", trainingField],
        ["Branch Location", branchLocation],
      ],
    });

    doc.addPage();
    doc.text("Courses and Grades", 14, 20);
    autoTable(doc, {
      startY: 25,
      head: [["Course", "Grade"]],
      body: academicGrades.map((academicGrade) => [academicGrade.course, academicGrade.grade]),
    });

    doc.save(username + "_Details.pdf");
  };

  return (
    <Container maxWidth="lg">

      <Grid container alignItems="center" spacing={2} sx={{
        marginTop: "0.5rem"
      }}>
        <Grid item>
          <Button onClick={navigateBack} startIcon={<ArrowBackIcon />}>
            Back to Trainees
          </Button>
        </Grid>
        <Grid item xs>
          <Typography
            className="concert-one-regular" variant='inherit' gutterBottom
            align="center"
            sx={{
              color: theme.palette.primary.dark,
              marginTop: "1.5rem"
            }}
          >
            <ManageAccountsIcon fontSize="large" /> Edit Profile
          </Typography>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="right" mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfOutlinedIcon />}
              size="large"
              onClick={generatePDF}
            >
              Export Profile to PDF
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, m: 4, backgroundColor: theme.palette.background.paper }} >
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <Typography sx={{
              marginBottom: "2rem",
              color: theme.palette.primary.dark
            }} align="center" className="concert-one-regular" variant='inherit' gutterBottom>
              {userFullName}
            </Typography>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                variant="outlined"
                label="Full Name in Arabic (الاسم الرباعي كما في الهوية الشخصية)"
                value={fullNameInArabic}
                onChange={(e) => setFullNameInArabic(e.target.value)}
                inputProps={{ dir: "rtl", lang: "ar" }}
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Nearest City</InputLabel>
                <Select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  label="Nearest City"
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
                label="Address (Village / Street name)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>

            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>ID Type</InputLabel>
                <Select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  label="ID type"
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
                label="ID Number"
                variant="outlined"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                error={!!idNumberError}
                helperText={idNumberError}
                inputProps={{ inputMode: "numeric" }}
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Phone Number starts with '05'"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                sx={{ backgroundColor: '#fff' }}
              />
            </Box>

            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>University Name</InputLabel>
                <Select
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  label="University Name"
                  sx={{ backgroundColor: '#fff' }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="Al-Quds University">
                    Al-Quds University
                  </MenuItem>
                  <MenuItem value="Birzeit University">
                    Birzeit University
                  </MenuItem>
                  <MenuItem value="Bethlehem University">
                    Bethlehem University
                  </MenuItem>
                  <MenuItem value="Al-Quds Open University">
                    Al-Quds Open University
                  </MenuItem>
                  <MenuItem value="Arab American University">
                    Arab American University
                  </MenuItem>
                  <MenuItem value="Hebron University">Hebron University</MenuItem>
                  <MenuItem value="Ibrahimieh College">
                    Ibrahimieh College
                  </MenuItem>
                  <MenuItem value="Khodori Institute, Tulkarm">
                    Khodori Institute, Tulkarm
                  </MenuItem>
                  <MenuItem value="Palestine Ahliya University">
                    Palestine Ahliya University
                  </MenuItem>
                  <MenuItem value="Palestine Polytechnic University">
                    Palestine Polytechnic University
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>University Major</InputLabel>
                <Select
                  value={universityMajor}
                  onChange={(e) => setUniversityMajor(e.target.value)}
                  label="University Major"
                  sx={{ backgroundColor: '#fff' }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="Computer_Engineering">
                    Computer Engineering
                  </MenuItem>
                  <MenuItem value="Computer_Science">Computer Science</MenuItem>
                  <MenuItem value="Information_Technology">
                    Information Technology
                  </MenuItem>
                  <MenuItem value="Electrical_Engineering">
                    Electrical Engineering
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between">
                <FormControl variant="outlined" style={{ width: "48%" }}>
                  <InputLabel>Graduation Year Date (expected)</InputLabel>
                  <Select
                    value={expectedGraduationYear}
                    onChange={handleGraduationYearChange}
                    label="Graduation Year Date (expected)"
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
                <FormControl variant="outlined" style={{ width: "48%" }}>
                  <InputLabel>Graduation Month Date (expected)</InputLabel>
                  <Select
                    value={expectedGraduationMonth}
                    onChange={handleGraduationMonthChange}
                    label="Graduation Month Date (expected)"
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
              <FormControl fullWidth variant="outlined">
                <InputLabel>Branch Location</InputLabel>
                <Select
                  value={branchLocation}
                  onChange={(e) => setBranchLocation(e.target.value)}
                  label="Branch Location"
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
            <Box mb={2}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Training Field</InputLabel>
                <Select
                  value={trainingField}
                  onChange={(e) => setTrainingField(e.target.value)}
                  label="Training Field"
                  sx={{ backgroundColor: '#fff' }}
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="BACKEND">Backend</MenuItem>
                  <MenuItem value="FRONTEND">Frontend</MenuItem>
                  <MenuItem value="QUALITY_ASSURANCE">Quality Assurance</MenuItem>
                  <MenuItem value="MOBILE">Mobile Development</MenuItem>
                  <MenuItem value="DevOps">DevOps</MenuItem>
                  <MenuItem value="DESIGN_VERIFICATION">
                    Desgin Verification
                  </MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mb={2}>
              <Box display="flex" justifyContent="space-between">
                <FormControl variant="outlined" style={{ width: "48%" }}
                >
                  <InputLabel>Training Year</InputLabel>
                  <Select
                    value={trainingYear}
                    onChange={(e) => setTrainingYear(e.target.value)}
                    label="Training Year"
                    sx={{ backgroundColor: '#fff' }}
                  >
                    <MenuItem value=""></MenuItem>
                    {[...Array(15).keys()].map((i) => (
                      <MenuItem key={i} value={new Date().getFullYear() + i - 3}>
                        {new Date().getFullYear() + i - 3}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ width: "48%" }}
                >
                  <InputLabel>Training Season</InputLabel>
                  <Select
                    value={trainingSeason}
                    onChange={(e) => setTrainingSeason(e.target.value)}
                    label="Training Season"
                    sx={{ backgroundColor: '#fff' }}
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="Winter">Winter</MenuItem>
                    <MenuItem value="Summer">Summer</MenuItem>
                    <MenuItem value="Autumn">Autumn</MenuItem>
                    <MenuItem value="Spring">Spring</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" gap={2}>
                <Box display="flex" gap={2} style={{ width: "50%" }}>

                  <FormControl variant="outlined" style={{ width: "40%" }}>
                    <InputLabel>Start Training Month</InputLabel>
                    <Select
                      value={trainingStartMonthDate}
                      onChange={handleTrainingStartMonthChange}
                      label="Training Start Month"
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
                  <FormControl variant="outlined" style={{ width: "40%" }}>
                    <InputLabel>Start Training Day</InputLabel>
                    <Select
                      value={trainingStartDayDate}
                      onChange={handleTrainingStartDayChange}
                      label="Training Start Day"
                      sx={{ backgroundColor: '#fff' }}
                    >
                      <MenuItem value=""></MenuItem>
                      {[...Array(31)].map((_, index) => (
                        <MenuItem key={index + 1} value={String(index + 1).padStart(2, '0')}>
                          {index + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box display="flex" gap={2} style={{ width: "50%" }}>

                  <FormControl variant="outlined" style={{ width: "40%" }}>
                    <InputLabel>End Training Month</InputLabel>
                    <Select
                      value={trainingEndMonthDate}
                      onChange={handleTrainingEndMonthChange}
                      label="End Training Month"
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
                  <FormControl variant="outlined" style={{ width: "40%" }}>
                    <InputLabel>End Training Day</InputLabel>
                    <Select
                      value={trainingEndDayDate}
                      onChange={handleTrainingEndDayChange}
                      label="End Training Day"
                      sx={{ backgroundColor: '#fff' }}
                    >
                      <MenuItem value=""></MenuItem>
                      {[...Array(31)].map((_, index) => (
                        <MenuItem key={index + 1} value={String(index + 1).padStart(2, '0')}>
                          {index + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

              </Box>
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                label="Buggzilla URL"
                variant="outlined"
                value={bugzillaURL}
                onChange={(e) => setBugzillaURL(e.target.value)}
                inputProps={{ inputMode: 'url' }}
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiInputBase-root': {
                    textDecoration: 'underline',
                    color: theme.palette.primary.dark,
                    cursor: 'pointer'
                  }
                }}
              />
            </Box>
            <Box mb={2}>
              <Button fullWidth type="submit" variant="contained" color="primary">
                Save Details
              </Button>
            </Box>
          </FormControl>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, m: 4, backgroundColor: theme.palette.background.paper }}>
        <form
          onSubmit={handleAcademicGradesSubmit}
          style={{ paddingBottom: "1rem" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography className="concert-one-regular" variant='inherit' align="center" sx={{ color: theme.palette.primary.dark }} gutterBottom>
                Academic Courses <SchoolIcon fontSize="large" />
              </Typography>
            </Grid>
            {academicGrades.map((academicGrade, index) => (
              <Grid item xs={12} key={index}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Grid item xs={5}>
                    <FormControl fullWidth>
                      <InputLabel>Select Course</InputLabel>
                      <Select
                        value={academicGrade.course}
                        onChange={(e) => handleCourseChange(index, e)}
                        label="Select Course"
                        sx={{ backgroundColor: '#fff' }}
                      >
                        <MenuItem value="">Select Course</MenuItem>
                        {courses.map((c) => (
                          <MenuItem key={c.id} value={c.name} disabled={selectedCourses.includes(c.name)}>
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      id={`grade-input-${index}`}
                      label="Enter Grade"
                      value={academicGrade.grade}
                      onChange={(e) => handleGradeChange(index, e)}
                      sx={{ backgroundColor: '#fff' }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeCourse(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={addCourse}>
                Add Course
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained" color="primary">
                Save Academic Grades
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>


      <Dialog open={showDetailsConfirmation} onClose={handleCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save the details?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Grades */}
      <Dialog open={showGradesConfirmation} onClose={handleCancelGrades}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save the academic grades?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelGrades} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfrimGrades}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={traineeDetailsSnackbarSuccess}
        autoHideDuration={6000}
        onClose={() => setTraineeDetailsSnackbarSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setTraineeDetailsSnackbarSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Trainee details have been saved.
        </Alert>
      </Snackbar>
      <Snackbar
        open={traineeDetailsSnackbarError}
        autoHideDuration={6000}
        onClose={() => setTraineeDetailsSnackbarError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setTraineeDetailsSnackbarError(false);
            setTraineeDetailsSnackbarErrorMessage("");
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          {traineeDetailsSnackbarErrorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={gradesSnackbarSuccess}
        autoHideDuration={6000}
        onClose={() => setGradesSnackbarSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setGradesSnackbarSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Grades saved successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={gradesSnackbarError}
        autoHideDuration={6000}
        onClose={() => setGradesSnackbarError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setGradesSnackbarError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Grades should be between 60-100 only.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditTrainee;