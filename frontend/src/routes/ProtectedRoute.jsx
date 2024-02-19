import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

export const ProtectedRoute = () => {
    const { user } = useAuth(); // Access the user object from the authentication context
  
    // Check if the user is authenticated
    if (!user || !user.login_token) { 
      return <Navigate to="/login" />;
    }
  
    return <Outlet />;
};

export default ProtectedRoute;
