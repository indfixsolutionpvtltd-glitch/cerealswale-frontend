"use client"; // Client component banaya taaki localStorage read kar sake
import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

export default function RootLayout({ children }) {
  const [cartCount, setCartCount] = useState(0);

  // Cart count ko realtime update karne ke liye logic
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(total);
    };

    updateCount();
    // Har 1 second mein check karega ki cart mein kuch add hua ya nahi
    const interval = setInterval(updateCount, 1000);
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
            <a href="/contact" style={linkStyle}>CONTACT</a>
            
            {/* --- NAYA CART ICON SECTION --- */}
            <a href="/checkout" style={{ position: "relative", display: "flex", alignItems: "center", color: "#2e7d32", textDecoration: "none" }}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span style={badgeStyle}>{cartCount}</span>
              )}
            </a>
            {/* ---------------------------- */}

            <a href="/login" style={{ color: "#2e7d32", textDecoration: "none", border: "1px solid #2e7d32", padding: "4px 10px", borderRadius: "4px" }}>LOGIN</a>
            <a href="/register" style={{ background: "#2e7d32", color: "#fff", textDecoration: "none", padding: "5px 12px", borderRadius: "4px" }}>REGISTER</a>
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
