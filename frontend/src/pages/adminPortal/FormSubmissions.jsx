import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Paper, Typography, } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FeedIcon from '@mui/icons-material/Feed';
dayjs.extend(relativeTime);

const FormSubmissions = () => {
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const [submissions, setSubmissions] = useState([]);
    const { formId } = useParams();
    const { user } = useAuth();
    const { login_token } = user;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate  = useNavigate();
    useEffect(() => {
        axios.get(`${baseUrl}/api/v1/forms/${formId}/submissions`, {
            headers: {
                Authorization: `Bearer ${login_token}`
            }
        })
            .then(response => {
                setSubmissions(response.data);
                console.log(response.data.map(submission => submission.submittedAt));
            })
            .catch(error => console.error(error));
    }, [formId]);


    const navigateBack = () => {
        navigate(`/form-templates/`);
      };

    const columns = [
        { field: 'name', headerName: 'Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'submittedAt', headerName: 'Submission Time', width: 150
    },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => viewFormResponse(params.row.id)}
                    startIcon={  <FormatListNumberedIcon/> }
                >
                    View Response
                </Button>
            ),
        },
    ];
    const rows = submissions.map(submission => {
        let submittedAtDate;
        if (submission.submittedAt) {
            submittedAtDate = new Date(
                submission.submittedAt[0], // year
                submission.submittedAt[1] - 1, // month (0-indexed)
                submission.submittedAt[2], // day
                submission.submittedAt[3], // hour
                submission.submittedAt[4], // minute
                submission.submittedAt[5], // second
                submission.submittedAt[6] / 1000000 // nanosecond to millisecond
            );
        }

        return {
            id: submission.id,
            name: `${submission.firstName} ${submission.lastName}`,
            email: submission.email,
            submittedAt: submittedAtDate ? dayjs(submittedAtDate).fromNow() : 'N/A',
        };
    });

    const viewFormResponse = (id) => {
        // Implement the logic to view the form response for the submission with the given ID
        console.log('View response for submission ID:', id);
        navigate(`/form-templates/${formId}/submissions/${id}`)
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={3} sx={{ p: "3%", m: "3%", width: "75%", maxWidth: 1800 , backgroundColor:'#E1EBEE', borderRadius: '1rem'  }}>
                <Button onClick={navigateBack} startIcon={<ArrowBackIcon />}>
                    Form Templates
                </Button>
                <Typography  className="concert-one-regular" variant='inherit'  component="div" sx={{ flex: isMobile ? '1 1 100%' : '1 2 100%', textAlign:  'center' , marginBottom:"1rem", color: theme.palette.primary.main}}>
                 Form Submissions <FeedIcon fontSize='large'/>
                </Typography>
                <div style={{ height: 400, width: '100%',  backgroundColor:'#fff' }}>
                    <DataGrid sx={{p:'1rem'}} rows={rows} columns={columns} pageSize={5} />
                </div>
            </Paper>
        </div>
    );
};

export default FormSubmissions;
