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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputLabel from '@mui/material/InputLabel';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FormTemplatePage = () => {
  const { formId } = useParams();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/forms/${formId}`);
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
  }, [formId, baseUrl]);

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

  const formUpdateAPI = async () => {
    try {
        const response = await axios.put(
            `${baseUrl}/api/v1/forms/${formId}`,
            formData,
            { headers: { "Content-Type": "application/json" } }  
          );
      if (response.status === 200) {
        console.log("Form updated successfully");
        console.log(formData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    formUpdateAPI();
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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, m: 6, width: "70%", maxWidth: 1000 }}>
     <Button sx={{ pb: 4 }}  onClick={() => {
              navigate(`/form-templates/`);
            }} startIcon={<ArrowBackIcon />}>
        Back to Forms
      </Button>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("title", { required: true })}
            label="Form Title"
            value={formData.title}
            error={!!errors.title}
            helperText={errors.title?.message || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            fullWidth
          />
          <TextField
            {...register("description", { required: true })}
            label="Description"
            value={formData.description}
            error={!!errors.description}
            helperText={errors.description?.message || ""}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            fullWidth
          />
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
      </Paper>
    </div>
  );
};

export default FormTemplatePage;
