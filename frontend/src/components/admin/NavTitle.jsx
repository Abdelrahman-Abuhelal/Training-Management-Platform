import  {Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const NavTitle = () => {
  const theme = useTheme();

return(
<div className="content-header">
<div className="container-fluid">
  <div className="row mb-2">
    <div className="col-sm-6">
    <Typography  className="concert-one-regular" variant='inherit' sx={{color:  theme.palette.primary.main}}>Admin Dashboard:</Typography>
    </div>
    {/* /.col */}
    <div className="col-sm-6">
      <ol className="breadcrumb float-sm-right">
        <li className="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li className="breadcrumb-item active">Dashboard</li>
      </ol>
    </div>
    {/* /.col */}
  </div>
  {/* /.row */}
</div>
{/* /.container-fluid */}
</div>
);
}

export default NavTitle;
