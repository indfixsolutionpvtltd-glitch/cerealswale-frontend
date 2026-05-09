"use client"; 
import React, { useState, useEffect } from "react";
import { ShoppingCart, ShoppingBag } from "lucide-react";

export default function RootLayout({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const updateData = () => {
      // 1. Cart Count Update
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(total);

      // 2. User Name Update (Login check)
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUserName(savedUser.displayName || "User");
      } else {
        setUserName("");
      }
    };

    updateData();
    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 5%", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "sticky", top: 0, zIndex: 1000, flexWrap: "wrap"
        }}>
          {/* Logo Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
             <img src="/logo.png" alt="CATALYST Logo" style={{ height: "50px", width: "auto" }} />
             <span style={{ fontSize: "20px", fontWeight: "bold", color: "#2e7d32" }}>CEREALSWALE</span>
          </div>

          {/* Links Section */}
          <div style={{ display: "flex", gap: "15px", fontSize: "12px", fontWeight: "600", flexWrap: "wrap", alignItems: "center" }}>
            <a href="/" style={linkStyle}>HOME</a>
            <a href="/products" style={linkStyle}>PRODUCTS</a>
            
            {/* AGAR USER LOGIN HAI TO "MY ORDERS" DIKHEGA */}
            {userName && (
              <a href="/orders" style={{ color: "#166534", textDecoration: "none", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                <ShoppingBag size={18} /> MY ORDERS
              </a>
            )}

            <a href="/contact" style={linkStyle}>CONTACT</a>
            
            {/* CART ICON WITH BADGE */}
            <a href="/checkout" style={{ position: "relative", display: "flex", alignItems: "center", color: "#2e7d32", textDecoration: "none" }}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span style={badgeStyle}>{cartCount}</span>
              )}
            </a>

            {/* Login/Register Buttons */}
            {!userName ? (
              <>
                <a href="/login" style={{ color: "#2e7d32", textDecoration: "none", border: "1px solid #2e7d32", padding: "4px 10px", borderRadius: "4px" }}>LOGIN</a>
                <a href="/register" style={{ background: "#2e7d32", color: "#fff", textDecoration: "none", padding: "5px 12px", borderRadius: "4px" }}>REGISTER</a>
              </>
            ) : (
              <span style={{ color: "#2e7d32", fontWeight: "bold" }}>Hi, {userName}</span>
            )}
            
            <a href="/admin" style={{ color: "#d32f2f", textDecoration: "none", border: "1px solid #d32f2f", padding: "4px 10px", borderRadius: "4px" }}>ADMIN</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

// Inline Styles
const linkStyle = { color: "#333", textDecoration: "none" };
const badgeStyle = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  background: "#d32f2f",
  color: "white",
  fontSize: "10px",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  border: "2px solid white"
};
