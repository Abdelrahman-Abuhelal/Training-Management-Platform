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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from '../../provider/authProvider';

const FillForm = () => {
  const { formId } = useParams();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
  });
  const [answers, setAnswers] = useState([]); 

  useEffect(() => {
    const getFormById = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/forms/${formId}`, {
          headers: {
              Authorization: `Bearer ${login_token}`
          }
      });
        if (response.status === 200) {
          setFormData(response.data);
          console.log(response.data);
          setAnswers(
            response.data.questions.map((question) => ({
              questionId: question.id,
              selectedOptionsContent: [],
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    getFormById();
  }, [formId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowDetailsConfirmation(true);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    setShowDetailsConfirmation(false);

    try {
      console.log(answers);
      const response = await axios.put(
        `${baseUrl}/api/v1/forms/${formId}/submit`,
         answers , {
          headers: {
            Authorization: `Bearer ${login_token}`,
                    'Content-Type': 'application/json'
          }
        }
      );
      if (response.status === 200) {
        console.log("Form updated by admin: ", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setShowDetailsConfirmation(false);
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
/>
        );
      case "one-answer-selection":
        return (
          <FormControl component="fieldset" margin="normal">
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
          <FormControl component="fieldset" margin="normal">
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
    <Container>
      <Paper elevation={3} sx={{ p: 3, m: "3rem" }}>
        <Typography variant="h4" align="center" gutterBottom sx={{mb:"2rem"}}>
        <strong>{formData.title} Form</strong>
        </Typography>
        <Typography variant="h6" gutterBottom sx={{m:"1rem"}}>
        <strong>Description:</strong> {formData.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
        </Typography>
        <Divider sx={{ my: 3 }} />
        <form onSubmit={handleSubmit}>
          {formData.questions &&
            formData.questions.map((question, index) => (
              <Box key={index} m={2}>
                <Typography variant="h6">{`Q${index + 1}) ${
                  question.question
                }`}</Typography>
                {renderQuestion(question)}
              </Box>
            ))}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" type="submit">
              Send Form
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
    </Container>
  );
};

export default FillForm;
