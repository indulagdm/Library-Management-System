import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavBar = () => {
  const location = useLocation();
  return (
    <div className="nav-container">
      <ul>
        <li>
          <Link
            to={"/admin-dashboard"}
            style={{ textDecoration: "none", color: "black", width: "100px" }}
            className={location.pathname === "/admin-dashboard" ? "active" : ""}
          >
            DashBoard
          </Link>
        </li>
        <li>
          <Link
            to={"/"}
            style={{ textDecoration: "none", color: "black", width: "100px" }}
            className={location.pathname === "/" ? "active" : ""}
          >
            Purchases
          </Link>
        </li>
        <li>
          <Link
            to={""}
            style={{ textDecoration: "none", color: "black", width: "100px" }}
            className={location.pathname === "/" ? "active" : ""}
          >
            Students
          </Link>
        </li>
        <li>
          <Link
            to={""}
            style={{ textDecoration: "none", color: "black", width: "100px" }}
            className={location.pathname === "/" ? "active" : ""}
          >
            Teachers
          </Link>
        </li>
        <li>
          <Link
            to={""}
            style={{ textDecoration: "none", color: "black", width: "100px" }}
            className={location.pathname === "/" ? "active" : ""}
          >
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNavBar;
