import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonAppBar from "../../components/trainee/NavBar";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import {
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
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

const ReviewsList = () => {
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        traineeReviews();
      }, []);
    
      const traineeReviews = async () => {
        try {
          const response = await axios.get(`${baseUrl}/api/v1/trainee-operations/my-reviews`);
          if (response.status === 200) {
            setReviews(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
    

      const handleView = (item) => {
        navigate(`/reviews/${item.id}`);
      };


  return (
    <div>
    <TableContainer>
    <Table size="small">
      <TableHead>
        <TableRow>
        <TableCell  variant="head">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Review ID
            </h3>
          </TableCell>
          <TableCell  variant="head">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Review Title
            </h3>
          </TableCell>
          <TableCell  variant="head">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Review Description
            </h3>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reviews.map((item) => (
          <TableRow key={item.id} hover>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>
              <IconButton size="small" onClick={() => handleView(item)} color="primary">
                <ManageAccountsIcon />View Review
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  
   </div> )
}

export default ReviewsList