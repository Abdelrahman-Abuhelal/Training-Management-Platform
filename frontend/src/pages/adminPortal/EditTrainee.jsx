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
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
const EditTrainee = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
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
  const [idNumberError, setIdNumberError] = useState("");
  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [showGradesConfirmation, setShowGradesConfirmation] = useState(false);
  // courses and grades
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [traineeDetailsSnackbarSuccess, setTraineeDetailsSnackbarSuccess] = useState(false);
  const [traineeDetailsSnackbarError, setTraineeDetailsSnackbarError] = useState(false);

  const [gradesSnackbarSuccess, setGradesSnackbarSuccess] = useState(false);
  const [gradesSnackbarError, setGradesSnackbarError] = useState(false);
  const [traineeDetailsSnackbarErrorMessage,setTraineeDetailsSnackbarErrorMessage] = useState("");

  const baseUrl = import.meta.env.VITE_PORT_URL;

  useEffect(() => {
    userData();
    fetchUserData();
    fetchUserCourses();
  }, []);

  const userData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/users/${userId}`
      );
      if (response.status === 200) {
        const userData = response.data;
        setUsername(userData.userUsername);
        setUserFullName(userData.userFirstName + " " + userData.userLastName);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/trainee-info/${userId}`
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
        setExpectedGraduationYear(
          userData.expectedGraduationDate.slice(0, 4) || ""
        );
        setExpectedGraduationMonth(
          userData.expectedGraduationDate.slice(-2) || ""
        );
        setTrainingField(userData.trainingField || "");
        setBranchLocation(userData.branchLocation || "");
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchUserCourses = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/trainees/${userId}/grades`
      );
      if (response.status === 200) {
        const fetchedCourses = response.data;
        console.log("Fetched Courses:", fetchedCourses); //  debugging
  
        // Ensure fetchedCourses is an array before mapping
        if (Array.isArray(fetchedCourses)) {
          setCourses(
            fetchedCourses.map((course) => ({
              course: course.type,
              grade: course.mark,
            }))
          );
          setSelectedCourses(fetchedCourses.map((course) => course.type));
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
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show confirmation dialog
    if (idNumber.length !== 9) {
      setTraineeDetailsSnackbarError(true);
      setTraineeDetailsSnackbarErrorMessage("ID Number must be 9 digits");
      return;
    }

    if (! /^05\d{8}$/.test(phoneNumber)) {
      setTraineeDetailsSnackbarError(true);
      setTraineeDetailsSnackbarErrorMessage("Phone Number must start with '05' and have 10 digits ");
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
    };

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/admin/update-trainee/${userId}`,
        formData
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

  const handleAcademicGradesSubmit = (e) => {
    e.preventDefault();

    //  if any course has an invalid grade
    const invalidGrade = courses.some((course) => {
      return course.grade === "" || course.grade < 60 || course.grade > 100;
    });

    if (invalidGrade) {
      setGradesSnackbarError(true);
      return;
    }

    setShowGradesConfirmation(true);
  };

  const handleMonthChange = (e) => {
    setExpectedGraduationMonth(e.target.value);
    updateExpectedGraduationDate(e.target.value, expectedGraduationYear);
  };

  const handleYearChange = (e) => {
    setExpectedGraduationYear(e.target.value);
    updateExpectedGraduationDate(expectedGraduationMonth, e.target.value);
  };

  const updateExpectedGraduationDate = (month, year) => {
    if (month && year) {
      const formattedMonth = month.length === 1 ? `0${month}` : month;
      setExpectedGraduationDate(`${year}-${formattedMonth}`);
    }
  };

  const navigateBack = () => {
    navigate(`/trainees`);
  };

  const academicGradesAPI = async () => {
    try {
      const finalCoursesObject = courses.reduce((acc, course) => {
        acc[course.course] = course.grade;
        return acc;
      }, {});

      await axios.put(
        `${baseUrl}/api/v1/admin/trainees/${userId}/grades`,
        finalCoursesObject
      );

      console.log("Grades updated successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCourseChange = (index, e) => {
    const value = e.target.value;
    if (value === "") {
      return;
    }
    const updatedCourses = [...courses];
    updatedCourses[index].course = value;

    // Remove the course type from selectedCourses if it exists
    const filteredSelectedCourses = selectedCourses.filter(
      (course) => course !== value
    );
    setSelectedCourses(filteredSelectedCourses);

    // Add the new selected course type
    if (!filteredSelectedCourses.includes(value)) {
      setSelectedCourses([...filteredSelectedCourses, value]);
    }

    setCourses(updatedCourses);
  };

  const handleGradeChange = (index, value) => {
    if (value === "") {
      return;
    }
    const updatedCourses = [...courses];
    updatedCourses[index].grade = value;
    setCourses(updatedCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { course: "", grade: "" }]);
  };

  const removeCourse = (index) => {
    const updatedCourses = [...courses];
    const removedCourse = updatedCourses.splice(index, 1)[0];
    const filteredSelectedCourses = selectedCourses.filter(
      (course) => course !== removedCourse.course
    );
    setSelectedCourses(filteredSelectedCourses);
    setCourses(updatedCourses);
  };

  const handleConfrimGrades = async (e) => {
    e.preventDefault();
    setShowGradesConfirmation(false);

    if (courses.length === 0) {
      console.error("No courses to submit");
      return;
    }
    courses.map((course) => {
      if (course.course === "" || course.grade === "") {
        setGradesSnackbarError(true); // Display error Snackbar
        return;
      }
      if (course.grade < 60 || course.grade > 100) {
        setGradesSnackbarError(true); // Display error Snackbar
        return;
      }
    });

    try {
      await academicGradesAPI();
      setGradesSnackbarSuccess(true); // Display success Snackbar
      console.log("Courses and Grades:", courses);
    } catch (error) {
      console.error("Error:", error);
      setGradesSnackbarError(true); // Display error Snackbar
    }
  };

  // const handleSelectChange = (e) => {
  //   const value = e.target.value;
  //   if (selectedCourses.includes(value)) {
  //     alert("You've already selected this course.");
  //     e.target.value = '';
  //   } else {
  //     setSelectedCourses([...selectedCourses, value]);
  //   }
  // };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{
          marginBottom: "1rem",
          marginTop: "1rem",
          color: "#1976D2",
        }}
      >
        {" "}
        Edit Trainee Profile
      </Typography>

      <Button onClick={navigateBack} startIcon={<ArrowBackIcon />}>
        Back to Trainees
      </Button>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth>
          <Typography align="center" variant="h6" gutterBottom>
            {userFullName} Profile
          </Typography>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled
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
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel>Nearest City</InputLabel>
              <Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                label="Nearest City"
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
            />
          </Box>

          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel>ID Type</InputLabel>
              <Select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                label="ID type"
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
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              label="Phone Number starts with '05'"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Box>

          <Box mb={2}>
            <FormControl fullWidth>
              <InputLabel>University Name</InputLabel>
              <Select
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                label="University Name"
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
                  onChange={handleYearChange}
                  label="Graduation Year Date (expected)"
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
                  onChange={handleMonthChange}
                  label="Graduation Month Date (expected)"
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
            <Button fullWidth type="submit" variant="contained" color="primary">
              Save Details
            </Button>
          </Box>
        </FormControl>
      </form>

      <form
        onSubmit={handleAcademicGradesSubmit}
        style={{ paddingTop: "40px", paddingBottom: "80px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" gutterBottom>
              Academic Courses and Grades
            </Typography>
          </Grid>
          {courses.map((course, index) => (
            <Grid item xs={12} key={index}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <InputLabel id={`course-label-${index}`}>
                      Select Course
                    </InputLabel>
                    <Select
                      labelId={`course-label-${index}`}
                      id={`course-select-${index}`}
                      label={`course-label-${index}`}
                      value={course.course}
                      onChange={(e) => handleCourseChange(index, e)}
                      fullWidth
                    >
                      <MenuItem value="">Select Course</MenuItem>
                      <MenuItem
                        value="TAWJEEHI"
                        disabled={selectedCourses.includes("TAWJEEHI")}
                      >
                        Tawjeehi
                      </MenuItem>
                      <MenuItem
                        value="UNIVERSITY_GPA"
                        disabled={selectedCourses.includes("UNIVERSITY_GPA")}
                      >
                        University GPA
                      </MenuItem>
                      <MenuItem
                        value="PROGRAMMING_ONE"
                        disabled={selectedCourses.includes("PROGRAMMING_ONE")}
                      >
                        Programming
                      </MenuItem>
                      <MenuItem
                        value="OBJECT_ORIENTED"
                        disabled={selectedCourses.includes("OBJECT_ORIENTED")}
                      >
                        Object Oriented
                      </MenuItem>
                      <MenuItem
                        value="DATA_STRUCTURE"
                        disabled={selectedCourses.includes("DATA_STRUCTURE")}
                      >
                        Data Structure
                      </MenuItem>
                      <MenuItem
                        value="DATABASE_ONE"
                        disabled={selectedCourses.includes("DATABASE_ONE")}
                      >
                        Database One
                      </MenuItem>
                      <MenuItem
                        value="DATABASE_TWO"
                        disabled={selectedCourses.includes("DATABASE_TWO")}
                      >
                        Database Two
                      </MenuItem>
                      {/* Add other options here */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    id={`grade-input-${index}`}
                    label="Enter Grade"
                    value={course.grade}
                    onChange={(e) => handleGradeChange(index, e.target.value)}
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

      {/* Confirmation Dialog for Details */}
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
