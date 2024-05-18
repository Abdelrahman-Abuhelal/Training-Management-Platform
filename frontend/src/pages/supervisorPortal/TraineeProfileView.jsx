import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonAppBar from "../../components/trainee/NavBar";
import { useAuth } from "../../provider/authProvider";
import "../style/traineeProfile.css";
import { useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const TraineeProfileView = () => {
  const [traineeData, setTraineeData] = useState({});
  const baseUrl = import.meta.env.VITE_PORT_URL;
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const navigate = useNavigate();

  const userData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/users/${userId}`
      );
      if (response.status === 200) {
        const userData = response.data;
        setUsername(userData.userUsername);
        setUserFullName(userData.userFirstName + " " + userData.userLastName);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchTraineeData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/trainee-info/${userId}`
      );
      if (response.status === 200) {
        const userData = response.data;
        setTraineeData(userData);
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    userData();
    fetchTraineeData();
  }, []);

  return (
    <div style={{ paddingLeft: "280px" }}>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <IconButton
                color="primary"
                onClick={() => {
                  navigate(`/my-trainees/`);
                }}
                style={{ marginBottom: "1rem" }}
              >
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/dashboard">EXALT Training Platform</a>
                </li>
                <li className="breadcrumb-item active">{username} Profile</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          {/* trianing form */}
          <div className="px-4">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <div className="sm:col-span-6 ">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    {userFullName} Personal Information
                  </label>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6 ">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Full Name in Arabic (الاسم الرباعي كما في الهوية الشخصية)
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {traineeData.fullNameInArabic}
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Nearest City
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        {traineeData.city}
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Address ( Village / Street name )
                    </label>
                    <div className="mt-3">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {traineeData.address}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      ID type
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        {traineeData.idType}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      ID Number
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {traineeData.idNumber}
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {traineeData.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      University Name
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        {traineeData.universityName}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      University Major
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                        {traineeData.universityMajor}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Graduation Date (Expected)
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {traineeData.expectedGraduationDate}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Training Location
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {traineeData.branchLocation}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Preffered Training Area
                    </label>
                    <div className="mt-2">
                      <p className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        {traineeData.trainingField}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TraineeProfileView;
