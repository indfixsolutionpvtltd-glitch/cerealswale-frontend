"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Demo ke liye hum localstorage se hi data utha rahe hain
      const data = JSON.parse(localStorage.getItem("orders")) || [];
      setAllOrders(data);
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#1b5e20", color: "white", padding: "20px" }}>
        <h2>Admin Panel</h2>
        <hr />
        <p style={{ cursor: "pointer", fontWeight: "bold" }}>📊 Dashboard</p>
        <p style={{ cursor: "pointer" }}>📦 All Orders</p>
        <p style={{ cursor: "pointer" }}>🌾 Manage Products</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", background: "#f9f9f9" }}>
        <h1 style={{ color: "#333" }}>Orders Overview</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "#e8f5e9", textAlign: "left" }}>
              <th style={{ padding: "15px", borderBottom: "2px solid #ddd" }}>Order ID</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #ddd" }}>Product</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #ddd" }}>Price</th>
              <th style={{ padding: "15px", borderBottom: "2px solid #ddd" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => (
              <tr key={index}>
                <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>#CW-{index + 101}</td>
                <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>{order.name}</td>
                <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>₹{order.price}</td>
                <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                  <button style={{ background: "#2e7d32", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
