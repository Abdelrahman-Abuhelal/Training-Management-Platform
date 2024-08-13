import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography, Paper,Grid, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useAuth } from "../../provider/authProvider";
import * as XLSX from 'xlsx';
import PdfViewer from '../../components/PdfViewer'; // Import your PDF viewer
import { useTheme } from "@mui/material/styles";
const MyPlans = () => {
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [open, setOpen] = useState(false);
    const [xlsxData, setXlsxData] = useState(null);
    const theme = useTheme();
    useEffect(() => {
        fetchTrainingPlans();
    }, []);

    const fetchTrainingPlans = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/trainee-operations/my-plans`, {
                headers: {
                    Authorization: `Bearer ${login_token}`,
                },
            });
            setTrainingPlans(response.data);
        } catch (error) {
            console.error('Error fetching training plans:', error);
        }
    };

    const handleViewFile = (plan) => {
        setSelectedPlan(plan);
        if (plan.fileName.endsWith('.xlsx')) {
            const workbook = XLSX.read(plan.planFile, { type: 'base64' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            setXlsxData(worksheet);
        }
        setOpen(true);
    };

    const handleDownload = (plan) => {
        const fileData = `data:application/octet-stream;base64,${plan.planFile}`;
        saveAs(fileData, plan.fileName);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedPlan(null);
        setXlsxData(null);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper elevation={3} sx={{ p: 3, m: 3, width: "85%",minHeight:"450px", maxWidth: 1200, backgroundColor: theme.palette.background.paper }}>
                 <Typography variant="h4" gutterBottom>
                My Training Plans
            </Typography>
            <Grid container spacing={2}>
                {trainingPlans.map((plan) => (
                    <Grid item xs={12} sm={6} md={4} key={plan.id}>
                        <Card sx={{backgroundColor:'#fff'}}>
                            <CardContent>
                                <Typography variant="h6">
                                    {plan.fileName}
                                </Typography>
                                <Typography color="textSecondary">
                                    Supervisor ID: {plan.supervisorId}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleViewFile(plan)}>View</Button>
                                <Button size="small" onClick={() => handleDownload(plan)}>Download</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>View Training Plan</DialogTitle>
                <DialogContent>
                    {selectedPlan && selectedPlan.fileName.endsWith('.pdf') && (
                        <PdfViewer file={`data:application/pdf;base64,${selectedPlan.planFile}`} />
                    )}
                    {selectedPlan && selectedPlan.fileName.endsWith('.xlsx') && xlsxData && (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {xlsxData[0].map((cell, index) => (
                                        <TableCell key={index}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {xlsxData.slice(1).map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {/* viewers for other file types like Word */}
                </DialogContent>
            </Dialog>
            </Paper>
        </div>
    );
};

export default MyPlans;
