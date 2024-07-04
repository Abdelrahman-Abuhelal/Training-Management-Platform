import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonAppBar from "../../components/trainee/NavBar";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAuth } from "../../provider/authProvider";
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"; // MUI components (or your preferred library)
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const FormsList = () => {
  const { user } = useAuth();
  const { login_token } = user;
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    traineeForms();
  }, []);

  const traineeForms = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/trainee-operations/my-forms`, {
        headers: {
          Authorization: `Bearer ${login_token}`
        }
      });
      if (response.status === 200) {
        setForms(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleView = (item) => {
    navigate(`/forms/${item.id}`);
  };


  return (
    <div>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Form ID
                </h3>
              </TableCell>
              <TableCell variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Form Title
                </h3>
              </TableCell>
              <TableCell variant="head">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Form Description
                </h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleView(item)} color="primary">
                    <ManageAccountsIcon />View Form
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>)
}

export default FormsList