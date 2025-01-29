import React from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import './NavBar.css'

const NavBar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const handelLogout = async () => {
    try {
      const confirmed = window.confirm("Are you sure to log out this moment?");

      if (confirmed) {
        const response = await fetch("http://localhost:4000/api/user/logout", {
          method: "POST",
          headers: { authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (response.ok) {
          alert("Log out successful.");
          navigate("/");
        } else {
          alert(result.message);
        }
      } else {
        alert("Log out process cancelled.");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <div className="nav-container">
        <ul>
          <li>
            <Link to={"/student-dashboard"} style={{textDecoration:"none",color:"black",width:"100px"}} className={location.pathname==="/student-dashboard"?"active":""} >Books</Link>
          </li>
          <li>
            <Link to={"/purchases"} style={{textDecoration:"none",color:"black",width:"100px"}} className={location.pathname==="/purchases"?"active":""}>Purchase</Link>
          </li>
          <li>
            <Link to={"/profile"} style={{textDecoration:"none",color:"black",width:"100px"}} className={location.pathname==="/profile"?"active":""}>Profile</Link>
          </li>
          {/* <div className="logout-container">
            {token ? (<div><button onClick={handelLogout}>LogOut</button></div>):(<div></div>)}
          </div> */}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
