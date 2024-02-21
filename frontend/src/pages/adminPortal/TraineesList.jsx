import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonAppBar from "../../components/admin/NavBar";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material"; // MUI components (or your preferred library)
import { CSVLink } from "react-csv";

const traineesList = () => {
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [users, setUsers] = useState([]); 
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    const fetchTrainees = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/trainees`);
        if (response.status === 200) {
          setTrainees(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrainees();
  }, []);

  const handleView = (row) => {
    // Implement your view functionality here, e.g., navigate to a view page
    alert(`View details for ${row.id}`);
  };

  const handleDelete = (row) => {
    // Implement your delete functionality here, e.g., call an API to delete
    alert(`Delete ${row.id}? This action cannot be undone.`);
  };

  return (
    <div>
      <ButtonAppBar />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>phoneNumber</TableCell>
              <TableCell>idNumber</TableCell>
              <TableCell>universityName</TableCell>
              <TableCell>universityMajor</TableCell>
              <TableCell>expectedGraduationDate</TableCell>
              <TableCell>trainingField</TableCell>
              <TableCell>branchLocation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainees.map((trainee) => (
              <TableRow key={trainee.id} hover>
                <TableCell>{trainee.phoneNumber}</TableCell>
                <TableCell>{trainee.idNumber}</TableCell>
                <TableCell>{trainee.universityName}</TableCell>
                <TableCell>{trainee.universityMajor}</TableCell>
                <TableCell>{trainee.expectedGraduationDate}</TableCell>
                <TableCell>{trainee.trainingField}</TableCell>
                <TableCell>{trainee.branchLocation}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleView(trainee)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(trainee)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button variant="contained" color="primary">
          {/* <CSVLink data={generateCSVData()} filename="trainees.csv">
            Export to CSV
          </CSVLink> */}
        </Button>
      </div>
    </div>
  );
};

export default traineesList;
