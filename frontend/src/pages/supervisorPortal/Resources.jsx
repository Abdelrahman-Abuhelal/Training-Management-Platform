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

const ResourceUploader = () => {
  const [resource, setResource] = useState({
    name: "",
    description: "",
    files: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResource({ ...resource, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setResource({
      ...resource,
      files: [...resource.files, ...files],
    });
  };

  const handleRemoveFile = (fileToRemove) => {
    setResource({
      ...resource,
      files: resource.files.filter((file) => file !== fileToRemove),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(resource);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, m: 2 }}>
        <Typography variant="h4" gutterBottom style={{ marginBottom: "1rem" }}>
        Add New Resource
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={resource.name}
          onChange={handleInputChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={resource.description}
          onChange={handleInputChange}
          multiline
          rows={4}
          required
        />
        <Box display="flex" alignItems="center" mt={2}>
          <input
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            style={{ display: "none" }}
            id="upload-files"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-files">
            <IconButton color="primary" component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          <Typography>{resource.files.length} Files Selected</Typography>
        </Box>
        <List>
          {resource.files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveFile(file)}
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

export default ResourceUploader;
