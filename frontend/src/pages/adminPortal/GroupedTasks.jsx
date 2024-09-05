import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { useAuth } from "../../provider/authProvider";

const GroupedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { login_token } = user;
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/forms/${formId}`, {
          headers: {
            Authorization: `Bearer ${login_token}`
          }
        });
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Group tasks by 'assignedBy'
  const groupedTasks = tasks.reduce((groups, task) => {
    const { assignedBy } = task;
    if (!groups[assignedBy]) {
      groups[assignedBy] = [];
    }
    groups[assignedBy].push(task);
    return groups;
  }, {});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      {Object.keys(groupedTasks).map((assignedBy) => (
        <Box key={assignedBy} mb={4}>
          <Typography variant="h6" gutterBottom>
            Assigned By: {assignedBy}
          </Typography>
          <Divider />
          {groupedTasks[assignedBy].map((task) => (
            <Card key={task.id} variant="outlined" sx={{ my: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {task.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {task.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default GroupedTasks;
