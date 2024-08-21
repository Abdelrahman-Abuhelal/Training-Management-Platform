import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Typography, Button } from "@mui/material";
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import { useAuth } from '../../provider/authProvider';
import DescriptionIcon from '@mui/icons-material/Description'; // Example icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for FILLED status
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Icon for NOT FILLED status
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useMediaQuery, useTheme } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

const FormsList = () => {
    const [forms, setForms] = useState([]);
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;
    const theme = useTheme();

    const handleViewClick = (row) => {
        localStorage.setItem('selectedForm', JSON.stringify({
            formTitle: row.formTitle,
            formDescription: row.formDescription,
            questions: row.questions,
            status: row.status
        }));
        window.location.href = `/forms/${row.userFormId}`;
    };

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/forms`, {
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
            width: 280,
            renderCell: (params) => (
                <div >{params.value.length > 40 ? `${params.value.substring(0, 40)}...` : params.value}</div>
            )
        },
        {
            field: 'formDescription',
            headerName: 'Description',
            width: 250,
            renderCell: (params) => (
                <div >{params.value.length > 40 ? `${params.value.substring(0,40)}...` : params.value}</div>
            )
        },
        {
            field: 'numberOfQuestions',
            headerName: 'No. Questions',
            width: 120,
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
                            <HighlightOffIcon style={{ color:  theme.palette.secondary.main }} />   
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
                    startIcon={<AssignmentIcon />}
                    component={Link}
                    onClick={() => handleViewClick(params.row)}
                >
                    Fill / View
                </Button>
            }

        }
    ];

    function getRowId(row) {
        return row.userFormId;
    }

    return (
        <Paper elevation={3} style={{ margin: '3rem auto', padding: '1rem',backgroundColor: theme.palette.background.paper , width:'80%'}}>
            <Typography  className="concert-one-regular" variant='inherit' gutterBottom 
            sx={{ color: theme.palette.primary.dark}}
            style={{marginBottom: '0.5rem',marginTop:'1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ListAltIcon sx={{ marginRight: '0.5rem' ,mt:'0.3rem',fontSize:'2rem'}}  /> Forms 
            </Typography>
            <div style={{ width: '100%', borderRadius: '5px', overflow: 'hidden' ,p:'1rem'}}>
                <DataGrid
                    rows={forms}
                    columns={columns}
                    pageSize={5}
                    getRowId={getRowId}
                    sx={{backgroundColor: '#ffffff', m:'2rem'}}
                />
            </div>
        </Paper>
    );
};

export default FormsList;
