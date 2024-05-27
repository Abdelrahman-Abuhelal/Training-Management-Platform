import React, { useState, useEffect } from "react";
import ButtonAppBar from "../../components/trainee/NavBar";
import axios from "axios";
import { useAuth } from "../../provider/authProvider";
import "../style/traineeProfile.css";

const TraineeProfile = () => {
  const [fullNameInArabic, setFullNameInArabic] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [universityMajor, setUniversityMajor] = useState("");
  const [expectedGraduationMonth, setExpectedGraduationMonth] = useState("");
  const [expectedGraduationYear, setExpectedGraduationYear] = useState("");
  const [expectedGraduationDate, setExpectedGraduationDate] = useState("");
  const [trainingField, setTrainingField] = useState("");
  const [branchLocation, setBranchLocation] = useState("");
  const [idNumberError, setIdNumberError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const baseUrl = import.meta.env.VITE_PORT_URL;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("traineeProfile"));
    console.log("Stored Data:", storedData);
    if (storedData) {
      setFullNameInArabic(storedData.fullNameInArabic || "");
      setPhoneNumber(storedData.phoneNumber || "");
      setIdType(storedData.idType || "");
      setIdNumber(storedData.idNumber || "");
      setAddress(storedData.address || "");
      setCity(storedData.city || "");
      setUniversityName(storedData.universityName || "");
      setUniversityMajor(storedData.universityMajor || "");
      setExpectedGraduationDate(storedData.expectedGraduationDate || "");
      setTrainingField(storedData.trainingField || "");
      setBranchLocation(storedData.branchLocation || "");
    } else {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/trainee-operations/my-profile`
      );
      if (response.status === 200) {
        const userData = response.data;
        setFullNameInArabic(userData.fullNameInArabic || "");
        setPhoneNumber(userData.phoneNumber || "");
        setIdType(userData.idType || "");
        setIdNumber(userData.idNumber || "");
        setAddress(userData.address || "");
        setCity(userData.city || "");
        setUniversityName(userData.universityName || "");
        setUniversityMajor(userData.universityMajor || "");
        setExpectedGraduationDate(userData.expectedGraduationDate || "");
        setTrainingField(userData.trainingField || "");
        setBranchLocation(userData.branchLocation || "");
      } else {
        console.error("Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleIdNumberChange = (e) => {
    const value = e.target.value;
    // Check if the value contains only digits and has length of 9
    if (/^\d{0,9}$/.test(value)) {
      setIdNumber(value);
    }
  };

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value;
    // Check if the value starts with "05" and contains only digits
    if (/^05\d*$/.test(value)) {
      setPhoneNumber(value);
    } else if (value === "" || /^05\d*$/.test(value.slice(0, 3))) {
      // Allow empty input or input that starts with "05"
      setPhoneNumber(value);
    }
  };
  
  const handleConfirm = async (e) => {
    e.preventDefault();

    setShowConfirmation(false);

    if (idNumber.length > 0 && idNumber.length !== 9) {
      setIdNumberError("ID Number must be 9 digits");
    }

    const formData = {
      fullNameInArabic,
      phoneNumber,
      idType,
      idNumber,
      city,
      address,
      universityName,
      universityMajor,
      expectedGraduationDate,
      trainingField,
      branchLocation,
    };

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/trainee-operations/update-me`,
        formData
      );
      if (response.status === 200) {
        localStorage.setItem("traineeProfile", JSON.stringify(formData));
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    // User cancelled action
    setShowConfirmation(false);
  };
  const handleMonthChange = (e) => {
    setExpectedGraduationMonth(e.target.value);
    updateExpectedGraduationDate(e.target.value, expectedGraduationYear);
  };

  const handleYearChange = (e) => {
    setExpectedGraduationYear(e.target.value);
    updateExpectedGraduationDate(expectedGraduationMonth, e.target.value);
  };

  const updateExpectedGraduationDate = (month, year) => {
    if (month && year) {
      const formattedMonth = month.length === 1 ? `0${month}` : month;
      setExpectedGraduationDate(`${year}-${formattedMonth}`);
    }
  };
  return (
    <div style={{ paddingLeft: "280px" }}>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              {/* <h1 className="m-0">Profile</h1>*/}
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="/dashboard">EXALT Training Platform</a>
                </li>
                <li className="breadcrumb-item active">Profile</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          {/* trianing form */}
          <form className="px-4" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Trainee Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This page will be shown for HR, rememeber to add all details.
                </p>
              </div>
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-5 ">
                    <label
                      htmlFor="arabicName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Full Name in Arabic (الاسم الرباعي كما في الهوية الشخصية)
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="arabicName"
                        value={fullNameInArabic}
                        onChange={(e) => setFullNameInArabic(e.target.value)}
                        id="arabicName"
                        autoComplete="arabicName"
                        dir="rtl"
                        lang="ar"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nearest City
                    </label>
                    <select
                      id="city"
                      name="city"
                      autoComplete="city-name"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option value=""></option>
                      <option value="Ramallah">Ramallah</option>
                      <option value="Tulkarm">Tulkarm</option>
                      <option value="Bethlehem">Bethlehem</option>
                      <option value="Nablus">Nablus</option>
                      <option value="Jerusalem">Jerusalem</option>
                      <option value="Jenin">Jenin</option>
                      <option value="Jericho">Jericho</option>
                      <option value="Hebron">Hebron</option>
                      <option value="Qalqilya">Qalqilya</option>
                      <option value="Tubas">Tubas</option>
                      <option value="Salfit">Salfit</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="Address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Address ( Village / Street name )
                    </label>
                    <div className="mt-3">
                      <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        id="address"
                        autoComplete="address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="university"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ID type
                    </label>
                    <div className="mt-2">
                      <select
                        id="idType"
                        name="idType"
                        value={idType}
                        onChange={(e) => setIdType(e.target.value)}
                        autoComplete="ID-Type"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value=""></option>
                        <option value="Westbank">Westbank - ضفة</option>
                        <option value="Jerusalem">Jerusalem - قدس</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="IdNumber"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ID Number
                    </label>
                    <div className="mt-2">
                      <input
                        type="text" // Change type to text to accept 9-digit numbers
                        name="IdNumber"
                        value={idNumber}
                        onChange={handleIdNumberChange}
                        id="IdNumber"
                        autoComplete="IdNumber"
                        inputMode="numeric" // Corrected attribute name
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-5">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number starts with "05"
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="phone-number"
                        id="phone-number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        autoComplete="phone-number"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="university"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      University Name
                    </label>
                    <div className="mt-2">
                      <select
                        id="university"
                        name="university"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        autoComplete="university-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value=""></option>
                        <option value="Al-Quds University">
                          Al-Quds University
                        </option>
                        <option value="Birzeit University">
                          Birzeit University
                        </option>
                        <option value="Bethlehem University">
                          Bethlehem University
                        </option>
                        <option value="Al-Quds Open University">
                          Al-Quds Open University
                        </option>
                        <option value="Arab American University">
                          Arab American University
                        </option>
                        <option value="Hebron University">
                          Hebron University
                        </option>
                        <option value="Ibrahimieh College">
                          Ibrahimieh College
                        </option>
                        <option value="Khodori Institute, Tulkarm">
                          Khodori Institute, Tulkarm
                        </option>
                        <option value="Palestine Ahliya University">
                          Palestine Ahliya University
                        </option>
                        <option value="Palestine Polytechnic University">
                          Palestine Polytechnic University
                        </option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="major"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      University Major
                    </label>
                    <div className="mt-2">
                      <select
                        id="major"
                        name="major"
                        autoComplete="major-name"
                        value={universityMajor}
                        onChange={(e) => setUniversityMajor(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value=""></option>
                        <option value="Computer_Engineering">
                          Computer Engineering
                        </option>
                        <option value="Computer_Science">
                          Computer Science
                        </option>
                        <option value="Information_Technology">
                          Information Technology
                        </option>
                        <option value="Electrical_Engineering">
                          Electrical Engineering
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="graudation-date"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Graduation Date (Expected)
                    </label>
                    <div className="mt-2 flex space-x-2">
                      <select
                        id="graduation-month"
                        name="graduation-month"
                        value={expectedGraduationMonth}
                        onChange={handleMonthChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>
                          Select Month
                        </option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                      <select
                        id="graduation-year"
                        name="graduation-year"
                        value={expectedGraduationYear}
                        onChange={handleYearChange}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>
                          Select Year
                        </option>
                        {[...Array(15)].map((_, index) => (
                          <option key={index} value={2022 + index}>
                            {2022 + index}
                          </option>
                        ))}
                        {/* Add options for years here */}
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="branch"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Training Location
                    </label>
                    <div className="mt-2">
                      <select
                        id="branch"
                        name="branch"
                        autoComplete="branch-name"
                        value={branchLocation}
                        onChange={(e) => setBranchLocation(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value=""></option>
                        <option value="RAMALLAH">Ramallah</option>
                        <option value="BETHLEHEM">Bethlehem</option>
                        <option value="NABLUS">Nablus</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="branch"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Preffered Training Area
                    </label>
                    <div className="mt-2">
                      <select
                        id="field"
                        name="field"
                        value={trainingField}
                        onChange={(e) => setTrainingField(e.target.value)}
                        autoComplete="field-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value=""></option>
                        <option value="BACKEND">Backend</option>
                        <option value="FRONTEND">Frontend</option>
                        <option value="QUALITY_ASSURANCE">
                          Quality Assurance
                        </option>
                        <option value="MOBILE">Mobile Development</option>
                        <option value="DevOps">DevOps</option>
                        <option value="DESIGN_VERIFICATION">
                          Design Verification
                        </option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Details
              </button>
            </div>
          </form>
          {showConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-white p-8 rounded-md shadow-md">
                <p>Are you sure you want to save?</p>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleConfirm}
                    className="mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TraineeProfile;
