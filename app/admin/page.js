"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);

  // Admin Verification
  const verifyAdmin = () => {
    if (pass === "Ankur@123") setIsAuthorized(true);
    else alert("Wrong Password! ❌");
  };

  useEffect(() => {
    if (isAuthorized) {
      const ordersRef = ref(db, 'orders');
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setOrders(list.reverse()); // Naye orders upar dikhenge
        }
      });
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <div style={{ padding: "40px", background: "white", borderRadius: "15px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <img src="/logo.png" alt="CATALYST Logo" style={{ height: "60px", marginBottom: "20px" }} />
          <h2>🔐 Admin Login</h2>
          <input type="password" onChange={(e)=>setPass(e.target.value)} style={{ padding: "12px", width: "100%", margin: "20px 0", borderRadius: "8px", border: "1px solid #ddd" }} placeholder="Enter Password" />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#1b5e20", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Verify</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar (Ye ab full screen dikhega) */}
      <div style={{ width: "260px", background: "#1b5e20", color: "white", padding: "30px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
           <img src="/logo.png" alt="CATALYST" style={{ height: "40px", width: "auto", background: "white", padding: "5px", borderRadius: "5px" }} />
           <span style={{ fontSize: "18px", fontWeight: "bold" }}>ADMIN</span>
        </div>
        <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <p style={{ background: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}>📦 Orders ({orders.length})</p>
        <p style={{ padding: "10px", cursor: "pointer" }}>📊 Dashboard</p>
        <p style={{ padding: "10px", cursor: "pointer" }}>🛒 Products</p>
        <p style={{ padding: "10px", color: "#ffcdd2", cursor: "pointer", marginTop: "auto" }}>🚪 Logout</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1>Real-time Orders Overview</h1>
          <button onClick={() => window.location.reload()} style={{ padding: "8px 15px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer", background: "white" }}>Refresh Data</button>
        </header>

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Customer</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Product</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Price</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px", fontWeight: "bold" }}>{order.customerName}</td>
                  <td style={{ padding: "15px" }}>{order.productName}http://googleusercontent.com/image_generation_content/1
