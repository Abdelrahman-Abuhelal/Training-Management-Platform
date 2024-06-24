
import axios from 'axios';

const baseUrl = import.meta.env.VITE_PORT_URL;

export const fetchFormTemplatesAPI = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/v1/forms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching form templates:', error);
    throw error; // Rethrow the error for the component to handle
  }
};


export const deleteFormTemplateAPI = async (formId) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/v1/forms/${formId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting this form template:', error);
    throw error; // Rethrow the error for component to handle
  }
};
