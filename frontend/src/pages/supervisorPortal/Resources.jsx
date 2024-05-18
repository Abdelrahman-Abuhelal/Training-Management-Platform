import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Snackbar } from "@mui/material";
import { useDropzone } from "react-dropzone";
import UploadContainer from "../supervisorPortal/UploadContainer";
import { createTheme, ThemeProvider } from "@mui/material";

const Resources = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("userUsername");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTrainees();
  }, [page, rowsPerPage, searchTerm]);

  const fetchTrainees = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/supervisor/my-trainees`
      );
      if (response.status === 200) {
        const traineeUsers = response.data;
        setTrainees(traineeUsers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewReview = (user) => {
    // Handle view review
  };

  const handleViewProfile = (user) => {
    // Handle view profile
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page when rows per page changes
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setOrderBy(property);
    setSortDirection(isAsc ? "desc" : "asc");
  };

  const handleFileUpload = (files) => {
    setFiles(files);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const theme = createTheme();
  //Change flag to disable dropzone
  const disabled = false;



  const onDrop = (acceptedFiles) => {
    alert(acceptedFiles[0].name);
  };
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    disabled
  });
  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("description", description);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setUploadMessage("Files uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadMessage("Error uploading files. Please try again.");
    }
  };

  return (
    <div style={{ padding: "3rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <TextField
          label="Search username"
          variant="standard"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <ThemeProvider theme={theme}>
      <UploadContainer
        {...getRootProps({
          //+ converts true -> 1, false -> 0
          accepted: +isDragAccept,
          disabled
        })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </UploadContainer>
    </ThemeProvider> 

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
   </div>
  );
};

export default Resources;
