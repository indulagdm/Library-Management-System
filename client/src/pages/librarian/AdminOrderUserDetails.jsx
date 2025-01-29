import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './adminComponentStyles.css'

const AdminOrderUserDetails = () => {
  const [usersInOrder, setUsersInOrder] = useState([]);
  const [err, setErr] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getUserInOrder = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/order/userDetails",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setUsersInOrder(result.data);
          console.log(result);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };
    getUserInOrder();
  }, [token]);
  return (
    <div>
      <p style={{color:"red"}}>{err}</p>

      <ul className="order-container">
        <li className="order-list">Registration Number</li>
        <li className="order-list">ISBN</li>
        <li className="order-list">Borrow Date</li>
        <li className="order-list">Return Date</li>
      </ul>

      {usersInOrder.map((order) => (
        <ul key={order._id} className="order-container">
          <Link to={`/admin-order-details/${order._id}`} className="order-component">
            <li className="order-list">{order.userID.regNumber}</li>
            <li className="order-list">{order.bookID.ISBN}</li>
            <li className="order-list">
              {new Date(order.borrowDate).toDateString()}
            </li>
            <li className="order-list">
              {new Date(order.returnDate).toDateString()}
            </li>
          </Link>
        </ul>
      ))}
    </div>
  );
};

export default AdminOrderUserDetails;
