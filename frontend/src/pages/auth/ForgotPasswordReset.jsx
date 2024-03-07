import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { NavLink } from 'react-router-dom';

const ForgotPasswordReset = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [NotMatchedPasswrodAlert, setNotMatchedPasswrodAlert] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

      // Input validation (enhanced with clear messages)
      if (!newPassword || newPassword.trim() === "") {
        setShowSuccessAlert(false);
        setNotMatchedPasswrodAlert(false);
        setPasswordError("Password cannot be empty. Please enter a new password.");
        return false;
      }

      if (newPassword !== confirmationPassword) {
        setPasswordError("");
        setShowSuccessAlert(false);
        setNotMatchedPasswrodAlert(true);
        setPasswordError("Passwords do not match. Please re-enter the same password in both fields.");
        return false;
      }

      if (!passwordRegex.test(newPassword)) {
        setNotMatchedPasswrodAlert(false);
        setShowSuccessAlert(false);
        setPasswordError(
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long."
        );
        return false;
      }

      const response = await axios.put(
        `${baseUrl}/api/v1/auth/forgot-password-reset`,
        {
          newPassword,
          confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.status === 200) {
        setShowSuccessAlert(true);
        setPasswordError("");
        setNotMatchedPasswrodAlert(false);
        console.log("Password reset successfully:", response.data);
      } else {
        setShowSuccessAlert(false);
        setPasswordError(
          "An error occurred while resetting your password. Please try again later."
        );
      }
    } catch (error) {
      setShowSuccessAlert(false);
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="forgot-password-reset-container">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="/EXALT_LOGO.png" 
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset Your Password
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="mt-2">
                <input
                  type="password"
                  placeholder="password"
                  className="shadow-sm block w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-width-1"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <br />
  
              <div>
                <div className="mt-2">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="shadow-sm block w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-width-1"
                    value={confirmationPassword}
                    onChange={(e) => setConfirmationPassword(e.target.value)}
                  />
                </div>
              </div>
              <NavLink style={{ float: "right", paddingBottom:10, paddingTop:5 }} to="../">Back to Login?</NavLink>
              <br />
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                type="submit"
              >
                Submit
              </button>
              {NotMatchedPasswrodAlert && (
                <div class="alert alert-warning">Passwords don't match</div>
              )}
  
              {passwordError && (
                <div class="alert alert-warning">{passwordError}</div>
              )}
  
              {showSuccessAlert && (
                <div class="alert alert-success">Password has been changed</div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default ForgotPasswordReset;
  
