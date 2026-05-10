"use client"; 
import React, { useState, useEffect } from "react";
import { ShoppingCart, ShoppingBag, User, LogOut, MessageCircle } from "lucide-react";

export default function RootLayout({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(null); 

  useEffect(() => {
    const updateData = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.reduce((acc, item) => acc + (item.quantity || 1), 0));
      } catch (e) { setCartCount(0); }

      try {
        // User check (cw_user key use kar rahe hain as per previous updates)
        const savedUser = JSON.parse(localStorage.getItem("cw_user")) || JSON.parse(localStorage.getItem("user"));
        if (savedUser && (savedUser.name || savedUser.displayName || savedUser.email)) {
          setUserName(savedUser.name || savedUser.displayName || savedUser.email.split('@')[0]);
        } else {
          setUserName(""); 
        }
      } catch (e) { setUserName(""); }
    };

    updateData();
    const interval = setInterval(updateData, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cw_user");
    localStorage.removeItem("user");
    setUserName("");
    window.location.href = "/login";
  };

  // WhatsApp Config
  const whatsappNumber = "8398975653";
  const message = "Hello CerealsWale, mujhe products ke baare mein jankari chahiye.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: "#fcfcfc" }}>
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 5%", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          position: "sticky", top: 0, zIndex: 1000, flexWrap: "wrap"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
             <img src="/logo.png" alt="Logo" style={{ height: "45px" }} />
             <span style={{ fontSize: "18px", fontWeight: "bold", color: "#2e7d32" }}>CEREALSWALE</span>
          </div>

          <div style={{ display: "flex", gap: "15px", fontSize: "12px", fontWeight: "600", alignItems: "center" }}>
            <a href="/" style={{ color: "#444", textDecoration: "none" }}>HOME</a>
            
            {userName && (
              <a href="/orders" style={{ color: "#166534", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
                <ShoppingBag size={16} /> MY ORDERS
              </a>
            )}

            <a href="/checkout" style={{ position: "relative", color: "#2e7d32" }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
            </a>

            {(userName === "" || userName === null) ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <a href="/login" style={loginBtn}>LOGIN</a>
                <a href="/register" style={regBtn}>REGISTER</a>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#2e7d32" }}>
                  <User size={16} /> <span style={{textTransform: "capitalize"}}>{userName}</span>
                </div>
                <button onClick={handleLogout} style={logoutBtn} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            )}
            
            <a href="/admin" style={{ color: "#d32f2f", textDecoration: "none", border: "1px solid #d32f2f", padding: "4px 8px", borderRadius: "4px" }}>ADMIN</a>
          </div>
        </nav>

        {children}

        {/* --- WhatsApp Floating Button --- */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          style={whatsappFloatBtn}
          title="Chat with us on WhatsApp"
        >
          <MessageCircle size={30} color="white" />
          <span style={whatsappTooltip}>WhatsApp Help</span>
        </a>
      </body>
    </html>
  );
}

// Existing Styles
const loginBtn = { color: "#2e7d32", textDecoration: "none", border: "1px solid #2e7d32", padding: "5px 12px", borderRadius: "6px" };
const regBtn = { background: "#2e7d32", color: "#fff", textDecoration: "none", padding: "6px 14px", borderRadius: "6px" };
const logoutBtn = { background: "none", border: "none", color: "#d32f2f", cursor: "pointer", display: "flex", alignItems: "center" };
const badgeStyle = { position: "absolute", top: "-8px", right: "-10px", background: "#d32f2f", color: "white", fontSize: "10px", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid white" };

// New WhatsApp Styles
const whatsappFloatBtn = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  backgroundColor: "#25d366",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  zIndex: 9999,
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
  textDecoration: "none"
};

const whatsappTooltip = {
  position: "absolute",
  right: "70px",
  backgroundColor: "#333",
  color: "white",
  padding: "5px 10px",
  borderRadius: "5px",
  fontSize: "12px",
  whiteSpace: "nowrap",
  opacity: 0,
  transition: "opacity 0.3s",
  pointerEvents: "none"
};
