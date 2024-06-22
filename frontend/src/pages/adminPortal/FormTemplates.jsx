import React, { useEffect, useState } from "react";
import { fetchFormTemplates } from "../../apis/forms";
import { useNavigate } from 'react-router-dom';

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";

const FormTemplates = () => {
  const [formTemplates, setFormTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate  = useNavigate();

  const handleViewForm = (formId) => {
    navigate(`/form-templates/${formId}`);
  };

  useEffect(() => {
    fetchFormTemplates()
      .then((data) => {
        setFormTemplates(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // Handle error (e.g., show error message)
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ margin: '2rem auto', maxWidth: '800px' }}>
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          marginBottom: "1rem", // Example of custom margin
        }}
      >
        Form Templates
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Title
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formTemplates.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.title}</TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary"  onClick={() => handleViewForm(form.id)}
                  >
                    View / Update Form
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FormTemplates;
