import React, { useState, useEffect } from "react";
import ButtonAppBar from "../../components/admin/NavBar";
import axios from "axios";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const EditTrainee = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  // user info
  const [username, setUsername] = useState("");
  const [userFullName, setUserFullName] = useState("");
  // trainee info
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
  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [showGradesConfirmation, setShowGradesConfirmation] = useState(false);
  // courses and grades
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const baseUrl = import.meta.env.VITE_PORT_URL;

  useEffect(() => {
    userData();
    fetchUserData();
    fetchUserCourses();
  }, []);

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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/trainee-info/${userId}`
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

  const fetchUserCourses = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/trainees/${userId}/grades`
      );
      if (response.status === 200) {
        const fetchedCourses = response.data;
        setCourses(
          fetchedCourses.map((course) => ({
            course: course.type,
            grade: course.mark,
          }))
        );
        setSelectedCourses(fetchedCourses.map((course) => course.type));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show confirmation dialog
    setShowDetailsConfirmation(true);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    setShowDetailsConfirmation(false);

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
        `${baseUrl}/api/v1/admin/update-trainee/${userId}`,
        formData
      );
      if (response.status === 200) {
        console.log("Data updated by admin: ", response.data);
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    // User cancelled action
    setShowDetailsConfirmation(false);
  };

  const handleCancelGrades = () => {
    // User cancelled action
    setShowGradesConfirmation(false);
  };

  const handleAcademicGradesSubmit = (e) => {
    e.preventDefault();
    setShowGradesConfirmation(true);
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

  const navigateBack = () => {
    navigate(`/trainees`);
  };

  const academicGradesAPI = async () => {
    try {
      const finalCoursesObject = courses.reduce((acc, course) => {
        acc[course.course] = course.grade;
        return acc;
      }, {});

      await axios
        .put(
          `${baseUrl}/api/v1/admin/trainees/${userId}/grades`,
          finalCoursesObject
        )
        .then((response) => {
          if (response.status === 200) {
            console.log("Grades updated successfully");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCourseChange = (index, e) => {
    const value = e.target.value;
    if (value === "") {
      return;
    }
    const updatedCourses = [...courses];
    updatedCourses[index].course = value;

    if (selectedCourses.includes(value)) {
      alert("You've already selected this course.");
      e.target.value = "";
    } else {
      setCourses(updatedCourses);
      setSelectedCourses([...selectedCourses, value]);
    }
  };

  const handleGradeChange = (index, value) => {
    if (value === "") {
      return;
    }
    const updatedCourses = [...courses];
    updatedCourses[index].grade = value;
    setCourses(updatedCourses);
  };

  const addCourse = () => {
    setCourses([...courses, { course: "", grade: "" }]);
  };

  const removeCourse = (index) => {
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses);
  };

  const handleConfrimGrades = (e) => {
    e.preventDefault();
    setShowGradesConfirmation(false);

    if (courses.length === 0) {
      console.error("No courses to submit");
      return;
    }
    courses.map((course) => {
      if (course.course === "" || course.grade === "") {
        alert("Please remove courses with empty fields.");
        return;
      }
      if (course.grade < 60|| course.grade > 100) {
        alert("Grades must be between 60-100 ");
        return;
      }
    });

    academicGradesAPI();
    console.log("Courses and Grades:", courses);
  };

  // const handleSelectChange = (e) => {
  //   const value = e.target.value;
  //   if (selectedCourses.includes(value)) {
  //     alert("You've already selected this course.");
  //     e.target.value = '';
  //   } else {
  //     setSelectedCourses([...selectedCourses, value]);
  //   }
  // };

  return (
    <div>
      <ButtonAppBar />
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
                    <a href="/trainees">Trainees List</a>
                  </li>
                  <li className="breadcrumb-item active">Edit Profile</li>
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
                  <button type="button" onClick={navigateBack}>
                    <ArrowBackIcon />
                    &nbsp;&nbsp;Back to Trainees
                  </button>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    {userFullName} Profile
                  </h2>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-5 ">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Username
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          id="username"
                          autoComplete="username"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-5 ">
                      <label
                        htmlFor="arabicName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Full Name in Arabic (الاسم الرباعي كما في الهوية
                        الشخصية)
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
                      <div className="mt-2">
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
                          type="number"
                          name="IdNumber"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          id="IdNumber"
                          autoComplete="IdNumber"
                          inputmode="numeric"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-5">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone Number
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="phone-number"
                          id="phone-number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <div className="sm:col-span-3">
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
                    <div className="sm:col-span-3">
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

                    <div className="sm:col-span-3">
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
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="submit"
                      className="mr-4 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save Personal Details
                    </button>
                  </div>
                </div>
              </div>
            </form>
            {showDetailsConfirmation && (
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

            <form className="px-4" onSubmit={handleAcademicGradesSubmit}>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h1 className="text-base font-semibold leading-7 text-gray-900 pb-10">
                    Academic Courses and Grades
                  </h1>
                  {courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center w-full justify-between mb-4"
                    >
                      <div className="flex w-full">
                        <select
                          className="w-1/2 mr-4 bg-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={course.course}
                          onChange={(e) => handleCourseChange(index, e)}
                        >
                          <option value="">Select Course</option>
                          <option
                            value="TAWJEEHI"
                            disabled={selectedCourses.includes("TAWJEEHI")}
                          >
                            Tawjeehi
                          </option>
                          <option
                            value="UNIVERSITY_GPA"
                            disabled={selectedCourses.includes(
                              "UNIVERSITY_GPA"
                            )}
                          >
                            University GPA
                          </option>
                          <option
                            value="PROGRAMMING_ONE"
                            disabled={selectedCourses.includes(
                              "PROGRAMMING_ONE"
                            )}
                          >
                            Programming
                          </option>
                          <option
                            value="OBJECT_ORIENTED"
                            disabled={selectedCourses.includes(
                              "OBJECT_ORIENTED"
                            )}
                          >
                            Object Oriented
                          </option>
                          <option
                            value="DATA_STRUCTURE"
                            disabled={selectedCourses.includes(
                              "DATA_STRUCTURE"
                            )}
                          >
                            Data Structure
                          </option>
                          <option
                            value="DATABASE_ONE"
                            disabled={selectedCourses.includes("DATABASE_ONE")}
                          >
                            Database One
                          </option>
                          <option
                            value="DATABASE_TWO"
                            disabled={selectedCourses.includes("DATABASE_TWO")}
                          >
                            Database Two
                          </option>
                          {/* ... other options */}
                        </select>
                        <input
                          className="w-1/2 bg-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          type="text"
                          placeholder="Enter Grade"
                          value={course.grade}
                          onChange={(e) =>
                            handleGradeChange(index, e.target.value)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => removeCourse(index)}
                          className="ml-4 rounded-md px-4 py-2 bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCourse}
                    className="rounded-md px-4 py-2 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add Course
                  </button>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="submit"
                      className="mr-4 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save Academic Grades
                    </button>
                  </div>
                 
                </div>
              </div>
            </form>
            {showGradesConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                      <div className="bg-white p-8 rounded-md shadow-md">
                        <p>Save Academic Grades ?</p>
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={handleConfrimGrades}
                            className="mr-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Yes
                          </button>
                          <button
                            onClick={handleCancelGrades}
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
    </div>
  );
};

export default EditTrainee;
