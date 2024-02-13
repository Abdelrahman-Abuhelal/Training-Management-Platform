import React, { useState } from "react";
import axios from "axios";
import '../style/CreateUsersForm.css'

const CreateUsersForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("SUPER_ADMIN");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showNotFullDataAlert, setshowNotFullDataAlert] = useState(false);
  const [showError, setShowError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      // validate the email
      setshowNotFullDataAlert(true);
    }
    if (!username) {
      setshowNotFullDataAlert(true);
    }
    if (!firstName) {
      setshowNotFullDataAlert(true);
    }
    if (!lastName) {
      setshowNotFullDataAlert(true);
    }

    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const apiKey = import.meta.env.VITE_API_KEY;
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/create-user`,
        {
          email,
          username,
          firstName,
          lastName,
          role,
        },
        {
          headers: {
            "API-KEY": apiKey,
          },
        }
      );
      if(response.status === 200){
        setshowNotFullDataAlert(false);
        setShowSuccessAlert(true);
        setShowError("");
        console.log("User created successfully:", response.data);
      }else if(response.status === 409){
        setShowError("User with this email or username exists already!");
        setShowSuccessAlert(false);
        setshowNotFullDataAlert(false);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setShowSuccessAlert(false);
      setshowNotFullDataAlert(false);
      setShowError("Error creating user!");
    }
  };

  return (
    <div className="create-users-form-container">
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto"
          src="/EXALT_LOGO.png"
          alt="Exalt Logo"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create New Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>

            <div className="mt-2">
              <input
                type="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="username"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="SUPER_ADMIN">Admin</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="TRAINEE">Trainee</option>
              </select>
            </div>
          </div>
          <br />
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
          {setshowNotFullDataAlert && (
            <div class="alert alert-warning">Please fill all the details</div>
          )}

          {showSuccessAlert && (
            <div class="alert alert-success">User created successfully!</div>
          )}
        </form>
      </div>
    </div>
    </div>
  );
};

export default CreateUsersForm;
