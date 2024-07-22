import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from 'react-router-dom';
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DrawIcon from '@mui/icons-material/Draw';
import { useMediaQuery, useTheme } from '@mui/material';

const FormBuilder = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate  = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [
      { question: "", type: "text", options: [] },
    ],
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", type: "text", options: [] },
      ],
    });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(questionIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = event.target.value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const formCreationAPI = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/forms/create-form`,
        formData
      );
      if (response.status === 200) {
        const formMessage = response.data;
        console.log(formMessage);
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleConfirm = async (data) => {
    console.log("Form submitted:", data);
    setShowConfirmation(false);
    formCreationAPI();
    setFormData({
      title: "",
      description: "",
      questions: [],
    });
    reset({ title: "", description: "", questions: [] });
  };

  const renderOptions = (questionIndex) => {
    return formData.questions[questionIndex].options.map(
      (option, optionIndex) => (
        <div key={optionIndex}>
          <TextField
            label={`Option ${optionIndex + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
            sx={{ marginBottom: 2, width: "60%" }}
          />
          <IconButton
            onClick={() => handleRemoveOption(questionIndex, optionIndex)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )
    );
  };

  const navigateBack = () => {
    navigate(`/form-templates`);
  };
  const onSubmit = async (data) => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
     
      <Paper elevation={3} sx={{ p: isMobile?2:4, m:isMobile?1: 6, width: isMobile?"90%":"75%", maxWidth: 1100 ,  backgroundColor:'#e6e6fa'}}>
       <Button   onClick={navigateBack} startIcon={<ArrowBackIcon />}>
        Form Templates
      </Button>
        <Typography align="center" variant="h4" gutterBottom>
         EXALT Form Builder <DrawIcon fontSize="large"/>
        </Typography>
        <br />
        <Typography align="center" variant="h6" gutterBottom>
          Create any needed form by filling the required fields.
        </Typography>
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("title", { required: "Title is required" })}
            label="Form Title"
            error={!!errors.title}
            helperText={errors.title?.message}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            fullWidth
          />
          <TextField
            {...register("description", {
              required: "Description is required",
            })}
            label="Description"
            error={!!errors.description}
            helperText={errors.description?.message}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            fullWidth
          />
                  <br />
                  <br />
          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <TextField
                label={`Question ${questionIndex + 1}`}
                value={question.question}
                onChange={(e) => {
                  const updatedQuestions = [...formData.questions];
                  updatedQuestions[questionIndex].question = e.target.value;
                  setFormData({ ...formData, questions: updatedQuestions });
                }}
                sx={{ marginBottom: 2, width: "100%" }}
              />
              <FormControl sx={{ marginBottom: 2, width: "100%" }}>
                <InputLabel id={`question-type-label-${questionIndex}`}>
                  Type of Question
                </InputLabel>
                <Select
                  labelId={`question-type-label-${questionIndex}`}
                  id={`question-type-${questionIndex}`}
                  label="Type of Question"
                  value={question.type}
                  onChange={(e) => {
                    const updatedQuestions = [...formData.questions];
                    updatedQuestions[questionIndex].type = e.target.value;
                    setFormData({ ...formData, questions: updatedQuestions });
                  }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="one-answer-selection">
                    One Selection
                  </MenuItem>
                  <MenuItem value="multiple-answer-selection">
                    Multiple Selections
                  </MenuItem>
                </Select>
              </FormControl>
              {question.type !== "text" && renderOptions(questionIndex)}
              {question.type !== "text" && (
                <Button onClick={() => handleAddOption(questionIndex)}>
                  Add Option
                </Button>
              )}
              <IconButton onClick={() => handleRemoveQuestion(questionIndex)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button onClick={handleAddQuestion} variant="outlined" sx={{ mt: 2 }}>
            Add Question
          </Button>
          <Button type="submit" variant="contained" sx={{ mt: 2, ml:isMobile? 0.5: 2 }}>
            Create Form
          </Button>
        </form>
        <Dialog open={showConfirmation} onClose={handleCancel}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to create this form?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit(handleConfirm)} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            Form has been created successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default FormBuilder;
