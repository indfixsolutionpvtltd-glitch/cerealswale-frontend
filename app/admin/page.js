"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [allOrders, setAllOrders] = useState([]);

  // Admin Verification Function
  const handleAdminLogin = () => {
    // Aap yahan apna secret password set kar sakte hain
    if (adminPass === "Ankur@123") { 
      setIsAdminLoggedIn(true);
    } else {
      alert("Galti: Sahi Admin Password dalein! ❌");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && isAdminLoggedIn) {
      const data = JSON.parse(localStorage.getItem("orders")) || [];
      setAllOrders(data);
    }
  }, [isAdminLoggedIn]);

  // Agar login nahi hai, toh sirf login box dikhao
  if (!isAdminLoggedIn) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", 
        height: "80vh", background: "#f4fff2" 
      }}>
        <div style={{
          background: "white", padding: "40px", borderRadius: "10px", 
          textAlign: "center", boxShadow: "0px 0px 15px #ccc"
        }}>
          <h2 style={{ color: "#1b5e20" }}>🔐 Admin Access Only</h2>
          <p>Please enter admin password to continue</p>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "15px", borderRadius: "5px", border: "1px solid #ccc" }} 
          />
          <button 
            onClick={handleAdminLogin}
            style={{ 
              width: "100%", padding: "12px", marginTop: "20px", 
              background: "#1b5e20", color: "white", border: "none", 
              borderRadius: "8px", cursor: "pointer", fontWeight: "bold" 
            }}
          >
            Verify Admin
          </button>
        </div>
      </div>
    );
  }

  // Agar login ho gaya hai, toh pura Dashboard dikhao
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#1b5e20", color: "white", padding: "20px" }}>
        <h2>Admin Panel</h2>
        <hr />
        <p style={{ cursor: "pointer", fontWeight: "bold" }}>📊 Dashboard</p>
        <p style={{ cursor: "pointer" }}>📦 All Orders</p>
        <p style={{ cursor: "pointer" }}>🌾 Manage Products</p>
        <button 
          onClick={() => setIsAdminLoggedIn(false)}
          style={{ background: "#c62828", color: "white", border: "none", padding: "5px 10px", marginTop: "20px", cursor: "pointer", borderRadius: "5px" }}
        >
          Logout Admin
        </button>
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
            </tr>
          </thead>
          <tbody>
            {allOrders.length === 0 ? (
              <tr><td colSpan="3" style={{ padding: "20px", textAlign: "center" }}>No orders available.</td></tr>
            ) : (
              allOrders.map((order, index) => (
                <tr key={index}>
                  <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>#CW-{index + 101}</td>
                  <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>{order.name}</td>
                  <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>₹{order.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
