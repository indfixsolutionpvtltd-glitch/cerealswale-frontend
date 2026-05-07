"use client";
import { useState, useEffect } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(savedOrders);
    }
  }, []);

  return (
    <div style={{ padding: "40px", background: "#f4fff2", minHeight: "100vh" }}>
      <h1 style={{ color: "#1b5e20", textAlign: "center" }}>📦 My Orders</h1>
      <div style={{ maxWidth: "800px", margin: "20px auto" }}>
        {orders.length === 0 ? (
          <p style={{ textAlign: "center" }}>No orders found yet.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} style={{ background: "white", padding: "20px", borderRadius: "10px", marginBottom: "15px", boxShadow: "0 2px 5px #ccc" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Order #{index + 1001}</strong>
                <span style={{ color: "#2e7d32", fontWeight: "bold" }}>₹{order.price}</span>
              </div>
              <p style={{ margin: "10px 0 0", color: "#666" }}>Product: {order.name}</p>
              <small>Status: <span style={{ color: "orange" }}>Processing</span></small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
