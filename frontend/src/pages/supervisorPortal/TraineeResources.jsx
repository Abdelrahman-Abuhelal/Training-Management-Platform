import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../provider/authProvider';
import SourceIcon from '@mui/icons-material/Source';

const TraineeResources = ({ traineeId }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/resources/trainees/${traineeId}`, {
                    headers: {
                        Authorization: `Bearer ${login_token}`,
                    },
                });
                setResources(response.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, [traineeId]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography className="concert-one-regular" sx={{ mb: '2rem' }} gutterBottom>
                Assigned Resources <SourceIcon/>
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {resources.map((resource) => (
                    <Grid item key={resource.id} xs={12} sm={6} md={4}>
                        <Card sx={{ backgroundColor: '#fff', minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="div">
                                    {resource.resourceName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {resource.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default TraineeResources;
