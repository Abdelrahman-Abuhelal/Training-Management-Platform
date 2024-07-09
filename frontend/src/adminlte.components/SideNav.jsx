import Logout  from "../pages/auth/Logout";
import React from 'react';

const SideNav = () => {

  return (
    <div>
      {" "}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">Exalt Training</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                Abdelarhman
              </a>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item menu-open">
                <a href="#" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>
                    Dashboard
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="./index.html" className="nav-link active">
                      <i className="far fa-circle nav-icon" />
                      <p>Dashboard v1</p>
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-chart-pie" />
                  <p>
                    Charts
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="pages/charts/chartjs.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>ChartJS</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/charts/flot.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Flot</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/charts/inline.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Inline</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/charts/uplot.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>uPlot</p>
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-table" />
                  <p>
                    Tables
                    <i className="fas fa-angle-left right" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="pages/tables/simple.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Simple Tables</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/tables/data.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>DataTables</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/tables/jsgrid.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>jsGrid</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-header">EXAMPLES</li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-book" />
                  <p>
                    Pages
                    <i className="fas fa-angle-left right" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a href="pages/examples/invoice.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Invoice</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/examples/profile.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Profile</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="pages/examples/e-commerce.html"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon" />
                      <p>E-commerce</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/examples/projects.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Projects</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="pages/examples/project-add.html"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon" />
                      <p>Project Add</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="pages/examples/project-edit.html"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon" />
                      <p>Project Edit</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="pages/examples/project-detail.html"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon" />
                      <p>Project Detail</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/examples/contacts.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>Contacts</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="pages/examples/faq.html" className="nav-link">
                      <i className="far fa-circle nav-icon" />
                      <p>FAQ</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="pages/examples/contact-us.html"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon" />
                      <p>Contact us</p>
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-header">MISCELLANEOUS</li>
              <li className="nav-item">
                <a href="https://adminlte.io/docs/3.1/" className="nav-link">
                  <i className="nav-icon fas fa-file" />
                  <p>Documentation</p>
                </a>
              </li>

              <li className="nav-header">LABELS</li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon far fa-circle text-danger" />
                  <p className="text">Important</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon far fa-circle text-warning" />
                  <p>Warning</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon far fa-circle text-info" />
                  <p>Informational</p>
                </a>
              </li>
              <li className="nav-item">
               <Logout/>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};

export default SideNav;