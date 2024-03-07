import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
    const { user } = useAuth(); 
  
    // Check if the user is authenticated
    if (user === null ) { 
      return <Navigate to="/" />;
    }
  
    return <Outlet />;
};

export default ProtectedRoute;
