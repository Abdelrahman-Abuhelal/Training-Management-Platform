import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";
import axios from "axios";
import Button from "@mui/material/Button";

const Logout = () => {
  const { user, setUserData, logout } = useAuth();
  const navigate = useNavigate();
  const { appUserDto, login_token, refresh_token } = user;

  const handleLogout = async (login_token) => {
    try {
      const baseUrl = import.meta.env.VITE_PORT_URL;
      const response = await axios.get(`${baseUrl}/api/v1/users/logout`, {
        login_token,
      });

      if (response.status === 200) {
        setUserData(null);
        localStorage.removeItem("traineeProfile");
        navigate("/", { replace: true });
      } else {
        console.error("Unexpected logout response:", response);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Button
      color="inherit"
      onClick={handleLogout}
      sx={{
        border: "1px solid white",
        borderRadius: "8px",
        padding: "6px 12px",
      }}
    >
      Logout
    </Button>
  );
};

export default Logout;
