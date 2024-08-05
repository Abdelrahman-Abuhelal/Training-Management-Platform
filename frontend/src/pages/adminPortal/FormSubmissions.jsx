import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
    Paper,
    Typography,
    Button,
    Select,
    List,
    MenuItem,
    FormControl,
} from "@mui/material"; import dayjs from 'dayjs';
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
    const [branchFilter, setBranchFilter] = useState("");
    const theme = useTheme();
    const [selectedBranch, setSelectedBranch] = useState("");
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const filteredSubmissions = submissions.filter((submission) =>
        (branchFilter === "" || submission.branch === branchFilter)
    );


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
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'branch', headerName: 'Branch', width: 180 },
        {
            field: 'submittedAt', headerName: 'Submission Time', width: 150
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
                    startIcon={<FormatListNumberedIcon />}
                >
                    View Response
                </Button>
            ),
        },
    ];
    const rows = filteredSubmissions.map(submission => {
        let submittedAtDate;
        if (submission.submittedAt) {
            submittedAtDate = new Date(submission.submittedAt); // Pass the full string directly
        }

        return {
            id: submission.id,
            name: `${submission.firstName} ${submission.lastName}`,
            email: submission.email,
            branch: submission.branch,
            submittedAt: submittedAtDate ? dayjs(submittedAtDate).fromNow() : 'N/A',
        };
    });


    const viewFormResponse = (id) => {
        // Implement the logic to view the form response for the submission with the given ID
        console.log('View response for submission ID:', id);
        navigate(`/form-templates/${formId}/submissions/${id}`)
    };

    const handleBranchFilterChange = (event) => {
        setBranchFilter(event.target.value);
        setPage(0); // Reset page when branch filter changes
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={3} sx={{ p: "3%", m: "3%", width: "75%", maxWidth: 1800, backgroundColor: theme.palette.background.paper, borderRadius: '1rem' }}>
                <Button  variant='contained' onClick={navigateBack} startIcon={<ArrowBackIcon />}>
                    Form Templates
                </Button>
                <Typography className="concert-one-regular" variant='inherit' component="div" sx={{ flex: isMobile ? '1 1 100%' : '1 2 100%', textAlign: 'center', marginBottom: "1rem", color: theme.palette.primary.dark }}>
                    Form Submissions <FeedIcon fontSize='large' />
                </Typography>
                <FormControl variant="outlined" fullWidth sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '24px', backgroundColor: '#fff',mt:'1rem' 
                    }
                }}>
                    <Select
                        value={branchFilter}
                        onChange={handleBranchFilterChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Branch Filter' }}
                    >
                        <MenuItem value="">
                            <em>All Branches</em>
                        </MenuItem>
                        <MenuItem value="RAMALLAH">Ramallah</MenuItem>
                        <MenuItem value="NABLUS">Nablus</MenuItem>
                        <MenuItem value="BETHELEHEM">Bethlehem</MenuItem>
                    </Select>
                </FormControl>
                <div style={{ height: 400, width: '100%', backgroundColor: '#fff'}}>
                    <DataGrid sx={{ p: '1rem' ,mt:'1rem',borderRadius:'0.5rem'}} rows={rows} columns={columns} pageSize={5} />
                </div>
            </Paper>
        </div>
    );
};

export default FormSubmissions;
