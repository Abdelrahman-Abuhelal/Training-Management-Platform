import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  FormControl,
  Typography,
  RadioGroup,
  Radio,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../provider/authProvider';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FillForm = () => {
  const { formId } = useParams();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [formDisabled, setFormDisabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const storedFormData = localStorage.getItem('selectedForm');
    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);
      setFormData(parsedFormData);
      setAnswers(parsedFormData.questions.map((question) => ({
        questionId: question.id,
        selectedOptionsContent: [],
      })));
      setFormDisabled(parsedFormData.status === "FILLED");
    }
  }, []);

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  const handleInputChange = (event, questionId) => {
    const { value } = event.target;
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOptionsContent: [value] }
          : answer
      )
    );
  };

  const handleOptionChange = (questionId, optionValue) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOptionsContent: [optionValue] }
          : answer
      )
    );
  };

  const handleMultiAnswerOptionChange = (questionId, optionValue, checked) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? {
            ...answer,
            selectedOptionsContent: checked
              ? [...answer.selectedOptionsContent, optionValue]
              : answer.selectedOptionsContent.filter(
                (item) => item !== optionValue
              ),
          }
          : answer
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFieldsFilled = answers.every(
      (answer) => answer.selectedOptionsContent.length > 0
    );

    if (!allFieldsFilled) {
      alert("Please fill all fields before submitting.");
      return;
    }

    setShowDetailsConfirmation(true);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    setShowDetailsConfirmation(false);

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/forms/${formId}/submit`,
        answers, {
        headers: {
          Authorization: `Bearer ${login_token}`,
          'Content-Type': 'application/json'
        }
      }
      );
      if (response.status === 200) {
        console.log("form has been submitted")
        setFormDisabled(true);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setShowDetailsConfirmation(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <TextField
            name={`answer-${question.id}`}
            value={
              answers.find((answer) => answer.questionId === question.id)
                ?.selectedOptionsContent[0] || ""
            }
            onChange={(event) => handleInputChange(event, question.id)}
            fullWidth
            variant="outlined"
            margin="normal"
            multiline
            rows={5}
            required
            disabled={formDisabled}
          />
        );
      case "one-answer-selection":
        return (
          <FormControl component="fieldset" margin="normal" required disabled={formDisabled}>
            <RadioGroup
              value={
                answers.find((answer) => answer.questionId === question.id)
                  ?.selectedOptionsContent[0] || ""
              }
              onChange={(event) =>
                handleOptionChange(question.id, event.target.value)
              }
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "multiple-answer-selection":
        return (
          <FormControl component="fieldset" margin="normal" required disabled={formDisabled}>
            <FormGroup>
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={
                        answers
                          .find((answer) => answer.questionId === question.id)
                          ?.selectedOptionsContent.includes(option) || false
                      }
                      onChange={(event) => {
                        handleMultiAnswerOptionChange(
                          question.id,
                          option,
                          event.target.checked
                        );
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} style={{ margin: '3rem', padding: '1rem', backgroundColor: '#F5F7F8' }}>
      <Button sx={{ mt: "2rem" }} onClick={() => {
        navigate(`/forms/`);
      }} startIcon={<ArrowBackIcon />}>
        Back to Forms
      </Button>
      {formDisabled && (
        <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mb: '1rem' , mr:'2rem'}}>
          <CheckCircleIcon color="success" sx={{ mr: '0.5rem' }} />
          <Typography variant="subtitle1" color="success">
            Form Submitted
          </Typography>
        </Box>
      )}<Paper elevation={3} sx={{ p: 3, m: "2rem" , backgroundColor: '#FFF' }}>
        <Typography className="concert-one-regular" variant='inherit' align="center" gutterBottom sx={{ mb: "2rem" }}>
          <strong>{formData.formTitle}</strong>
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ m: "1rem" }}>
          <strong>Description:</strong> {formData.formDescription}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <form onSubmit={handleSubmit}>
          {formData.questions &&
            formData.questions.map((question, index) => (
              <Box key={index} m={2}>
                <Typography variant="h6">{`Q${index + 1}) ${question.question}`}</Typography>
                {renderQuestion(question)}
              </Box>
            ))}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" type="submit" disabled={formDisabled}>
              Send Form
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate("/forms")}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={showDetailsConfirmation}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to save?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            Yes
          </Button>
          <Button onClick={handleCancel} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Form submitted successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default FillForm;
