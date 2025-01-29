import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "./studentComponentStyles.css";

const Purchases = () => {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/order/getPursingOrders",
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setOrders(result.data);
          console.log(result);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        setErr(error);
      }
    };
    handleOrders();
  }, [token]);

  const handleExtendPeriod = async (id) => {
    try {
      const confirm = window.confirm("Are you sure to extend time period?");

      if (confirm) {
        const response = await fetch(
          "http://localhost:4000/api/order/extendDate/" + id,
          {
            method: "POST",
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert("Return period extended.");
          window.location.reload();
        } else {
          setErr(result.message);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      }else{
        alert("You are canceled extend time.");
      }
    } catch (error) {
      setErr(error);
    }
  };
  return (
    <div>
      <NavBar />

      <p style={{ color: "red" }}>{err}</p>

      {/* {orders.length === 0 ? (
        <p>You are not purchase book yet.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id}>
              {order.bookID} {order.returnDate}
            </div>
          ))}
        </div>
      )} */}

      <div className="purchase-details">
        <ui className="purchases-header">
          <li>ISBN</li>
          <li>Title</li>
          <li>Return Date</li>
          <li>Extend Period</li>
        </ui>
        {orders.length === 0 ? (
          <p>You are not purchasing book yet.</p>
        ) : (
          <div>
            {" "}
            {orders.map((order) => (
              <ui key={order._id} className="purchases">
                <li>{order.bookID.ISBN}</li> <li>{order.bookID.title}</li>{" "}
                <li>{new Date(order.returnDate).toDateString()}</li>{" "}
                <li>
                  <button
                    className="extend-btn"
                    onClick={() => handleExtendPeriod(order.bookID._id)}
                  >
                    Extend Period
                  </button>
                </li>
              </ui>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
