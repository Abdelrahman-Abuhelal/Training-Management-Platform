import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import CreateUsersForm from "../pages/CreateUsersForm.jsx";
import CompleteRegistration from "../pages/CompleteRegistration.jsx";
import ForgotPasswordEmail from "../pages/ForgotPasswordEmail.jsx";
import ForgotPasswordReset from "../pages/ForgotPasswordReset.jsx";
import Login from "../pages/Login.jsx";
import TraineeForm from "../pages/TraineeForm.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const Routes = () => {
  const { user } = useAuth();
  const isAuthenticated = user && user.login_token;

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
      element: < TraineeForm/>,
    },
    //add path for not found page
    {
      path: "*",
      element: <div>Not Found Page</div>,
    }
  ];

  // accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/dashboard",
          element: <Dashboard/>,
        },
        {
          path: "/profile",
          element: <TraineeForm/>,
        }
      ],
    },
  ];

  // accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <div>Home Page!</div>,
    },
    {
      path: "/confirm-account/:token",
      element: <CompleteRegistration />,
    },
    {
      path: "/login",
      element: <Login />,
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
    ...routesForPublic,
    ...(!user ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
