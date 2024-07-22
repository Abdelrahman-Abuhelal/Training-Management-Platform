import AdminButtonAppBar from "./NavBar";
import Overview from "./Overview.jsx";
// import PieChartForAdmin from "../charts/PieChart/index.jsx"
import NavTitle from "./NavTitle.jsx";
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';

const AdminHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        padding: isMobile ? '1rem' : '5rem',
        paddingTop: '1rem',
      }}
    >
      <NavTitle/>
      <Overview />
      <br></br>
      <Box sx={{}}>
        {/* <PieChartForAdmin/> */}
      </Box>
    </Box>
  );
};

export default AdminHome;
