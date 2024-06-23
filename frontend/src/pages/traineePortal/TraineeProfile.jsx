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
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  FormControl,
  InputLabel
} from "@mui/material";
import axios from "axios";
import "../style/traineeProfile.css";

const TraineeProfile = () => {
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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const baseUrl = import.meta.env.VITE_PORT_URL;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("traineeProfile"));
    console.log("Stored Data:", storedData);
    if (storedData) {
      setFullNameInArabic(storedData.fullNameInArabic || "");
      setPhoneNumber(storedData.phoneNumber || "");
      setIdType(storedData.idType || "");
      setIdNumber(storedData.idNumber || "");
      setAddress(storedData.address || "");
      setCity(storedData.city || "");
      setUniversityName(storedData.universityName || "");
      setUniversityMajor(storedData.universityMajor || "");
      setExpectedGraduationDate(storedData.expectedGraduationDate || "");
      setTrainingField(storedData.trainingField || "");
      setBranchLocation(storedData.branchLocation || "");
    } else {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/trainee-operations/my-profile`
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
        setTrainingField(userData.trainingField || "");
        setBranchLocation(userData.branchLocation || "");
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleIdNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,9}$/.test(value)) {
      setIdNumber(value);
    }
  };

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    if (/^05\d*$/.test(value)) {
      setPhoneNumber(value);
    } else if (value === "" || /^05\d*$/.test(value.slice(0, 3))) {
      setPhoneNumber(value);
    }
  };
  
  const handleConfirm = async (e) => {
    e.preventDefault();
    setShowConfirmation(false);
    if (idNumber.length > 0 && idNumber.length !== 9) {
      setIdNumberError("ID Number must be 9 digits");
    }
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
        `${baseUrl}/api/v1/trainee-operations/update-me`,
        formData
      );
      if (response.status === 200) {
        localStorage.setItem("traineeProfile", JSON.stringify(formData));
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
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
    <Container >
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Trainee Information
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          This page will be shown for HR, remember to add all details.
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
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
          <FormControl fullWidth variant="outlined">
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
            label="Address ( Village / Street name )"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>ID type</InputLabel>
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
            variant="outlined"
            label="ID Number"
            value={idNumber}
            onChange={handleIdNumberChange}
            error={!!idNumberError}
            helperText={idNumberError}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Phone Number starts with '05'"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>University Name</InputLabel>
            <Select
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              label="University Name"
            >
              <MenuItem value=""></MenuItem>
              <MenuItem value="Birzeit">Birzeit University</MenuItem>
              <MenuItem value="Alquds">Alquds University</MenuItem>
              <MenuItem value="Polytechnic">Polytechnic University</MenuItem>
              <MenuItem value="Bethlehem">Bethlehem University</MenuItem>
              <MenuItem value="An-Najah">An-Najah University</MenuItem>
              <MenuItem value="Arab American">Arab American University</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>University Major</InputLabel>
            <Select
              value={universityMajor}
              onChange={(e) => setUniversityMajor(e.target.value)}
              label="University Major"
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
        <Typography variant="h9" component="h2" sx={{pb:2,pl:1}}>Expected Graduation Date</Typography>
          <Box display="flex" justifyContent="space-between">
            <FormControl variant="outlined" style={{ width: "48%" }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={expectedGraduationMonth}
                onChange={handleMonthChange}
                label="Month"
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
            <FormControl variant="outlined" style={{ width: "48%" }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={expectedGraduationYear}
                onChange={handleYearChange}
                label="Year"
              >
                <MenuItem value=""></MenuItem>
                {[...Array(10).keys()].map((i) => (
                  <MenuItem key={i} value={new Date().getFullYear() + i}>
                    {new Date().getFullYear() + i}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
              <MenuItem value="DESIGN_VERIFICATION">Desgin Verification</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
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
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
      <Dialog open={showConfirmation} onClose={handleCancel}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the profile information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TraineeProfile;
