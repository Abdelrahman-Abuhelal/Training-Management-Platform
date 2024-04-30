
import TraineeButtonAppBar from "../../components/trainee/NavBar"
import { Navigate, Outlet } from "react-router-dom";

const TraineeLayout = () => {
    return (
      <>
        <TraineeButtonAppBar /> {/* Add SupervisorButtonAppBar here */}
        {/* Add any components you want to appear on all children paths */}
        <Outlet /> {/* This renders the child routes */}
      </>
    );
  };

  export default TraineeLayout;
