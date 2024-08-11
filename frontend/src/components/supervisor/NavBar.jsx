import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle"; // Import the AccountCircle icon
import TemporaryDrawer from "./SideBar";
import Logout from "../../pages/auth/Logout";
import { useAuth } from "../../provider/authProvider";
import { Link } from 'react-router-dom'; 

export default function SupervisorButtonAppBar() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  // Retrieve user information from authentication context
  const { user } = useAuth();
  const { appUserDto } = user;
  const { userFirstName,userLastName} = appUserDto;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer("left", true)}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1.0rem', sm: '1.5rem' } }}>
              EXALT Training Platform
            </Typography>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountCircle sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ mr: 2 }}>
            {userFirstName+" "+userLastName}
            </Typography>
            <Logout />
          </Box>
        </Toolbar>
      </AppBar>
      <TemporaryDrawer
        state={state}
        setState={setState}
        toggleDrawer={toggleDrawer}
      ></TemporaryDrawer>
    </Box>
  );
}
