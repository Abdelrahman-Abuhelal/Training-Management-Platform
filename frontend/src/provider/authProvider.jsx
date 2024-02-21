import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();
// Extract necessary fields


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState( () => JSON.parse(localStorage.getItem("user")) || null );
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

  useEffect(() => {
    if (user?.login_token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.login_token}`;
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
