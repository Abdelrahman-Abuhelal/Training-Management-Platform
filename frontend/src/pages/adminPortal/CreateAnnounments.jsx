import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const AnnouncementForm = () => {
  const [announcement, setAnnouncement] = useState({
    name: "",
    description: "",
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement({ ...announcement, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAnnouncement({
      ...announcement,
      images: [...announcement.images, ...files],
    });
  };

  const handleRemoveImage = (imageToRemove) => {
    setAnnouncement({
      ...announcement,
      images: announcement.images.filter((image) => image !== imageToRemove),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(announcement);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Announcement
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={announcement.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={announcement.description}
          onChange={handleInputChange}
          multiline
          rows={4}
          required
        />
        <Box display="flex" alignItems="center" mt={2}>
          <input
            accept=".png, .jpg, .jpeg"
            style={{ display: "none" }}
            id="upload-images"
            multiple
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-images">
            <IconButton color="primary" component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          <Typography>{announcement.images.length} Images Selected</Typography>
        </Box>
        <List>
          {announcement.images.map((image, index) => (
            <ListItem key={index}>
              <ListItemText primary={image.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveImage(image)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default AnnouncementForm;
