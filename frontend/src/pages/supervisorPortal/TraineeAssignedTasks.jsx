import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const TraineeAssignedTasks = ({ traineeId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { user } = useAuth();
  const { login_token } = user;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/traineeTasks/trainees/${traineeId}`, {
            headers: {
              Authorization: `Bearer ${login_token}`,
            },
          });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [traineeId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography className="concert-one-regular" sx={{ mb: '2rem' }} gutterBottom>
        Assigned Tasks <TaskAltIcon/>
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: '#fff' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date Finished</TableCell>
              <TableCell>Task Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Assigned</TableCell>
              <TableCell>Approved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.traineeTaskId}>
                <TableCell>
                  {task.dateFinished ? new Date(task.dateFinished).toLocaleDateString() : "Not Yet"}
                </TableCell>
                <TableCell>{task.taskName}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.dateAssigned).toLocaleDateString()}</TableCell>
                <TableCell>
                  {task.approved ? (
                    <>
                      <CheckCircleOutlineIcon color="success" sx={{mr:'0.2rem'}}/>
                      Yes
                    </>
                  ) : (
                    <>
                      <CancelIcon color="error" sx={{mr:'0.2rem'}} />
                      No
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TraineeAssignedTasks;
