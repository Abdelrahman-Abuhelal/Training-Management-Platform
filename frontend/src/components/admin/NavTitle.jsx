import  {Typography } from '@mui/material';
const NavTitle = () => {
return(
<div className="content-header">
<div className="container-fluid">
  <div className="row mb-2">
    <div className="col-sm-6">
    <Typography  className="concert-one-regular" variant='inherit'>Dashboard:</Typography>
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
