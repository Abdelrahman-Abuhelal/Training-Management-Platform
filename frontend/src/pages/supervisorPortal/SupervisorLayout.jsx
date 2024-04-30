import SupervisorButtonAppBar from "../../components/supervisor/NavBar"
import { Navigate, Outlet } from "react-router-dom";

const SupervisorLayout = () => {
    return (
      <>
        <SupervisorButtonAppBar /> {/* Add SupervisorButtonAppBar here */}
        {/* Add any components you want to appear on all children paths */}
        <Outlet /> {/* This renders the child routes */}
      </>
    );
  };

  export default SupervisorLayout;
