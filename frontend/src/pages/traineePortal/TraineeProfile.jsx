import React, { useState,useEffect } from "react";
import ButtonAppBar from "../../components/trainee/NavBar";
import axios from "axios";
import { useAuth } from "../../provider/authProvider";

const TraineeProfile = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [universityMajor, setUniversityMajor] = useState("");
  const [expectedGraduationDate, setExpectedGraduationDate] = useState("");
  const [trainingField, setTrainingField] = useState("");
  const [branchLocation, setBranchLocation] = useState("");

  const baseUrl = import.meta.env.VITE_PORT_URL;

  useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("traineeProfile"));
      console.log("Stored Data:", storedData);
      if (storedData) {
        setPhoneNumber(storedData.phoneNumber || "");
        setIdNumber(storedData.idNumber || ""); 
        setAddress(storedData.address || "");
        setUniversityName(storedData.universityName || "");
        setUniversityMajor(storedData.universityMajor || "");
        setExpectedGraduationDate(storedData.expectedGraduationDate || "");
        setTrainingField(storedData.trainingField || "");
        setBranchLocation(storedData.branchLocation || "");
      }
      else{
        fetchUserData();
      }
    
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/trainee-operations/my-profile`);
      if (response.status === 200) {
        const userData = response.data;
        setPhoneNumber(userData.phoneNumber || "");
        setIdNumber(userData.idNumber || ""); 
        setAddress(userData.address || "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = {
      phoneNumber,
      idNumber,
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
        localStorage.setItem('traineeProfile', JSON.stringify(formData));
      }
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <ButtonAppBar />
      <div>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                {/* <h1 className="m-0">Profile</h1>*/}
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Profile</a>
                  </li>
                  <li className="breadcrumb-item active">Profile v1</li>
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
                    This page will be shown for HR, rememeber to add all
                    details.
                  </p>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Personal Information
                  </h2>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="Address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Address
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
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="IdNumber"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        ID Number
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="IdNumber"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          id="IdNumber"
                          autoComplete="IdNumber"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone number
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
                    <div className="sm:col-span-5">
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
                          <option value="Al-Quds University">Al-Quds University</option>
                          <option value="Birzeit University">Birzeit University</option>
                          <option value="Bethlehem University">Bethlehem University</option>
                          <option value="Al-Quds Open University">Al-Quds Open University</option>
                          <option value="Arab American University">Arab American University</option>
                          <option value="Hebron University">Hebron University</option>
                          <option value="Ibrahimieh College">Ibrahimieh College</option>
                          <option value="Khodori Institute, Tulkarm">Khodori Institute, Tulkarm</option>
                          <option value="Palestine Ahliya University">Palestine Ahliya University</option>
                          <option value="Palestine Polytechnic University">Palestine Polytechnic University</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        University Major
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="major"
                          id="major"
                          value={universityMajor}
                          onChange={(e) => setUniversityMajor(e.target.value)}
                          autoComplete="university-majour"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Expected Graduation Date
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          id="graudation-date"
                          name="graudation-date"
                          value={expectedGraduationDate}
                          onChange={(e) =>
                            setExpectedGraduationDate(e.target.value)
                          }
                          autoComplete="graudation-date"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="branch"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Branch Location
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
                        Training Field
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
                          <option value="QUALITY_ASSURANCE">Quality Assurance</option>
                          <option value="MOBILE">Mobile Development</option>
                          <option value="DESIGN_VERIFICATION">Design Verification</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Notifications
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    We'll always let you know about important changes, but you
                    pick what else you want to hear about.
                  </p>
                  <div className="mt-10 space-y-10">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-gray-900">
                        By Email
                      </legend>
                      <div className="mt-6 space-y-6">
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="comments"
                              name="comments"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor="comments"
                              className="font-medium text-gray-900"
                            >
                              Comments
                            </label>
                            <p className="text-gray-500">
                              Get notified when someones posts a comment on a
                              posting.
                            </p>
                          </div>
                        </div>
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="candidates"
                              name="candidates"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor="candidates"
                              className="font-medium text-gray-900"
                            >
                              Candidates
                            </label>
                            <p className="text-gray-500">
                              Get notified when a candidate applies for a job.
                            </p>
                          </div>
                        </div>
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="offers"
                              name="offers"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor="offers"
                              className="font-medium text-gray-900"
                            >
                              Offers
                            </label>
                            <p className="text-gray-500">
                              Get notified when a candidate accepts or rejects
                              an offer.
                            </p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TraineeProfile;
