import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import './student/studentComponentStyles.css'

const Login = () => {
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisible = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNumber, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.data.accessToken);

        if (result.data.existUser.role === "student") {
          alert(
            `Welcome back student ${result.data.existUser.firstName} ${result.data.existUser.lastName}`
          );
          navigate("/student-dashboard");
        } else if (result.data.existUser.role === "teacher") {
          alert(
            ` Welcome back Mr./Ms. ${result.data.existUser.firstName} ${result.data.existUser.lastName}`
          );
          navigate("/teacher-dashboard");
        } else if (result.data.existUser.role === "librarian") {
          alert(
            ` Welcome back Ms. ${result.data.existUser.firstName} ${result.data.existUser.lastName}`
          );
          navigate("/admin-dashboard");
        } else {
          setErr(
            "You are not registered. Please contact your class teacher or librarian."
          );
        }
      } else {
        setErr(result.message);
      }
    } catch (error) {
      setErr(error);
    }
  };

  return (
    <div>
      <div className="err-container">
        <p style={{ color: "red" }}>{err}</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Login</h2>
          </div>

          <div className="input-container">
            <input
              type="text"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="Enter Reg Number"
              className="input-field"
            />
          </div>

          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="input-field"
            />
            <span>
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                onClick={togglePasswordVisible}
              />
            </span>
          </div>

          <div className="submit-button-container">
            <button type="submit" className="submit-btn" disabled={!regNumber || !password}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
