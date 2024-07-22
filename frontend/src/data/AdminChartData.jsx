
// import React, { useState, useEffect } from 'react';

// const AdminChart = () => {
//   const [traineeSize, setTraineeSize] = useState([]);
//   const [supervisorSize, setSupervisorSize] = useState([]);
//   const { user } = useAuth();
//   const { login_token } = user;
//   const baseUrl = import.meta.env.VITE_PORT_URL;

//   useEffect(() => {
//     traineeSizeAPI();
//     supervisorSizeAPI();
//   }, []);


//   const traineeSizeAPI = async () => {
//     try {
//       const response = await axios.get(
//         `${baseUrl}/api/v1/admin/trainees/size`, {
//         headers: {
//           Authorization: `Bearer ${login_token}`
//         }
//       }
//       );
//       if (response.status === 200) {
//         const size = response.data;
//         console.log(size);
//         setTraineeSize(size);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };


//   const supervisorSizeAPI = async () => {
//     try {
//       const response = await axios.get(
//         `${baseUrl}/api/v1/admin/supervisors/size`, {
//         headers: {
//           Authorization: `Bearer ${login_token}`
//         }
//       }
//       );
//       if (response.status === 200) {
//         const size = response.data;
//         console.log(size);
//         setSupervisorSize(size);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };


// }




// export const AdminChartPie = {
//   labels: ["Trainees", "Supervisors"],
//   datasets: [
//     {
//       label: "Users",
//       data: [traineeSize, supervisorSize],
//       backgroundColor: [
//         "rgba(54, 162, 235, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//       ],
//       borderColor: [
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

