import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../style/CompleteRegistration.css";

const CompleteRegistration = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [NotMatchedPasswrodAlert, setNotMatchedPasswrodAlert] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
      if (!newPassword || newPassword.trim() === "") {
        setShowSuccessAlert(false);
        setNotMatchedPasswrodAlert(false);
        setPasswordError("Password cannot be empty.");
        return false;
      }

      if (newPassword !== confirmationPassword) {
        setPasswordError("");
        setShowSuccessAlert(false);
        setNotMatchedPasswrodAlert(true);
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

      const response = await axios.post(
        `${baseUrl}/api/v1/auth/complete-registration`,
        {
          newPassword,
          confirmationPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );
      // Handle response as needed
      if (response.status === 200) {
        setShowSuccessAlert(true);
        setPasswordError("");
        setNotMatchedPasswrodAlert(false);
        console.log("User Confirmed Account Successfully:", response.data);
      }
    } catch (error) {
      if(error.response && error.response.status === 404 && error.response.data === "token is not valid"){
        setError("Token is not Valid");
      }
      setShowSuccessAlert(false);
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="complete-registration-container">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="/EXALT_LOGO.png"
            alt="Exalt Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Complete Registration
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="mt-2">
                <input
                  type="password"
                  placeholder="Password"
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
            <NavLink style={{ float: "right", paddingBottom:10, paddingTop:5 }} to="../">Go to Login?</NavLink>
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
              <div class="alert alert-success">Account has been activated</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;
