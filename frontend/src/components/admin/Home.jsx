import AdminButtonAppBar from "./NavBar";
import Overview from "./Overview.jsx";
import PieChartForAdmin from "../charts/PieChart/index.jsx"


const AdminHome = () => {
  return (
    <div style={{ paddingLeft: "5rem",  paddingRight: "5rem" ,  paddingTop: "1rem",  paddingBottom: "2rem"  }}>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Admin Dashboard</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Dashboard v1</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <Overview />
      <br></br>
      <PieChartForAdmin/>
      {/* /.content */}
    </div>
  );
};

export default AdminHome;
