"use client";
import React, { useEffect, useState } from "react";
import { User, ShoppingBag, LogOut, Package, Home } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Session check
    const savedUser = localStorage.getItem("cw_user");
    if (!savedUser) {
      window.location.href = "/login";
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cw_user");
    window.location.href = "/login";
  };

  if (!user) return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading Dashboard...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fdf9" }}>
      {/* Top Header Navigation */}
      <nav style={navStyle}>
        <div style={{ fontWeight: "bold", fontSize: "20px", color: "#1b5e20" }}>CerealsWale</div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="/products" style={navLink}><Home size={18}/> Products</a>
          <a href="/orders" style={navLink}><Package size={18}/> My Orders</a>
          <button onClick={handleLogout} style={logoutBtn}><LogOut size={16}/> Logout</button>
        </div>
      </nav>

      {/* Welcome Section */}
      <div style={{ padding: "40px 5%" }}>
        <div style={welcomeCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={avatarStyle}><User size={30} color="white" /></div>
            <div>
              <h2 style={{ margin: 0, color: "#1b5e20" }}>Swagat hai, {user.name}! 👋</h2>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Mobile: {user.mobile} | Email: {user.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions / Search Products */}
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#333" }}>Aap Kya Dhund Rahe Hain?</h3>
          <input 
            type="text" 
            placeholder="Products search karein (e.g. Chana Dal, Rice)..." 
            style={searchStyle} 
          />
        </div>
      </div>
    </div>
  );
}

// Dashboard Styles
const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
const navLink = { textDecoration: "none", color: "#444", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" };
const logoutBtn = { background: "#ffebee", color: "#d32f2f", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold" };
const welcomeCard = { background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid #eefae1" };
const avatarStyle = { background: "#43a047", padding: "12px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" };
const searchStyle = { width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #ddd", fontSize: "16px", outline: "none", marginTop: "10px" };
