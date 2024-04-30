import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  FormControl,
  Typography,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
} from "@mui/material";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonAppBar from "../../components/trainee/NavBar";
import { useParams } from "react-router-dom";

const FillReview = () => {
  const { reviewId } = useParams();
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "",
    questions: [],
  });
  const [answers, setAnswers] = useState([]); // State to hold answers

  useEffect(() => {
    const reviewFormById = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/reviews/${reviewId}`
        );
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

    reviewFormById();
  }, [reviewId]);

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

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOptionsContent: [optionIndex] }
          : answer
      )
    );
  };

  const handleMultiAnswerOptionChange = (questionId, newAnswer) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOptionsContent: newAnswer }
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
      const response = await axios.put(
        `${baseUrl}/api/v1/reviews/${reviewId}`,
        { answers }
      );
      if (response.status === 200) {
        console.log("Review updated by admin: ", response.data);
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
          />
        );
      case "one-answer-selection":
        return (
          <FormControl>
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
                  value={String(index)}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "multiple-answer-selection":
        return (
          <FormControl component="fieldset">
            <FormGroup>
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={
                        answers
                          .find((answer) => answer.questionId === question.id)
                          ?.selectedOptionsContent.includes(String(index)) ||
                        false
                      }
                      onChange={(event) => {
                        const selectedIndex = String(index);
                        const currentIndex = answers
                          .find((answer) => answer.questionId === question.id)
                          ?.selectedOptionsContent.indexOf(selectedIndex);
                        const newAnswer = [
                          ...(answers.find(
                            (answer) => answer.questionId === question.id
                          )?.selectedOptionsContent || []),
                        ];

                        if (currentIndex === -1) {
                          newAnswer.push(selectedIndex);
                        } else {
                          newAnswer.splice(currentIndex, 1);
                        }

                        handleMultiAnswerOptionChange(question.id, newAnswer);
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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ width: "75%", maxWidth: "1000px" }}
        >
          <span
            style={{
              padding: 20,
              display: "flex",
              fontSize: "20px",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontFamily: "cursive",
            }}
          >
            Review Form
          </span>
          <br />
          <Typography variant="body1" gutterBottom>
            <span
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                fontFamily: "cursive",
              }}
            >
              Title :&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;
              &nbsp; &nbsp; &nbsp;{" "}
            </span>
            {formData.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <span
              style={{
                fontSize: "17px",
                fontWeight: "bold",
                fontFamily: "cursive",
              }}
            >
              Description :&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{" "}
            </span>{" "}
            {formData.description}
          </Typography>
          <br />
          {formData.questions &&
            formData.questions.map((question, index) => (
              <div key={index}>
                <br />
                <h2 style={{ fontSize: 20, paddingBottom: 10 }}>{`Q${
                  index + 1
                }. ${question.question}`}</h2>
                {renderQuestion(question)}
              </div>
            ))}
          <Button type="submit">Send Review</Button>
        </form>
        {showDetailsConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded-md shadow-md">
              <p>Are you sure you want to save?</p>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleConfirm}
                  className="mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FillReview;
