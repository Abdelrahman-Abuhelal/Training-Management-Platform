import { NavLink } from "react-router-dom";
const Header = () => {
  return (
   <div> {/* Navbar */}
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  {/* Left navbar links */}
  <ul className="navbar-nav">
    <li className="nav-item d-none d-sm-inline-block">
    <NavLink className="nav-link" to="../">Login</NavLink>
    </li>
  </ul>
  
</nav>
{/* /.navbar */}

</div>
  )
}

export default Header