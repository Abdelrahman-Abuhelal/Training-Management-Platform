
import axios from 'axios';

const baseUrl = import.meta.env.VITE_PORT_URL;

export const fetchFormTemplates = () => {
  return axios.get(`${baseUrl}/api/v1/forms`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching form templates:', error);
      throw error; // Rethrow the error for component to handle
    });
};
