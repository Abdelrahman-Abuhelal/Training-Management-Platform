import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ReviewForm = () => {
  const [review, setReview] = useState({
    traineeId: "",
    softSkills: { rating: "", comment: "" },
    programmingSkills: { rating: "", comment: "" },
    teamworkSkills: { rating: "", comment: "" },
    communicationSkills: { rating: "", comment: "" },
    problemSolvingSkills: { rating: "", comment: "" },
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const navigate = useNavigate();
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [userFullName, setUserFullName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleRatingChange = (aspect, value) => {
    setReview({
      ...review,
      [aspect]: { ...review[aspect], rating: value },
    });
  };

  const handleCommentChange = (aspect, value) => {
    setReview({
      ...review,
      [aspect]: { ...review[aspect], comment: value },
    });
  };

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

  useEffect(() => {
    userData();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(baseUrl, review);
      if (response.status === 200) {
        setSnackbarMessage("Review submitted successfully!");
        setOpenSnackbar(true);
        setReview({
          traineeId: "",
          softSkills: { rating: "", comment: "" },
          programmingSkills: { rating: "", comment: "" },
          teamworkSkills: { rating: "", comment: "" },
          communicationSkills: { rating: "", comment: "" },
          problemSolvingSkills: { rating: "", comment: "" },
        });
      }
    } catch (error) {
      setSnackbarMessage("Failed to submit review. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <IconButton
            color="primary"
            onClick={() => {
              navigate(`/my-trainees/`);
            }}
            style={{ marginBottom: "1rem" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom style={{ color: "#1976D2", marginBottom: "1rem" }}>
            Review <span>{username}</span>
          </Typography>

          <Typography variant="h6" gutterBottom style={{ marginTop: "2rem" }}>
            Soft Skills
          </Typography>
          <TextField
            label="Rating (1-10)"
            variant="outlined"
            fullWidth
            name="softSkillsRating"
            value={review.softSkills.rating}
            onChange={(e) => handleRatingChange("softSkills", e.target.value)}
            margin="normal"
            type="number"
            inputProps={{ min: "1", max: "10" }}
          />
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            name="softSkillsComment"
            value={review.softSkills.comment}
            onChange={(e) => handleCommentChange("softSkills", e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
          {/* Add similar fields for other evaluation aspects */}
          {/* Programming Skills */}
          <Typography variant="h6" gutterBottom style={{ marginTop: "2rem" }}>
            Programming Skills
          </Typography>
          <TextField
            label="Rating (1-10)"
            variant="outlined"
            fullWidth
            name="programmingSkillsRating"
            value={review.programmingSkills.rating}
            onChange={(e) =>
              handleRatingChange("programmingSkills", e.target.value)
            }
            margin="normal"
            type="number"
            inputProps={{ min: "1", max: "10" }}
          />
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            name="programmingSkillsComment"
            value={review.programmingSkills.comment}
            onChange={(e) =>
              handleCommentChange("programmingSkills", e.target.value)
            }
            margin="normal"
            multiline
            rows={4}
          />
          {/* Teamwork Skills */}
          <Typography variant="h6" gutterBottom style={{ marginTop: "2rem" }}>
            Teamwork Skills
          </Typography>
          <TextField
            label="Rating (1-10)"
            variant="outlined"
            fullWidth
            name="teamworkSkillsRating"
            value={review.teamworkSkills.rating}
            onChange={(e) =>
              handleRatingChange("teamworkSkills", e.target.value)
            }
            margin="normal"
            type="number"
            inputProps={{ min: "1", max: "10" }}
          />
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            name="teamworkSkillsComment"
            value={review.teamworkSkills.comment}
            onChange={(e) =>
              handleCommentChange("teamworkSkills", e.target.value)
            }
            margin="normal"
            multiline
            rows={4}
          />
          {/* Communication Skills */}
          <Typography variant="h6" gutterBottom style={{ marginTop: "2rem" }}>
            Communication Skills
          </Typography>
          <TextField
            label="Rating (1-10)"
            variant="outlined"
            fullWidth
            name="communicationSkillsRating"
            value={review.communicationSkills.rating}
            onChange={(e) =>
              handleRatingChange("communicationSkills", e.target.value)
            }
            margin="normal"
            type="number"
            inputProps={{ min: "1", max: "10" }}
          />
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            name="communicationSkillsComment"
            value={review.communicationSkills.comment}
            onChange={(e) =>
              handleCommentChange("communicationSkills", e.target.value)
            }
            margin="normal"
            multiline
            rows={4}
          />
          {/* Problem Solving Skills */}
          <Typography variant="h6" gutterBottom style={{ marginTop: "2rem" }}>
            Problem Solving Skills
          </Typography>
          <TextField
            label="Rating (1-10)"
            variant="outlined"
            fullWidth
            name="problemSolvingSkillsRating"
            value={review.problemSolvingSkills.rating}
            onChange={(e) =>
              handleRatingChange("problemSolvingSkills", e.target.value)
            }
            margin="normal"
            type="number"
            inputProps={{ min: "1", max: "10" }}
          />
          <TextField
            label="Comment"
            variant="outlined"
            fullWidth
            name="problemSolvingSkillsComment"
            value={review.problemSolvingSkills.comment}
            onChange={(e) =>
              handleCommentChange("problemSolvingSkills", e.target.value)
            }
            margin="normal"
            multiline
            rows={4}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: "1rem" }}
          >
            Submit Review
          </Button>
        </Paper>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ReviewForm;
