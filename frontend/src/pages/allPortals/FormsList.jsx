import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Typography, Button } from  "@mui/material";
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import { useAuth } from '../../provider/authProvider';
import DescriptionIcon from '@mui/icons-material/Description'; // Example icon

const FormsList = () => {
    const [forms, setForms] = useState([]);
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/users/forms`, {
                    headers: {
                        Authorization: `Bearer ${login_token}`
                    }
                });
                if (response.status === 200) {
                    const formsData = response.data;
                    setForms(formsData);
                }
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };
        fetchForms();
    }, []);

    const columns = [
        {
            field: 'title',
            headerName: 'Name',
            width: 300,
            renderCell: (params) => (
                <div>{params.value.length > 50 ? `${params.value.substring(0, 50)}...` : params.value}</div>
            )
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            renderCell: (params) => (
                <div>{params.value.length > 50 ? `${params.value.substring(0, 50)}...` : params.value}</div>
            )
        },
        {
            field: 'questions',
            headerName: 'Questions',
            width: 150,
            renderCell: (params) => (
                <div>{params.value.length}</div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DescriptionIcon />}
                    component={Link}
                    to={`/forms/${params.row.id}`} // Adjust the URL path as needed
                >
                    View
                </Button>
            )
        }
    ];

    return (
        <Paper elevation={3} style={{margin:'40px', padding: '50px', height: 'auto', width: 'auto'}}>
            <Typography variant="h5" gutterBottom >
                Forms List
            </Typography>
            <div style={{ height: 340, width: '100%' }}>
                <DataGrid
                    rows={forms}
                    columns={columns}
                    pageSize={5}
                    checkboxSelection
                />
            </div>
        </Paper>
    );
};

export default FormsList;
