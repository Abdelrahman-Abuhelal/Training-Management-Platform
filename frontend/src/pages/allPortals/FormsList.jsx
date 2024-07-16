import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Typography, Button } from "@mui/material";
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import { useAuth } from '../../provider/authProvider';
import DescriptionIcon from '@mui/icons-material/Description'; // Example icon
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for FILLED status
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Icon for NOT FILLED status
import AssignmentIcon from '@mui/icons-material/Assignment';
const FormsList = () => {
    const [forms, setForms] = useState([]);
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;

    const handleViewClick = (row) => {
        localStorage.setItem('selectedForm', JSON.stringify({
            formTitle: row.formTitle,
            formDescription: row.formDescription,
            questions: row.questions,
            status:row.status
        }));
        window.location.href = `/forms/${row.userFormId}`;
    };

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
                    console.log(formsData);
                }
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        };
        fetchForms();
    }, []);

    const columns = [
        {
            field: 'formTitle',
            headerName: 'Name',
            width: 300,
            renderCell: (params) => (
                <div >{params.value.length > 40 ? `${params.value.substring(0, 40)}...` : params.value}</div>
            )
        },
        {
            field: 'formDescription',
            headerName: 'Description',
            width: 300,
            renderCell: (params) => (
                <div >{params.value.length > 40 ? `${params.value.substring(0, 40)}...` : params.value}</div>
            )
        },
        {
            field: 'numberOfQuestions',
            headerName: 'No. Questions',
            width: 150,
            renderCell: (params) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>{params.value}</div>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    {params.value === 'FILLED' ? 
                        <React.Fragment>
                            <CheckCircleIcon style={{ color: 'green' }} />
                            <Typography variant="body2" style={{ marginLeft: '5px' }}>Done</Typography>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <HighlightOffIcon style={{ color: 'red' }} />
                            <Typography variant="body2" style={{ marginLeft: '5px' }}>Not Submitted</Typography>
                        </React.Fragment>
                    }
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => {
                return <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DescriptionIcon />}
                    component={Link}
                    onClick={() => handleViewClick(params.row)}
                >
                    View
                </Button>
                }
            
        }
    ];

    function getRowId(row) {
        return row.userFormId;
      }

      return (
        <Paper elevation={3} style={{ margin: '3rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
            <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <AssignmentIcon sx={{ marginRight: '0.5rem' }} fontSize="large" /> Forms
            </Typography>
            <div style={{ height: 340, width: '100%', backgroundColor: '#ffffff', borderRadius: '5px', overflow: 'hidden' }}>
                <DataGrid
                    rows={forms}
                    columns={columns}
                    pageSize={5}
                    getRowId={getRowId}
                />
            </div>
        </Paper>
    );
};

export default FormsList;
