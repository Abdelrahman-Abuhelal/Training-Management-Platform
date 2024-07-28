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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
const AnnouncementForm = () => {
  const [announcement, setAnnouncement] = useState({
    name: "",
    description: "",
    images: [],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <div style={{ display: "flex", justifyContent: "center" }}>
 <Paper elevation={3} sx={{ p: isMobile?'4%': '3%', m: isMobile?'5%':'5%' ,width:isMobile?'90%':'70%', backgroundColor:'#E1EBEE', borderRadius: '1rem'  }}>
      <Typography className="concert-one-regular"  align="center" sx={{color:  theme.palette.primary.main}} variant='inherit' gutterBottom>
        Add Announcement <NotificationAddIcon/>
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Subject"
          name="name"
          value={announcement.name}
          onChange={handleInputChange}
          required
          sx={{backgroundColor:'#fff'}}
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
          sx={{backgroundColor:'#fff'}}
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
    </div>
  );
};

export default AnnouncementForm;
