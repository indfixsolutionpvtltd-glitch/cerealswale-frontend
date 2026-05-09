"use client"; 
import React, { useState, useEffect } from "react";
import { ShoppingCart, ShoppingBag, User } from "lucide-react";

export default function RootLayout({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(null); // Pehle null rakhein

  useEffect(() => {
    const updateData = () => {
      // 1. Cart Count Update
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        setCartCount(total);
      } catch (e) { setCartCount(0); }

      // 2. User Check
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser && (savedUser.displayName || savedUser.email)) {
          setUserName(savedUser.displayName || savedUser.email.split('@')[0]);
        } else {
          setUserName(""); // Khali string matlab koi login nahi hai
        }
      } catch (e) { setUserName(""); }
    };

    updateData();
    const interval = setInterval(updateData, 1500); // Thoda gap badhaya performance ke liye
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: "#fcfcfc" }}>
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 5%", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          position: "sticky", top: 0, zIndex: 1000, flexWrap: "wrap"
        }}>
          {/* Logo Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
             <img src="/logo.png" alt="Logo" style={{ height: "45px", width: "auto" }} />
             <span style={{ fontSize: "18px", fontWeight: "bold", color: "#2e7d32" }}>CEREALSWALE</span>
          </div>

          {/* Links Section */}
          <div style={{ display: "flex", gap: "15px", fontSize: "12px", fontWeight: "600", flexWrap: "wrap", alignItems: "center" }}>
            <a href="/" style={linkStyle}>HOME</a>
            <a href="/products" style={linkStyle}>PRODUCTS</a>
            
            {/* AGAR LOGIN HAI TO MY ORDERS DIKHEGA */}
            {userName && (
              <a href="/orders" style={{ color: "#166534", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
                <ShoppingBag size={16} /> MY ORDERS
              </a>
            )}

            {/* CART ICON */}
            <a href="/checkout" style={{ position: "relative", display: "flex", alignItems: "center", color: "#2e7d32", textDecoration: "none" }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
            </a>

            {/* LOGIN / USER SECTION */}
            {userName === "" || userName === null ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <a href="/login" style={loginBtn}>LOGIN</a>
                <a href="/register" style={regBtn}>REGISTER</a>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#2e7d32" }}>
                <User size={16} /> <span style={{textTransform: "capitalize"}}>Hi, {userName}</span>
              </div>
            )}
            
            <a href="/admin" style={{ color: "#d32f2f", textDecoration: "none", border: "1px solid #d32f2f", padding: "4px 8px", borderRadius: "4px", fontSize: "11px" }}>ADMIN</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

// --- Enhanced Styles ---
const linkStyle = { color: "#444", textDecoration: "none" };
const loginBtn = { color: "#2e7d32", textDecoration: "none", border: "1px solid #2e7d32", padding: "5px 12px", borderRadius: "6px" };
const regBtn = { background: "#2e7d32", color: "#fff", textDecoration: "none", padding: "6px 14px", borderRadius: "6px" };
const badgeStyle = {
  position: "absolute", top: "-8px", right: "-10px", background: "#d32f2f", color: "white",
  fontSize: "10px", width: "18px", height: "18px", borderRadius: "50%",
  display: "flex", alignItems: "center", justify-content: "center", fontWeight: "bold", border: "2px solid white"
};
