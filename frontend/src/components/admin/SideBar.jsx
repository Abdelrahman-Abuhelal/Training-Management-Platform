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
import CampaignIcon from '@mui/icons-material/Campaign';
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
const routes = [
  { path: "/home", name: "Home", icon: <SpaceDashboardIcon sx={{ color: 'primary.main' }}/> },
  { path: "/users", name: "User Management", icon: <AdminPanelSettingsIcon sx={{ color: 'primary.main' }}/> },
  { path: "/trainees", name: "Trainees", icon: <GroupsIcon sx={{ color: 'primary.main' }}/> },
  { path: "/trainees-info", name: "Trainees Information", icon: <GroupsIcon sx={{ color: 'primary.main' }}/> },
  { path: "/supervisors", name: "Supervisors", icon: <GroupsIcon sx={{ color: 'primary.main' }}/> },
  { path: "/superadmins", name: "Super Admins", icon: <GroupsIcon sx={{ color: 'primary.main' }}/> },
  { path: "/skills", name: "Skills", icon: <AutoAwesomeIcon sx={{ color: 'primary.main' }}/> },
  { path: "/form-templates", name: "Forms", icon: <ListAltIcon sx={{ color: 'primary.main' }}/> },
  { path: "/announcements", name: "Announcements", icon: <CampaignIcon sx={{ color: 'primary.main' }}/> },
  { path: "/settings", name: "Settings", icon: <SettingsIcon sx={{ color: 'primary.main' }}/> },
];

export default function TemporaryDrawer({ state, setState, toggleDrawer }) {
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {routes.map((route, index) => (
        <ListItem  key={route.name} disablePadding>
            <ListItemButton href={route.path}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
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