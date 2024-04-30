import AdminButtonAppBar from "../../components/admin/NavBar"
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
      <>
        <AdminButtonAppBar /> {/* Add SupervisorButtonAppBar here */}
        {/* Add any components you want to appear on all children paths */}
        <Outlet /> {/* This renders the child routes */}
      </>
    );
  };

  export default AdminLayout;
