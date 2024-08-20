import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useAuth } from "../../provider/authProvider";
import { useNavigate } from "react-router-dom";
import {
    Grid, Typography, Button,
    Box, Paper
} from '@mui/material';
import SearchComponent from '../../components/Search';
import { useMediaQuery, useTheme } from '@mui/material';
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { BookOpenIcon } from '@heroicons/react/24/outline';
import GroupsIcon from '@mui/icons-material/Groups';

const TraineesInfoList = () => {
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;
    const [trainees, setTrainees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTrainees, setFilteredTrainees] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [traineesDetails, setTraineesDetails] = useState([]);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredTrainees(trainees.filter(trainee =>
            Object.keys(trainee).some(key =>
                String(trainee[key]).toLowerCase().includes(term)
            )
        ));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/admin/trainees-info`, {
                    headers: {
                        Authorization: `Bearer ${login_token}`
                    }
                });
                setTrainees(response.data);
                setFilteredTrainees(response.data); // Set filteredTrainees initially
                const processedData = preprocessTraineeDetails(response.data);
                setTraineesDetails(processedData);
            } catch (error) {
                console.error("Error fetching trainees data", error);
            }
        };

        fetchData();
    }, [baseUrl, login_token]);

    const preprocessTraineeDetails = (data) => {
        return data.map((trainee) => {
            const { copyOfId, ...rest } = trainee;
            return {
                ID: rest.id,
                "Full Name (Arabic)": rest.fullNameInArabic,
                "Phone Number": rest.phoneNumber,
                "ID Type": rest.idType,
                "ID Number": rest.idNumber,
                City: rest.city,
                Address: rest.address,
                "University Name": rest.universityName,
                "University Major": rest.universityMajor,
                "Expected Graduation Date": rest.expectedGraduationDate,
                "Training Field": rest.trainingField,
                "Branch Location": rest.branchLocation,
                "Training Year": rest.trainingYear,
                "Training Season": rest.trainingSeason,
                "Start Training Date": rest.startTrainingDate,
                "End Training Date": rest.endTrainingDate,
                "Bugzella URL": rest.bugzillaURL,
            };
        });
    };


    const columns = [
        {
            field: 'bugzillaURL', headerName: 'Bugzilla', flex: 1, renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noopener noreferrer">
                    {params.value ? 'Link' : 'N/A'}
                </a>
            )
        },
        { field: 'endTrainingDate', headerName: 'End Date', flex: 1 },
        { field: 'startTrainingDate', headerName: 'Start Date', flex: 1 },
        { field: 'trainingYear', headerName: 'Training Year', flex: 1 },
        { field: 'branchLocation', headerName: 'Branch Location', flex: 1.3 },
        { field: 'trainingField', headerName: 'Training Field', flex: 1 },
        { field: 'universityMajor', headerName: 'Major', flex: 1.5 },
        { field: 'universityName', headerName: 'University Name', flex: 1.5 },
        { field: 'city', headerName: 'City', flex: 1 },
        { field: 'phoneNumber', headerName: 'Phone Number', flex: 1.2 },
        {
            field: 'fullNameInArabic',
            headerName: 'Full Name (Arabic)',
            flex: 2.5,
            renderCell: (params) => (
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate(`/edit-trainee/${params.row.userId}`)}
                >
                    {params.value}
                </Button>)
        },
    ];


    const exportToExcel = () => {
        const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        const ws = XLSX.utils.json_to_sheet(traineesDetails);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "TraineesDetails" + fileExtension;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Paper sx={{ padding: 2, marginBottom: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <Typography
                            className="concert-one-regular"
                            variant='inherit'
                            gutterBottom
                            sx={{ color: theme.palette.primary.dark }}
                        >
                            <Box display="flex" alignItems="center">
                                <GroupsIcon fontSize="large" sx={{ marginRight: 1, color: theme.palette.primary.dark }} />
                                Trainees Information
                            </Box>
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} container spacing={2} justifyContent="flex-end" alignItems="center">
                        <Grid item>
                            <SearchComponent searchTerm={searchTerm} onSearchChange={handleSearch} />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={exportToExcel}
                                sx={{
                                    fontSize: "1.0rem",
                                    maxWidth: "12rem",
                                }}
                            >
                                Export As Excel
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ height: 600, width: '100%', padding: 2 }}>
                <DataGrid
                    rows={filteredTrainees.map((trainee, index) => ({ id: index + 1, ...trainee }))}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </Box>
    );
};

export default TraineesInfoList;
