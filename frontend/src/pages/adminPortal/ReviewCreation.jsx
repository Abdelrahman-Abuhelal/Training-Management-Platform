import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ButtonAppBar from "../../components/admin/NavBar";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

const AdminForm = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "",
    questions: []
  });

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

  const reviewCreationAPI = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/reviews/create-review`,
        JSON.stringify(formData),
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        const reviewMessage = response.data;
        console.log(reviewMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    reviewCreationAPI();
    setFormData({
      title: "",
      description: "",
      targetAudience: "",
      questions: []
    });
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
          <IconButton onClick={() => handleRemoveOption(questionIndex, optionIndex)}>
            <DeleteIcon />
          </IconButton>
        </div>
      )
    );
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "70%", maxWidth: "1000px" }}>
          <span style={{padding:"5px", display: "flex", fontSize: "20px", alignItems: "center", justifyContent: "center", fontWeight: "bold",fontFamily:"cursive" }}>Review Form Creation</span>
          <br />
          <div>
            <TextField
              {...register("title", { required: true })}
              label="Review Title"
              error={!!errors.title}
              helperText={errors.title?.message || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 ,}}
              fullWidth
            />
          </div>
          <br />
          <div>
            <TextField 
              {...register("description", { required: true })}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message || ""}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              fullWidth
            />
          </div>
          <br />
          <div>
            <FormControl sx={{ width: "100%", marginBottom: 2 }} onClick={(event) => event.stopPropagation()}>
              <InputLabel id="target-audience-label">Target Audience</InputLabel>
              <Select
                {...register("targetAudience", { required: true })}
                labelId="target-audience-label"
                id="target-audience"
                name="targetAudience"
                label="Target Audience"
                value={formData.targetAudience || ""}
                error={!!errors.targetAudience}
                helperText={errors.targetAudience?.message || ""}
                onChange={handleInputChange}
                sx={{ marginBottom: 2, width: "40%" }}
              >
                <MenuItem value="trainees">Trainees</MenuItem>
                <MenuItem value="supervisors">Supervisors</MenuItem>
                <MenuItem value="admins">Admins</MenuItem>
              </Select>
            </FormControl>
          </div>
          <br />
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
                sx={{ marginBottom: 2, width: "70%" }}
              />
              <FormControl sx={{ marginBottom: 2, width: "70%" }}>
                <InputLabel id={`question-type-label-${questionIndex}`}>Type of Question</InputLabel>
                <Select
                  labelId={`question-type-label-${questionIndex}`}
                  id={`question-type-${questionIndex}`}
                  label='Type of Question'
                  value={question.type}
                  onChange={(e) => {
                    const updatedQuestions = [...formData.questions];
                    updatedQuestions[questionIndex].type = e.target.value;
                    setFormData({ ...formData, questions: updatedQuestions });
                  }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="one-answer-selection">One Answer Selection</MenuItem>
                  <MenuItem value="multiple-answer-selection">Multiple Answer Selection</MenuItem>
                </Select>
              </FormControl>
              {question.type !== "text" && renderOptions(questionIndex)}
              {question.type !== "text" && <Button onClick={() => handleAddOption(questionIndex)}>Add Option</Button>}
              <IconButton onClick={() => handleRemoveQuestion(questionIndex)}>
                <DeleteIcon />
              </IconButton>
              <br />
              <br />
              <br />
            </div>
          ))}
          <Button onClick={handleAddQuestion}>Add Question</Button>
          <Button type="submit" disabled={errors.length > 0}>Create Form</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
