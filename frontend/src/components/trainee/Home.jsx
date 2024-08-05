import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import NavTitle from "../NavTitle.jsx";
import Overview from "./Overview.jsx";

const TraineeHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const breadcrumbs = [
    { label: 'Training Management System', href: '/' },
    { label: 'Home' }
  ];
   return (
    <Box
      sx={{
        padding: isMobile ? '1rem' : '5rem',
        paddingTop: '1rem',
      }}
    >
      <NavTitle title="Trainee Home:" breadcrumbs={breadcrumbs} />
      <Overview />
      <br></br>
      <Box sx={{}}>
        {/* <PieChartForAdmin/> */}
      </Box>
    </Box>
  );
};

export default TraineeHome;
