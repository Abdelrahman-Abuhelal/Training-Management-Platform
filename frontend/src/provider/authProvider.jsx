import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState( () => JSON.parse(localStorage.getItem("user")) || null );
  const baseUrl = import.meta.env.VITE_PORT_URL;
  // const { appUserDto, login_token, refresh_token } = user;
  // const { userId, userEmail, userFirstName,userLastName, userRole,userUsername } = appUserDto;

  const setUserData = (newUserData) => {
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/auth/refresh-token`);
      if (response.status === 200) {
        const data = await response.json();
        const { login_token,refresh_token } = data;
      setUserData({ ...user, login_token: login_token, refresh_token: refresh_token});
    }
    
   }catch (error) {
      console.error("Error refreshing token:", error);
      logout(); 
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = user?.login_token;
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          refreshToken();
        }
      }
    };

    if (user?.login_token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.login_token}`;
      checkTokenExpiration();
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const contextValue = useMemo(() => ({
    user,
    setUserData,
    logout,
  }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
