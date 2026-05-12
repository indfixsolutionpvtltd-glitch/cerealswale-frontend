"use client"; 
import React, { useState, useEffect } from "react";
import { ShoppingCart, ShoppingBag, User, LogOut, MessageCircle, ChevronDown, LogIn, Menu, X } from "lucide-react";
import { CartProvider } from "../context/CartContext"; 

export default function RootLayout({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState(null); 
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateData = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartCount(cart.reduce((acc, item) => acc + (item.quantity || 1), 0));
      } catch (e) { setCartCount(0); }

      try {
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

  const whatsappUrl = `https://wa.me/918398975653?text=${encodeURIComponent("Hello CerealsWale, mujhe products ke baare mein jankari chahiye.")}`;

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#fcfcfc" }}>
        <CartProvider>
          
          {/* --- TOP HEADER (Column 1) --- */}
          <nav style={topHeaderStyle}>
            <div style={containerStyle}>
              <div style={topHeaderContent}>
                <div style={logoArea}>
                  <img src="/logo.png" alt="Logo" style={{ height: "35px" }} />
                  <span style={brandName}>CEREALSWALE</span>
                </div>
                
                <div style={topNavLinks}>
                  <a href="/" style={topLink}>HOME</a>
                  
                  {userName ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={userBadge}>
                        <User size={14} /> <span style={{textTransform: "capitalize"}}>{userName}</span>
                      </div>
                      <button onClick={handleLogout} style={logoutBtn}><LogOut size={14} /></button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a href="/login" style={loginBtn}>LOGIN</a>
                      <a href="/register" style={regBtn}>REGISTER</a>
                    </div>
                  )}
                  
                  <a href="/admin" style={adminLinkStyle}>ADMIN</a>
                </div>
              </div>
            </div>
          </nav>

          {/* --- MAIN NAVIGATION (Column 2) --- */}
          <nav style={mainNavStyle}>
            <div style={containerStyle}>
              <div style={mainNavContent}>
                <div style={desktopLinks}>
                  <a href="/dashboard" style={mainLink}>DASHBOARD</a>
                  <a href="/company" style={mainLink}>COMPANY</a>
                  
                  <div 
                    style={{ position: "relative" }} 
                    onMouseEnter={() => setIsSolutionsOpen(true)}
                    onMouseLeave={() => setIsSolutionsOpen(false)}
                  >
                    <button style={mainLink}>
                      SOLUTIONS <ChevronDown size={14} style={{marginLeft:"4px"}} />
                    </button>
                    {isSolutionsOpen && (
                      <div style={dropdownStyle}>
                        <a href="/solutions/farmers" style={dropdownItem}>Solution For Farmers</a>
                        <a href="/solutions/entrepreneurs" style={dropdownItem}>Solution For Micro-Entrepreneur</a>
                        <a href="/solutions/institutional" style={dropdownItem}>Solution For Institutional-Buyers</a>
                      </div>
                    )}
                  </div>

                  <a href="/network" style={mainLink}>NETWORK</a>
                  <a href="/careers" style={mainLink}>CAREERS</a>
                  <a href="/contact" style={mainLink}>CONTACT US</a>
                </div>

                {/* Right Icons: Cart & Orders */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  {userName && (
                    <a href="/orders" style={iconLinkStyle}>
                      <ShoppingBag size={20} /> <span className="hide-mobile">ORDERS</span>
                    </a>
                  )}
                  <a href="/checkout" style={{ ...iconLinkStyle, position: "relative" }}>
                    <ShoppingCart size={22} />
                    {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
                  </a>
                  {/* Mobile Menu Toggle */}
                  <div style={mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Side Menu */}
          {isMobileMenuOpen && (
            <div style={mobileDrawer}>
               <a href="/dashboard" style={mobileNavLink} onClick={()=>setIsMobileMenuOpen(false)}>DASHBOARD</a>
               <a href="/solutions/farmers" style={mobileNavLink} onClick={()=>setIsMobileMenuOpen(false)}>FOR FARMERS</a>
               <a href="/solutions/entrepreneurs" style={mobileNavLink} onClick={()=>setIsMobileMenuOpen(false)}>FOR ENTREPRENEURS</a>
               <a href="/solutions/institutional" style={mobileNavLink} onClick={()=>setIsMobileMenuOpen(false)}>FOR BUYERS</a>
               <a href="/contact" style={mobileNavLink} onClick={()=>setIsMobileMenuOpen(false)}>CONTACT</a>
            </div>
          )}

          {children}

          {/* WhatsApp Floating Button */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={whatsappFloatBtn}>
            <MessageCircle size={30} color="white" />
          </a>

        </CartProvider>
      </body>
    </html>
  );
}

// --- MOBILE FRIENDLY STYLES ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 15px" };
const topHeaderStyle = { background: "#fff", borderBottom: "1px solid #eee", padding: "8px 0" };
const topHeaderContent = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const logoArea = { display: "flex", alignItems: "center", gap: "8px" };
const brandName = { fontSize: "16px", fontWeight: "bold", color: "#2e7d32", letterSpacing: "0.5px" };
const topNavLinks = { display: "flex", gap: "12px", alignItems: "center" };
const topLink = { textDecoration: "none", color: "#555", fontSize: "11px", fontWeight: "700" };

const mainNavStyle = { background: "#f8fdf9", borderBottom: "2px solid #e8f5e9", padding: "12px 0", position: "sticky", top: 0, zIndex: 1000 };
const mainNavContent = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const desktopLinks = { display: "flex", gap: "20px", alignItems: "center" }; // Responsive handled by CSS/MediaQuery
const mainLink = { background: "none", border: "none", textDecoration: "none", color: "#333", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center" };

const dropdownStyle = { position: "absolute", top: "100%", left: 0, background: "white", boxShadow: "0 8px 25px rgba(0,0,0,0.1)", borderRadius: "10px", width: "240px", padding: "8px", zIndex: 1100, border: "1px solid #eee" };
const dropdownItem = { display: "block", padding: "10px", textDecoration: "none", color: "#333", fontSize: "12px", fontWeight: "600", borderRadius: "5px" };

const userBadge = { display: "flex", alignItems: "center", gap: "4px", color: "#2e7d32", fontSize: "11px", fontWeight: "bold", background: "#e8f5e9", padding: "4px 8px", borderRadius: "20px" };
const loginBtn = { color: "#2e7d32", textDecoration: "none", border: "1px solid #2e7d32", padding: "4px 10px", borderRadius: "5px", fontSize: "10px", fontWeight: "bold" };
const regBtn = { background: "#2e7d32", color: "#fff", textDecoration: "none", padding: "5px 12px", borderRadius: "5px", fontSize: "10px", fontWeight: "bold" };
const logoutBtn = { background: "none", border: "none", color: "#d32f2f", cursor: "pointer" };
const adminLinkStyle = { color: "#d32f2f", textDecoration: "none", border: "1px solid #d32f2f", padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" };
const iconLinkStyle = { color: "#2e7d32", textDecoration: "none", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" };
const badgeStyle = { position: "absolute", top: "-8px", right: "-10px", background: "#d32f2f", color: "white", fontSize: "10px", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid white" };

const whatsappFloatBtn = { position: "fixed", bottom: "20px", right: "20px", backgroundColor: "#25d366", width: "55px", height: "55px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 9999, textDecoration: "none" };

// Mobile specific
const mobileMenuBtn = { display: "none", cursor: "pointer", color: "#2e7d32" }; // Normally handled by media query
const mobileDrawer = { position: "fixed", top: "110px", left: 0, right: 0, background: "white", padding: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", zIndex: 1000, display: "flex", flexDirection: "column", gap: "15px" };
const mobileNavLink = { textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: "16px", borderBottom: "1px solid #eee", paddingBottom: "10px" };

// CSS for hiding desktop links on mobile (Standard approach in Next/React inline styles)
if (typeof window !== "undefined") {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      div[style*="desktopLinks"] { display: none !important; }
      div[style*="mobileMenuBtn"] { display: block !important; }
      nav[style*="mainNavContent"] { justify-content: flex-end; gap: 15px; }
    }
  `;
  document.head.appendChild(style);
}
