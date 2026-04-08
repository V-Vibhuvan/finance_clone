import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders").then(res => {
      setOrders(res.data.orders);
    });
  }, []);

  return (
    <div className="container mt-4">

      <h3 className="page-title">Orders</h3>

      <div className="app-card app-shadow">

        <table className="table table-hover table-clean">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Mode</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o, i) => (
              <tr key={i}>
                <td>{o.name}</td>
                <td>{o.qty}</td>
                <td>₹{o.price}</td>
                <td>{o.mode}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}