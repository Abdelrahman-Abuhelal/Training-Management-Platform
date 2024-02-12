import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('SUPER_ADMIN');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
        // validate the email
          setShowErrorAlert(true);
    }
    if (!username) {
        setShowErrorAlert(true);
    }
    if (!firstName) {
        setShowErrorAlert(true);
    }
    if (!lastName) {
        setShowErrorAlert(true);
    }else{
    setShowSuccessAlert(true);
    }



    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const apiKey = import.meta.env.VITE_API_KEY;
      const response = await axios.post(`${baseUrl}/api/v1/admin/create-user`, {
        email,
        username,
        firstName,
        lastName,
        role, 
      }, {
        headers: {
            'API-KEY': apiKey, 
        },
      });

      setSuccess(true);
      setError('');
      console.log('User created successfully:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'An error occurred. Please try again later.');
    }
  };


  return (
    <form onSubmit={handleSubmit}>

    <label htmlFor="email">Email:</label>
    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}  />

    <label htmlFor="username">Username:</label>
    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}  />

    <label htmlFor="firstName">First Name:</label>
    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}  />

    <label htmlFor="lastName">Last Name:</label>
    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}  />

    <label htmlFor="role">Role:</label>
    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}  >
      <option value="SUPER_ADMIN">Admin</option>
        <option value="SUPERVISOR">Supervisor</option>
        <option value="TRAINEE">Trainee</option>
    </select>

    {showErrorAlert  && <p className="p-4 rounded-md bg-red-500 text-white">Please fill all the details</p>}

    {showSuccessAlert &&<p className="p-4 rounded-md bg-green-500 text-white">User created successfully!</p>}

    <button type="submit">Register</button>
  </form>
  );
};

export default RegistrationForm;
