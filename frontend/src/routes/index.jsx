import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import CreateUsersForm from "../pages/adminPortal/CreateUsersForm.jsx";
import CompleteRegistration from "../pages/auth/CompleteRegistration.jsx";
import ForgotPasswordEmail from "../pages/auth/ForgotPasswordEmail.jsx";
import ForgotPasswordReset from "../pages/auth/ForgotPasswordReset.jsx";
import Login from "../pages/auth/Login.jsx";
import TraineeProfile from "../pages/traineePortal/TraineeProfile.jsx";
import Supervisor_Trainees_List from "../pages/supervisorPortal/TraineesList.jsx";
import EditTrainee from "../pages/adminPortal/EditTrainee.jsx";
import FormBuilder from "../pages/adminPortal/FormBuilder.jsx";
import AdminHome from "../components/admin/Home.jsx";
import TraineeHome from "../components/trainee/Home.jsx";
import SupervisorHome from "../components/supervisor/Home.jsx";
import FormsList from "../pages/traineePortal/FormsList.jsx";
import FillForm from "../pages/traineePortal/FillForm.jsx";
import SupervisorLayout from "../pages/supervisorPortal/SupervisorLayout.jsx";
import TraineeLayout from "../pages/traineePortal/TraineeLayout.jsx";
import AdminLayout from "../pages/adminPortal/AdminLayout.jsx";
import HR_Supervisors_List from "../pages/adminPortal/SupervisorList.jsx"
import HR_Trainees_List from "../pages/adminPortal/TraineesList.jsx";
import ReviewForm from "../pages/supervisorPortal/ReviewForm.jsx"
import SupervisorTraineesList from "../pages/adminPortal/SupervisorTraineesList.jsx"
import TraineeProfileView from "../pages/supervisorPortal/TraineeProfileView.jsx";
import AssignTask from "../pages/supervisorPortal/AssignTask.jsx";
import Resources from "../pages/supervisorPortal/Resources.jsx";
import AnnouncementForm from "../pages/adminPortal/CreateAnnounments.jsx";
import FormTemplates from "../pages/adminPortal/FormTemplates.jsx"
import FormTemplatePage from "../pages/adminPortal/FormTemplatePage.jsx"
import NotFound from '../pages/NotFound.jsx';
import UserManagement from '../pages/adminPortal/UserManagement.jsx';
const Routes = () => {
  const { user } = useAuth();
  const isAuthenticated = user !== null && user.login_token !== null;
  const isTrainee = user !== null && user.appUserDto.userRole === 'TRAINEE';
  const isSupervisor = user !== null && user.appUserDto.userRole === 'SUPERVISOR';
  const isSuperAdmin = user !== null && user.appUserDto.userRole === 'SUPER_ADMIN';
  // console.log("user", user);
  // console.log("isAuthenticated", isAuthenticated);
  // console.log("isTrainee", isTrainee);
  // console.log("isSupervisor", isSupervisor);
  // console.log("isSuperAdmin", isSuperAdmin);

  // accessible to all users
  const routesForPublic = [
    { path: '/dev', element: <div>Abdelrahman Abuhelal Page</div> },
    { path: '/about-us', element: <div>About Us</div> },
    { path: '/test', element: <TraineeProfile /> },
  ];

  // accessible only to authenticated users
  const routesForTraineeOnly = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <TraineeLayout />,
          children: [
            { path: '/', element: <TraineeHome /> },
            { path: '/dashboard', element: <TraineeHome /> },
            { path: '/profile', element: <TraineeProfile /> },
            { path: '/forms', element: <FormsList /> },
            { path: '/forms/:formId', element: <FillForm /> },
          ],
        },
      ],
    },
  ];

  const routesForSupervisorOnly = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <SupervisorLayout />,
          children: [
            { path: '/', element: <SupervisorHome /> },
            { path: '/dashboard', element: <SupervisorHome /> },
            { path: '/my-trainees', element: <Supervisor_Trainees_List /> },
            { path: '/review-form/:userId', element: <ReviewForm /> },
            { path: '/view-trainee/:userId', element: <TraineeProfileView /> },
            { path: '/add-resource', element: <Resources /> },
            { path: '/assign-task', element: <AssignTask /> },
          ],
        },
      ],
    },
  ];

  const routesForSuperAdminOnly = [
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/',
          element: <AdminLayout />,
          children: [
            { path: '/', element: <AdminHome /> },
            { path: '/dashboard', element: <AdminHome /> },
            { path: '/trainees', element: <HR_Trainees_List /> },
            { path: '/supervisors', element: <HR_Supervisors_List /> },
            { path: '/create-forms', element: <FormBuilder /> },
            { path: '/form-templates', element: <FormTemplates /> },
            { path: '/form-templates/:formId', element: <FormTemplatePage /> },
            { path: '/edit-trainee/:userId', element: <EditTrainee /> },
            { path: '/users', element: <UserManagement /> },
            { path: '/supervisors/:userId/trainees', element: <SupervisorTraineesList /> },
            { path: '/create-announcements', element: <AnnouncementForm /> },
          ],
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    { path: '/', element: <Login /> },
    { path: '/confirm-account/:token', element: <CompleteRegistration /> },
    { path: '/forgot-password-email', element: <ForgotPasswordEmail /> },
    { path: '/forgot-password-reset/:token', element: <ForgotPasswordReset /> },
    { path: '/create-users-form', element: <CreateUsersForm /> },
  ];

  const allRoutes = [
    ...routesForPublic,
    ...(isAuthenticated ? [] : routesForNotAuthenticatedOnly),
    ...(isTrainee ? routesForTraineeOnly : []),
    ...(isSupervisor ? routesForSupervisorOnly : []),
    ...(isSuperAdmin ? routesForSuperAdminOnly : []),
    { path: '*', element: <NotFound /> }, // Fallback for undefined routes
  ];

  const router = createBrowserRouter(allRoutes);

  return <RouterProvider router={router} />;
};

export default Routes;
