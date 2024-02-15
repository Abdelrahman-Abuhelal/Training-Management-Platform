import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import CreateUsersForm from "../components/CreateUsersForm";
import CompleteRegistration from "../components/CompleteRegistration";
import ForgotPasswordEmail from "../components/ForgotPasswordEmail";
import ForgotPasswordReset from "../components/ForgotPasswordReset";
import Login from "../components/Login";

const Routes = () => {
  const { token } = useAuth();

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
  ];

  // accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <div>User Home Page</div>,
        },
        {
          path: "/profile",
          element: <div>User Profile</div>,
        },
        {
          path: "/logout",
          element: <div>Logout</div>,
        },
      ],
    },
  ];

  // accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <div>Home Page</div>,
    },
    {
      path: "confirm-account/:token",
      element: <CompleteRegistration />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "forgot-password-email",
      element: <ForgotPasswordEmail />,
    },
    {
      path: "forgot-password-reset/:token",
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
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
