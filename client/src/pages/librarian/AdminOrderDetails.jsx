import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./adminComponentStyles.css";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState([]);
  const [err, setErr] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/order/orderDetails/" + id,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setOrderDetail(result.data);
          console.log(result);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };

    getDetails();
  }, [token, id]);

  return (
    <div>
      <p style={{ color: "red" }}>{err}</p>

      <div className="order-details-component">
        {orderDetail.map((order) => (
          <div key={order._id} className="detail-container">
            <div className="order-detail">
              <label htmlFor="">Registration Number</label>
              <input value={order.userID.regNumber} readOnly />
            </div>

            <div className="order-detail">
              <label htmlFor="">First Name</label>
              <input value={order.userID.firstName} readOnly />
            </div>

            <div className="order-detail">
              <label htmlFor="">Last Name</label>
              <input value={order.userID.lastName} readOnly />
            </div>

            <div className="order-detail">
              <label htmlFor="">ISBN</label>
              <input value={order.bookID.ISBN} readOnly />
            </div>

            <div className="order-detail">
              <label htmlFor="">Title</label>
              <input value={order.bookID.title} readOnly />
            </div>

            <div className="order-detail">
              <label htmlFor="">Author</label>
              <input value={order.bookID.author} readOnly />
            </div>

            <div className="order-detail">
              <label htmlFor="">Return Date</label>
              <input
                value={new Date(order.returnDate).toDateString()}
                readOnly
              />
            </div>

            <div className="order-detail">
              <label htmlFor="">Updated Return Date</label>
              <input
                value={new Date(order.updatedAt).toDateString()}
                readOnly
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
