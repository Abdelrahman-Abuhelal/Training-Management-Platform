import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import CreateUsersForm from "../pages/adminPortal/CreateUsersForm.jsx";
import CompleteRegistration from "../pages/auth/CompleteRegistration.jsx";
import ForgotPasswordEmail from "../pages/auth/ForgotPasswordEmail.jsx";
import ForgotPasswordReset from "../pages/auth/ForgotPasswordReset.jsx";
import Login from "../pages/auth/Login.jsx";
import TraineeDashboard from "../pages/traineePortal/TraineeDashboard.jsx";
import TraineeProfile from "../pages/traineePortal/TraineeProfile.jsx";
import AdminDashboard from "../pages/adminPortal/AdminDashboard.jsx";
import SupervisorDashboard from "../pages/supervisorPortal.jsx/SupervisorDashboard.jsx";
import TraineesList from "../pages/adminPortal/TraineesList.jsx";
import EditTrainee from "../pages/adminPortal/EditTrainee.jsx";

const Routes = () => {
  const { user } = useAuth();
  const isAuthenticated = (user !== null && user.login_token !== null);
  const isTrainee = (user !== null && user.appUserDto.userRole === "TRAINEE");
  const isSupervisor = (user !== null && user.appUserDto.userRole === "SUPERVISOR");
  const isSuperAdmin = (user !== null && user.appUserDto.userRole === "SUPER_ADMIN");
  console.log("user", user);
  console.log("isAuthenticated", isAuthenticated);
  console.log("isTrainee", isTrainee);
  console.log("isSupervisor", isSupervisor);
  console.log("isSuperAdmin", isSuperAdmin);

  // accessible to all users
  const routesForPublic = [
    {
      path: "/dev",
      element: <div>Abdelrahman Abuhelal Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
    {
      path: "/test",
      element: <TraineeProfile />,
    },
  ];

  // accessible only to authenticated users
  const routesForTraineeOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <TraineeDashboard />,
        },
        {
          path: "/dashboard",
          element: <TraineeDashboard />,
        },
        {
          path: "/profile",
          element: <TraineeProfile />,
        },
      ],
    },
  ];

  const routesForSupervisorOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <SupervisorDashboard />,
        },
        {
          path: "/dashboard",
          element: <AdminDashboard />,
        },
      ],
    },
  ];

  const routesForSuperAdminOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <AdminDashboard />,
        },
        {
          path: "/dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "/trainees",
          element: <TraineesList />,
        },
        {
          path: "/edit-trainee/:userId",
          element: <EditTrainee/>,
        },
        {
          path: "/create-users",
          element: <CreateUsersForm />,
        },
      ],
    },
  ];

  // accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/confirm-account/:token",
      element: <CompleteRegistration />,
    },
    {
      path: "/forgot-password-email",
      element: <ForgotPasswordEmail />,
    },
    {
      path: "/forgot-password-reset/:token",
      element: <ForgotPasswordReset />,
    },
    {
      path: "/create-users-form",
      element: <CreateUsersForm />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...(!isAuthenticated ? routesForNotAuthenticatedOnly : []),
    ...(isTrainee ? routesForTraineeOnly : []),
    ...(isSupervisor ? routesForSupervisorOnly : []),
    ...(isSuperAdmin ? routesForSuperAdminOnly : []),
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
