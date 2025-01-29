import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import './studentComponentStyles.css';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {

    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [regNumber,setRegNumber] = useState("");
    const [err,setErr] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(()=>{
        const getProfile =async()=>{
            try{
                const response = await fetch("http://localhost:4000/api/user/profile",{
                    method:"POST",
                    headers:{authorization:`Bearer ${token}`}
                })

                const result = await response.json();
                if(response.ok){
                    setFirstName(result.data.firstName);
                    setLastName(result.data.lastName);
                    setRegNumber(result.data.regNumber);
                }

            }catch(error){
                setErr(error);
            }
        }

        getProfile();
    })

    const handelLogout = async()=>{
        try{
            const confirmed = window.confirm("Are you sure to log out?");

            if(confirmed){
                const response = await fetch("http://localhost:4000/api/user/logout",{
                    method:"POST",
                    headers:{authorization:`Bearer ${token}`}
                })

                const result = await response.json();
                if(response.ok){
                    alert("Log out successful.");
                    navigate("/")
                }else{
                    alert(result.message);
                }
            }else{
                alert("You canceled log out.")
            }

        }catch(error){
            setErr(error);
        }
    }
  return (
    <div>
        <NavBar/>
      <div className="user-profile">
        <p style={{color:"red"}}>{err}</p>
        <form>
            <div className="user-details">
                <label>First Name</label>
                <input value={firstName} readOnly/>
            </div>

            <div className="user-details">
                <label>Last Name</label>
                <input value={lastName} readOnly/>
            </div>

            <div className="user-details">
                <label>Registration Number</label>
                <input value={regNumber} readOnly/>
            </div>
        </form>

        <button onClick={handelLogout} className='logOut-button'>Log out</button>
      </div>
      
    </div>
  )
}

export default StudentProfile
