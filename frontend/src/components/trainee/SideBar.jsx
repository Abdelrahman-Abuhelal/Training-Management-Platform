import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
import SettingsIcon from '@mui/icons-material/Settings';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const routes = [
  { path: '/dashboard', name: 'Dashboard', icon: <SpaceDashboardIcon sx={{ color: 'primary.main' }}/> },
  { path: '/profile', name: 'Profile', icon: <AccountCircleIcon sx={{ color: 'primary.main' }}/> },
  { path: '/forms', name: 'Forms', icon: <ListAltIcon sx={{ color: 'primary.main' }}/> },
  { path: '/tasks', name: 'Tasks', icon: <TaskAltIcon sx={{ color: 'primary.main' }}/> },
  { path: '/announcements', name: 'Announcements', icon: <CampaignIcon sx={{ color: 'primary.main' }}/> },
  { path: '/change-password', name: 'Settings', icon: <SettingsIcon sx={{ color: 'primary.main' }}/> }

];


export default function TemporaryDrawer({state, setState, toggleDrawer}) {
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
            <List>      
          {/* the links should be the same as routing name, stupid logic*/}
          {routes.map((route, index) => (
        <ListItem key={route.name} disablePadding>
        <ListItemButton href={route.path}>
              <ListItemIcon>
              {route.icon}
              </ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
     
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
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