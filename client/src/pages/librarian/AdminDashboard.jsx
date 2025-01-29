import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import "./adminComponentStyles.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [noOfTeachers, setNoOfTeachers] = useState("");
  const [noOfStudent, setNoOfStudent] = useState("");
  const [noOfBooks, setNoOfBooks] = useState("");
  const [userInOrder, setUserInOrder] = useState("");
  const [bookInOrder, setBookInOrder] = useState("");
  const [err, setErr] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getNoOfStudent = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/user/noOfStudents",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setNoOfStudent(result);
          console.log(result);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };

    const getNoOfTeachers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/user/noOfTeachers",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setNoOfTeachers(result.data);
          console.log(result);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };

    const getUsersInOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/order/noOfUsersInOrder",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setUserInOrder(result.data);
          console.log(result);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };

    const getBooksInOrder = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/order/noOfBooksInOrder",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setBookInOrder(result.data);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };

    const getNoOfBook = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/book/noOfBooks",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setNoOfBooks(result.data);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };

    getNoOfStudent();
    getNoOfTeachers();
    getUsersInOrders();
    getBooksInOrder();
    getNoOfBook();
  });
  return (
    <div>
      <AdminNavBar />

      <p style={{ color: "red" }}>{err}</p>

      <h1>Admin Dashboard</h1>

      <div className="details-container">
        <Link to={""} className="content-container">
          <div className="">
            <p>No of Books</p>
            <p>{noOfBooks}</p>
          </div>
        </Link>

        <Link to={""} className="content-container">
          <div className="">
            <p>No of students</p>
            <p>{noOfStudent}</p>
          </div>
        </Link>

        <Link to={""} className="content-container">
          <div className="">
            <p>No of Teachers</p>
            <p>{noOfTeachers}</p>
          </div>
        </Link>

        <Link to={"/admin-order-user-details"} className="content-container">
          <div className="">
            <p>No of Students who are purchase books</p>
            <p>{userInOrder}</p>
          </div>
        </Link>

        <Link to={"/admin-order-book-details"} className="content-container">
          <div className="">
            <p>No of Books are purchased</p>
            <p>{bookInOrder}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
