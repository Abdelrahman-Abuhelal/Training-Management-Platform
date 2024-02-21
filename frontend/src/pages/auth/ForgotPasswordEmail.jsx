import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header.jsx";
import "../style/ForgotPasswordEmail.css"; // Replace with your style file

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email){
      setError("Email cannot be empty. Please enter a valid email address.");
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const response = await axios.post(
        `${baseUrl}/api/v1/auth/forgot-password-email`,
        {
            email
        }
      );

      if (response.status === 200) {
        setError("");
        setSuccess(true);
        console.log("Forgot password email sent:", response.data);
      }
      else{
        setError(response.data.message || "Failed ");
      }
    } catch (error) {
      setError(error.response.data.message );
  }
  };

  return (
    <div> <>    < Header />    </>

    <div className="forgot-password-email-container">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="/EXALT_LOGO.png" // Replace with your logo image
            alt="Exalt Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Enter your email address to receive a password reset link.
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm block w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-width-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <br />
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send Reset Link
            </button>
            {error && <p className="alert alert-warning">{error}</p>}
            {success && (
              <p className="alert alert-success">
                Check your email for instructions on resetting your password.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgotPasswordEmail;
