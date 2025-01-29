import React, { useEffect, useState } from "react";
import "./studentComponentStyles.css";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const StudentDashboard = () => {
  const token = localStorage.getItem("token");

  const [books, setBooks] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const handleGetBooks = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/book/books", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (response.ok) {
          setBooks(result.data);
          console.log(result);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };

    handleGetBooks();
  }, [token]);
  return (
    <div>
      <NavBar/>
      <h1>Student Dashboard</h1>

      <p style={{ color: "red" }}>{err}</p>

      <div className="book-container">
        {books.map((book) => (
          <div className="book-item" key={book._id}>
            <Link
              to={`/get-book-details/${book._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <p>{book.title}</p>
              <p>{book.author}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
