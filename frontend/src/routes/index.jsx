import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
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
import FillForm from "../pages/allPortals/FillForm.jsx";
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
import ChangePassword from '../pages/auth/ChangePassword.jsx'
import FormsList from '../pages/allPortals/FormsList.jsx';
import FormSubmissions from '../pages/adminPortal/FormSubmissions.jsx';
import FormResponse from '../pages/adminPortal/FormResponse.jsx';
import AddSkillComponent from '../pages/adminPortal/AddSkillComponent.jsx';
import TraineeSkills from '../pages/supervisorPortal/TraineeSkills.jsx';
import TraineesSkillsList from '../pages/adminPortal/TraineesSkillsList.jsx';
import AllTraineesSkills from '../pages/supervisorPortal/AllTraineesSkills.jsx';
import HR_Superadmin_List from '../pages/adminPortal/AdminList.jsx';
import  AdminSettings from '../pages/adminPortal/AdminSettings.jsx';
import JobDescriptionRanking from '../pages/adminPortal/JobDescriptionRanking.jsx'
import SupervisorSettings from '../pages/supervisorPortal/SupervisorSettings.jsx';
import TraineeSettings from '../pages/traineePortal/TraineeSettings.jsx';
import MyGrades from '../pages/traineePortal/MyGrades.jsx';
import TasksList from '../pages/supervisorPortal/TasksList.jsx';
import TaskDetails from '../pages/supervisorPortal/TaskDetails.jsx';
import AddCourseComponent from '../pages/adminPortal/AddCourseComponent.jsx';
import TrainingPlan from '../pages/supervisorPortal/TrainingPlan.jsx';
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
            { path: '/home', element: <TraineeHome /> },
            { path: '/profile', element: <TraineeProfile /> },
            { path: '/grades', element: <MyGrades /> },
            { path: '/forms', element: <FormsList /> },
            { path: '/forms/:formId', element: <FillForm /> },
            { path: '/settings', element: <TraineeSettings /> },
            { path: '/change-password', element: <ChangePassword /> },
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
            { path: '/home', element: <SupervisorHome /> },
            { path: '/my-trainees', element: <Supervisor_Trainees_List /> },
            { path: '/forms', element: <FormsList /> },
            { path: '/forms/:formId', element: <FillForm /> },
            { path: '/review-form/:userId', element: <ReviewForm /> },
            { path: '/view-trainee/:userId', element: <TraineeProfileView /> },
            { path: '/add-resource', element: <Resources /> },
            { path: '/add-skills/:userId', element: <TraineeSkills /> },
            { path: '/skills', element: <AllTraineesSkills /> },
            { path: '/assign-task', element: <AssignTask /> },
            { path: '/training-plan', element: <TrainingPlan /> },
            { path: '/tasks', element: <TasksList /> },
            { path: '/tasks/:taskId', element: <TaskDetails /> },
            { path: '/settings', element: <SupervisorSettings /> },
            { path: '/change-password', element: <ChangePassword /> },
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
            { path: '/home', element: <AdminHome /> },
            { path: '/users', element: <UserManagement /> },
            { path: '/trainees', element: <HR_Trainees_List /> },
            { path: '/trainees', element: <HR_Trainees_List /> },
            { path: '/forms', element: <FormsList /> },
            { path: '/skills', element: <TraineesSkillsList /> },
            { path: '/add-skills', element: <AddSkillComponent /> },
            { path: '/add-courses', element: <AddCourseComponent /> },
            { path: '/supervisors', element: <HR_Supervisors_List /> },
            { path: '/supervisors/:userId/trainees', element: <SupervisorTraineesList /> },
            { path: '/superadmins', element: <HR_Superadmin_List /> },
            { path: '/create-forms', element: <FormBuilder /> },
            { path: '/form-templates', element: <FormTemplates /> },
            { path: '/form-templates/:formId/submissions', element: <FormSubmissions /> },
            { path: '/form-templates/:formId/submissions/:submissionId', element: <FormResponse /> },            
            { path: '/form-templates/:templateId', element: <FormTemplatePage /> },
            { path: '/edit-trainee/:userId', element: <EditTrainee /> },
            { path: '/job-description-ranking', element: <JobDescriptionRanking /> },
            { path: '/announcements', element: <AnnouncementForm /> },
            { path: '/settings', element: <AdminSettings /> },
            { path: '/change-password', element: <ChangePassword /> },

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
