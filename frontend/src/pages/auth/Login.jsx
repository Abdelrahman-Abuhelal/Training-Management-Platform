import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NavLink } from 'react-router-dom';
import "../style/Login.css";
import { useAuth } from "../../provider/authProvider";

const Login = () => {
  const navigate = useNavigate();
  const { setUserData } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_PORT_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.length || !password.length) {
      setError("Please enter both email and password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }



  await axios.post(`${baseUrl}/api/v1/auth/login`, {
        email,
        password,
      }).then((response) => {
        if (response.status === 200) {
          setError("");
          setUserData(response.data);  
          navigate("/", { replace: true });
        }
        else if(response.status === 401){
          setError("Invalid email or password");
        }
        else{
          setError(response.data.message || "Login failed");
        }
      }).catch((error) => {
        setError("Login failed" );
        console.error("Login failed:", error);
      });

  };

  return (
    <div className="login-container">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="/EXALT_LOGO.png" // Replace with your logo image
            alt="Exalt Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <div>
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
            </div>
            <br />
            <div>
              <div className="mt-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow-sm block w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-indigo-500 focus:ring-width-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <NavLink style={{ float: "right" , paddingBottom:10, paddingTop:5}} to="/forgot-password-email">Forgot Password?</NavLink>

            <br /> 
            <br />

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Login
            </button>
            {error && <p className="alert alert-warning">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
