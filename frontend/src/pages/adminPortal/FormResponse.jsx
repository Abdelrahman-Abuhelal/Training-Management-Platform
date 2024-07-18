import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    List,
    ListItem,
    Button,
    ListItemText,
    Paper
} from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FormResponse = () => {
    const { formId, submissionId } = useParams();
    const baseUrl = import.meta.env.VITE_PORT_URL;
    const { user } = useAuth();
    const { login_token } = user;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [formData, setFormData] = useState(null); // Initialize as null
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormResponseData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/forms/submissions/${submissionId}/response`, {
                    headers: {
                        Authorization: `Bearer ${login_token}`
                    }
                });
                const form = response.data;
                setFormData(form);
            } catch (error) {
                console.error("Error fetching form details:", error);
            }
        };

        fetchFormResponseData();
    }, [submissionId, baseUrl, login_token]);

    if (!formData) {
        return (
            <div>
                <Button sx={{ mt: '3%' }} onClick={() => navigate(`/form-templates/${formId}/submissions`)} startIcon={<ArrowBackIcon />}>
                    Back to Forms
                </Button>
                <Typography variant="h6" component="p">Loading...</Typography>
            </div>
        );
    }

    const convertToLetter = (num) => {
        return String.fromCharCode(97 + num); // converts 0 to 'a', 1 to 'b', etc.
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', marginBottom: '5%' }}>
            <Button sx={{ mt: '3%' }} onClick={() => navigate(`/form-templates/${formId}/submissions`)} startIcon={<ArrowBackIcon />}>
                Back to Forms
            </Button>

            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: '3%' }}>
                {formData.formTitle} Form
            </Typography>
            <Typography variant="body1" gutterBottom>
                {formData.formDescription}
            </Typography>

            {formData.questions && formData.questions.map((question, index) => {
                const answer = formData.answers ? formData.answers.find(a => a.questionId === question.id) : null;
                const selectedOptions = answer ? answer.selectedOptionsContent : [];

                return (
                    <Paper key={question.id} sx={{ mb: 5, mt: 5, p: 2, backgroundColor: 'rgba(240, 240, 240, 0.6)' }}>
                        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                            {index + 1}. {question.question}
                        </Typography>

                        {question.type === 'text' && (
                            <TextField
                                value={selectedOptions[0] || ''}
                                InputProps={{
                                    readOnly: true,
                                    sx: {
                                        backgroundColor: selectedOptions.length > 0 ? 'rgba(0, 255, 0, 0.2)' : 'inherit'
                                    }
                                }}
                                variant="outlined"
                                fullWidth
                            />
                        )}

                        {(question.type === 'multiple-answer-selection' || question.type === 'one-answer-selection') && (
                            <List>
                                {question.options.map((option, optionIndex) => (
                                    <ListItem
                                        key={option}
                                        sx={{
                                            backgroundColor: selectedOptions.includes(option) ? 'rgba(0, 255, 0, 0.2)' : 'inherit',
                                            borderRadius: 1,
                                            mb: 1
                                        }}
                                    >
                                        <ListItemText primary={`${convertToLetter(optionIndex)}) ${option}`} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                );
            })}
        </Box>
    );
};

export default FormResponse;
