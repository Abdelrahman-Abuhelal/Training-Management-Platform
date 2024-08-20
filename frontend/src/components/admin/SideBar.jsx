import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../provider/authProvider";
import Typography from "@mui/material/Typography";
import WorkIcon from "@mui/icons-material/Work";
/* const routes = [
  { path: "/home", name: "Home", icon:<AcademicCapIcon style={{ width: '24px', height: '24px' }} /> },
  { path: "/users", name: "User Management", icon: <AdminPanelSettingsIcon sx={{ color: 'primary.main' }}/> },
  { path: "/trainees", name: "Trainees", icon: <SchoolIcon sx={{ color: 'primary.main' }}/> },
  { path: "/trainees-info", name: "Trainees Information", icon:  <BookOpenIcon className="icon-small" /> },
  { path: "/supervisors", name: "Supervisors", icon: <WorkspacesIcon sx={{ color: 'primary.main' }}/> },  // New Icon
  { path: "/superadmins", name: "Super Admins", icon: <BusinessCenterIcon sx={{ color: 'primary.main' }}/> },
  { path: "/skills", name: "Skills", icon: <AutoAwesomeIcon sx={{ color: 'primary.main' }}/> },
  { path: "/form-templates", name: "Forms", icon: <ListAltIcon sx={{ color: 'primary.main' }}/> },
  { path: "/announcements", name: "Announcements", icon: <CampaignIcon sx={{ color: 'primary.main' }}/> },
  { path: "/settings", name: "Settings", icon: <SettingsIcon sx={{ color: 'primary.main' }}/> },
];
*/
const routes = [
  {
    path: "/home",
    name: "Home",
    icon: <SpaceDashboardIcon sx={{ color: "primary.main" }} />,
  },
  {
    path: "/users",
    name: "User Management",
    icon: <AdminPanelSettingsIcon sx={{ color: "primary.main" }} />,
  },
  {
    path: "/trainees",
    name: "Trainees",
    icon: (
      <AcademicCapIcon
        style={{ width: "24px", height: "24px", color: "#32c1c1" }}
      />
    ),
  },
  {
    path: "/trainees-info",
    name: "Trainees Information",
    icon: (
      <BookOpenIcon
        style={{ width: "24px", height: "24px", color: "#32c1c1" }}
      />
    ),
  },
  {
    path: "/supervisors",
    name: "Supervisors",
    icon: (
      <UserGroupIcon
        style={{ width: "24px", height: "24px", color: "#32c1c1" }}
      />
    ),
  },
  {
    path: "/superadmins",
    name: "Super Admins",
    icon: (
      <ShieldCheckIcon
        style={{ width: "24px", height: "24px", color: "#32c1c1" }}
      />
    ),
  },
  {
    path: "/skills",
    name: "Experience & Skills",
    icon: <AutoAwesomeIcon sx={{ color: "primary.main" }} />,
  },
  {
    path: "/form-templates",
    name: "Forms",
    icon: <ListAltIcon sx={{ color: "primary.main" }} />,
  },
  {
    path: "/job-description-ranking",
    name: "Job Hunt",
    icon: <WorkIcon sx={{ color: "primary.main" }} />,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <SettingsIcon sx={{ color: "primary.main" }} />,
  },
];

export default function TemporaryDrawer({ state, setState, toggleDrawer }) {
  const { user } = useAuth();
  const { appUserDto } = user;
  const { userFirstName, userLastName } = appUserDto;

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box sx={{ backgroundColor: "#e0f7fa"}}>

        <Box
          display="flex"
          justifyContent="center"
          mb={1}
          sx={{ animation: "fadeIn 1s ease-in-out" }}
        >
          <img
            src="./EXALT_LOGO2.png"
            alt="EXALT_LOGO"
            style={{
              height: "60px", 
              marginBottom: "5px", 
              marginRight: "2px",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)", // Slightly enlarge on hover
              },
            }}
          />
        </Box>
        <Typography
          align="center"
          variant="body1"
          sx={{
            mb: "1rem",
            fontFamily: 'Trebuchet MS, sans-serif	',
            fontSize: "1rem",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
            animation: "slideIn 1s ease-in-out",
            display: { xs: "none", sm: "block" },
          }}
        >
          Welcome {userFirstName}!
        </Typography>
        <Divider />
      </Box>
      <List>
        {routes.map((route, index) => (
          <ListItem key={route.name} disablePadding>
            <ListItemButton href={route.path}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText
                sx={{ fontFamily: '"Concert One", sans-serif' }}
                primary={route.name}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
