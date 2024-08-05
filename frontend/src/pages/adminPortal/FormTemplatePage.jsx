import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../provider/authProvider";
import { useMediaQuery, useTheme } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
const FormTemplatePage = () => {
  const { templateId } = useParams();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { login_token } = user;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: []
  });

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/forms/${templateId}`, {
          headers: {
            Authorization: `Bearer ${login_token}`
          }
        });
        const form = response.data;
        setFormData(form);
        setValue("title", form.title);
        setValue("description", form.description);
        setValue("questions", form.questions);
      } catch (error) {
        console.error("Error fetching form details:", error);
      }
    };

    fetchFormDetails();
  }, [templateId, baseUrl]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", type: "text", options: [] }
      ]
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

  const handleOpenDialog = () => {
    setConfirmationDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setConfirmationDialogOpen(false);
  };

  const formUpdateAPI = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/forms/${templateId}`,
        formData, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      })
      if (response.status === 200) {
        setSnackbarOpen(true); // Show snackbar on successful update
        console.log("Form updated successfully");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSubmit = (data) => {
    handleOpenDialog(); // Open confirmation dialog before form submission
  };

  const renderOptions = (questionIndex) => {
    return formData.questions[questionIndex].options.map(
      (option, optionIndex) => (
        <div key={optionIndex}>
          <TextField
            label={`Option ${optionIndex + 1}`}
            value={option}
            onChange={(e) =>
              handleOptionChange(questionIndex, optionIndex, e)
            }
            sx={{ marginBottom: 2, width: "60%",backgroundColor:'#FFF' }}
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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, m: isMobile ? 1 : 6, width: isMobile ? "90%" : "75%", maxWidth: 1100,backgroundColor: theme.palette.background.paper , borderRadius: '1rem' }}>
        <Button variant="contained" sx={{ mb: 4 }} onClick={() => {
          navigate(`/form-templates/`);
        }} startIcon={<ArrowBackIcon />}>
          Back to Forms
        </Button>
        <Typography align="center" variant="h4" gutterBottom mb={'2.5rem'} sx={{color: theme.palette.primary.dark}}>
          <AutoFixHighIcon fontSize="large" sx={{mb:'0.5rem'}} />     Edit Template
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("title", { required: true })}
            label="Form Title"
            value={formData.title}
            error={!!errors.title}
            helperText={errors.title?.message || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: 3,backgroundColor:'#FFF' }}
            fullWidth
          />
          <TextField
            {...register("description", { required: true })}
            label="Description"
            value={formData.description}
            error={!!errors.description}
            helperText={errors.description?.message || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: 3,backgroundColor:'#FFF' }}
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
                sx={{ marginBottom: 3,backgroundColor:'#FFF', width: "100%"  }}
              />
              <FormControl sx={{ marginBottom: 2, width: "100%" ,backgroundColor:'#FFF'}}>
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
                    One Answer Selection
                  </MenuItem>
                  <MenuItem value="multiple-answer-selection">
                    Multiple Answer Selection
                  </MenuItem>
                </Select>
              </FormControl>
              {question.type !== "text" && renderOptions(questionIndex)}
              {question.type !== "text" && (
                <Button onClick={() => handleAddOption(questionIndex)}>
                  Add Option
                </Button>
              )}
              <IconButton
                onClick={() => handleRemoveQuestion(questionIndex)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button onClick={handleAddQuestion} variant="outlined" sx={{ mt: 2 }}>
            Add Question
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, ml: 2 }}
          >
            Update Form
          </Button>
        </form>

        <ConfirmationDialog
          open={confirmationDialogOpen}
          handleClose={handleCloseDialog}
          handleConfirm={formUpdateAPI}
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setSnackbarOpen(false)}
            severity="success"
          >
            Form updated successfully
          </MuiAlert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default FormTemplatePage;


const ConfirmationDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Update</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to update this form?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => {
          handleClose();
          handleConfirm();
        }} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};