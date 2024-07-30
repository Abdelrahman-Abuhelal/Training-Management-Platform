import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Dialog,
  Alert,
  DialogActions,
  DialogContent,
  Snackbar,
  Paper,
  DialogTitle,
  FormControl,
  InputLabel
} from "@mui/material";
import axios from "axios";
import "../style/traineeProfile.css";
import { useAuth } from "../../provider/authProvider";

const TraineeProfile = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
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
  const [practiceYear, setPracticeYear] = useState("");
  const [practiceSeason, setPracticeSeason] = useState("");

  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [traineeDetailsSnackbarSuccess, setTraineeDetailsSnackbarSuccess] =
    useState(false);
  const [traineeDetailsSnackbarError, setTraineeDetailsSnackbarError] =
    useState(false);
  const [
    traineeDetailsSnackbarErrorMessage,
    setTraineeDetailsSnackbarErrorMessage,
  ] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);



  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/trainee-operations/my-profile`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
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
        setExpectedGraduationYear(userData.expectedGraduationDate.slice(0, 4) || "");
        setExpectedGraduationMonth(userData.expectedGraduationDate.slice(-2) || "");
        setTrainingField(userData.trainingField || "");
        setBranchLocation(userData.branchLocation || "");
        setPracticeYear(userData.practiceYear || "");
        setPracticeSeason(userData.practiceSeason || "");
        if (userData.fullNameInArabic) {
          setIsSubmitted(true);
        }

      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
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
      practiceYear,
      practiceSeason
    };
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/trainee-operations/update-me`,
        formData, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      }
      );
      if (response.status === 200) {
        setTraineeDetailsSnackbarSuccess(true);
        setIsSubmitted(true);
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setShowDetailsConfirmation(false);
  };
  const getDirection = (text) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'rtl' : 'ltr';
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

  return (
    <div style={{ padding:  "3rem", margin:'1rem' }}>
      <Paper  sx={{ padding: '2rem' , backgroundColor: '#E1EBEE', alignItems:'right'}}>
      <Box mt={1}>
        <Typography variant="h5" gutterBottom>
          Your Inforamtion
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          This page will be shown for HR, remember to add all details.
        </Typography>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box mb={2}  mt={5}>
          <TextField
            fullWidth
            variant="outlined"
            label="Full Name in Arabic (الاسم الرباعي كما في الهوية الشخصية)"
            value={fullNameInArabic}
            onChange={(e) => setFullNameInArabic(e.target.value)}
            inputProps={{ dir: "rtl", lang: "ar" }}
            disabled={isSubmitted}
            sx={{backgroundColor:'#fff'}}
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined" disabled={isSubmitted}
          >
            <InputLabel>Nearest City</InputLabel>
            <Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              label="Nearest City"
              sx={{backgroundColor:'#fff'}}
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{
              style: { direction: getDirection(address) }
            }}
            disabled={isSubmitted}
            sx={{backgroundColor:'#fff'}}
/>
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined" disabled={isSubmitted}
          >
            <InputLabel>ID type</InputLabel>
            <Select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              label="ID type"
              sx={{backgroundColor:'#fff'}}
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
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            error={!!idNumberError}
            helperText={idNumberError}
            inputProps={{ inputMode: "numeric" }}
            disabled={isSubmitted}
            sx={{backgroundColor:'#fff'}}
/>
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Phone Number starts with '05'"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isSubmitted}
            sx={{backgroundColor:'#fff'}}
/>
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined" disabled={isSubmitted}
          >
            <InputLabel>University Name</InputLabel>
            <Select
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              label="University Name"
              sx={{backgroundColor:'#fff'}}
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
          <FormControl fullWidth variant="outlined" disabled={isSubmitted}
          >
            <InputLabel>University Major</InputLabel>
            <Select
              value={universityMajor}
              onChange={(e) => setUniversityMajor(e.target.value)}
              label="University Major"
              sx={{backgroundColor:'#fff'}}
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
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between">
            <FormControl variant="outlined" style={{ width: "48%" }} disabled={isSubmitted}
            >
              <InputLabel>Graduation Year Date (expected)</InputLabel>
              <Select
                value={expectedGraduationYear}
                onChange={handleYearChange}
                label="Graduation Year Date (expected)"
                sx={{backgroundColor:'#fff'}}
              >
                <MenuItem value=""></MenuItem>
                {[...Array(10).keys()].map((i) => (
                  <MenuItem key={i} value={new Date().getFullYear() + i}>
                    {new Date().getFullYear() + i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" style={{ width: "48%" }} disabled={isSubmitted}
            >
              <InputLabel>Graduation Month Date (expected)</InputLabel>
              <Select
                value={expectedGraduationMonth}
                onChange={handleMonthChange}
                label="Graduation Month Date (expected)"
                sx={{backgroundColor:'#fff'}}
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
          <FormControl fullWidth variant="outlined" disabled={isSubmitted}
          >
            <InputLabel>Training Field</InputLabel>
            <Select
              value={trainingField}
              onChange={(e) => setTrainingField(e.target.value)}
              label="Training Field"
              sx={{backgroundColor:'#fff'}}
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
          <FormControl fullWidth variant="outlined" disabled={isSubmitted}
          >
            <InputLabel>Branch Location</InputLabel>
            <Select
              value={branchLocation}
              onChange={(e) => setBranchLocation(e.target.value)}
              label="Branch Location"
              sx={{backgroundColor:'#fff'}}
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
          <Box display="flex" justifyContent="space-between">
            <FormControl variant="outlined" style={{ width: "48%" }} disabled={isSubmitted}
            >
              <InputLabel>Practice Year</InputLabel>
              <Select
                value={practiceYear}
                onChange={setPracticeYear}
                label="Practice Year"
                sx={{backgroundColor:'#fff'}}
              >
                <MenuItem value=""></MenuItem>
                {[...Array(10).keys()].map((i) => (
                  <MenuItem key={i} value={new Date().getFullYear() + i}>
                    {new Date().getFullYear() + i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" style={{ width: "48%" }} disabled={isSubmitted}
            >
              <InputLabel>Practice Season</InputLabel>
              <Select
                value={practiceSeason}
                onChange={setPracticeSeason}
                label="Practice Season"
                sx={{backgroundColor:'#fff'}}
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
          <Button variant="contained" color="primary" type="submit" disabled={isSubmitted}
          >
            Submit
          </Button>
        </Box>
      </form>
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
          Your details have been saved.
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

    </Paper>
    </div>
  );
};

export default TraineeProfile;
