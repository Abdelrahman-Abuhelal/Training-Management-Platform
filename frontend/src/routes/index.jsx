import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import CreateUsersForm from "../pages/adminPortal/CreateUsersForm.jsx";
import CompleteRegistration from "../pages/auth/CompleteRegistration.jsx";
import ForgotPasswordEmail from "../pages/auth/ForgotPasswordEmail.jsx";
import ForgotPasswordReset from "../pages/auth/ForgotPasswordReset.jsx";
import Login from "../pages/auth/Login.jsx";
import TraineeProfile from "../pages/traineePortal/TraineeProfile.jsx";
import SupervisorDashboard from "../pages/supervisorPortal/SupervisorDashboard.jsx";
import TraineesList from "../pages/adminPortal/TraineesList.jsx";
import EditTrainee from "../pages/adminPortal/EditTrainee.jsx";
import Home from "../components/admin/Home.jsx";
import ReviewCreation from "../pages/adminPortal/ReviewCreation.jsx";
import AdminButtonAppBar from "../components/admin/NavBar";
import TraineeButtonAppBar  from "../components/trainee/NavBar";
import AdminHome from "../components/admin/Home.jsx";
import TraineeHome from "../components/trainee/Home.jsx";
import ReviewsList from "../pages/traineePortal/ReviewsList.jsx";
import FillReview from "../pages/traineePortal/FillReview.jsx";

const Routes = () => {
  const { user } = useAuth();
  const isAuthenticated = (user !== null && user.login_token !== null);
  const isTrainee = (user !== null && user.appUserDto.userRole === "TRAINEE");
  const isSupervisor = (user !== null && user.appUserDto.userRole === "SUPERVISOR");
  const isSuperAdmin = (user !== null && user.appUserDto.userRole === "SUPER_ADMIN");
  // console.log("user", user);
  // console.log("isAuthenticated", isAuthenticated);
  // console.log("isTrainee", isTrainee);
  // console.log("isSupervisor", isSupervisor);
  // console.log("isSuperAdmin", isSuperAdmin);

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
      element: <ProtectedRoute /> ,
      // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <TraineeHome />,
        },
        {
          path: "/dashboard",
          element: <TraineeHome />,
        },
        {
          path: "/profile",
          element: <TraineeProfile />,
        },
        {
          path: "/reviews",
          element: <ReviewsList />,
        },
        {
          path: "/reviews/:reviewId",
          element: <FillReview />,
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
          element: <Home />,
        },
        {
          path: "/dashboard",
          element: <Home />,
        },
      ],
    },
  ];

  const routesForSuperAdminOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, 
      children: [
        {
          path: "/",
          element: <AdminHome />,
        },
        {
          path: "/dashboard",
          element: <AdminHome />,
        },
        {
          path: "/trainees",
          element: <TraineesList />,
        },
        {
          path:"/create-reviews",
          element:<ReviewCreation />
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

  const router = createBrowserRouter([
    ...(!isAuthenticated ? routesForNotAuthenticatedOnly : []),
    ...(isTrainee ? routesForTraineeOnly : []),
    ...(isSupervisor ? routesForSupervisorOnly : []),
    ...(isSuperAdmin ? routesForSuperAdminOnly : []),
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
