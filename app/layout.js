"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
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
      <body style={{ margin: 0, fontFamily: "'Segoe UI', Roboto, sans-serif", background: "transparent" }}>
        <CartProvider>
          
          {/* --- TOP HEADER --- */}
          <nav style={topHeaderStyle}>
            <div style={containerStyle}>
              <div style={topHeaderContent}>
                <div style={logoArea}>
                  <img src="/logo.png" alt="Cerealswale Logo" style={headerLogoStyle} />
                  <span style={brandName}>CEREALSWALE</span>
                </div>
                
                <div style={topNavLinks}>
                  <Link href="/" style={topLink}>HOME</Link>
                  
                  {userName ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={userBadge}>
                        <User size={14} /> <span style={{ textTransform: "capitalize" }}>{userName}</span>
                      </div>
                      <button onClick={handleLogout} style={logoutBtn}><LogOut size={14} /></button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href="/login" style={loginBtn}>LOGIN</Link>
                      <Link href="/register" style={regBtn}>REGISTER</Link>
                    </div>
                  )}
                  
                  <Link href="/admin" style={adminLinkStyle}>ADMIN</Link>
                </div>
              </div>
            </div>
          </nav>

          {/* --- MAIN NAVIGATION --- */}
          <nav style={mainNavStyle}>
            <div style={containerStyle}>
              <div style={mainNavContent}>
                <div style={desktopLinks}>
                  <Link href="/dashboard" style={mainLink}>DASHBOARD</Link>
                  <Link href="/company" style={mainLink}>COMPANY</Link>
                  
                  <div 
                    style={{ position: "relative" }} 
                    onMouseEnter={() => setIsSolutionsOpen(true)}
                    onMouseLeave={() => setIsSolutionsOpen(false)}
                  >
                    <button style={mainLink}>
                      SOLUTIONS <ChevronDown size={14} style={{ marginLeft: "4px" }} />
                    </button>
                    {isSolutionsOpen && (
                      <div style={dropdownStyle}>
                        <Link href="/solutions/farmers" style={dropdownItem}>Solution For Farmers</Link>
                        <Link href="/solutions/entrepreneurs" style={dropdownItem}>Solution For Micro-Entrepreneur</Link>
                        <Link href="/solutions/institutional" style={dropdownItem}>Solution For Institutional-Buyers</Link>
                      </div>
                    )}
                  </div>

                  <Link href="/network" style={mainLink}>NETWORK</Link>
                  <Link href="/careers" style={mainLink}>CAREERS</Link>
                  <Link href="/contact" style={mainLink}>CONTACT US</Link>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  {userName && (
                    <Link href="/orders" style={iconLinkStyle}>
                      <ShoppingBag size={20} /> <span className="hide-mobile">ORDERS</span>
                    </Link>
                  )}
                  <Link href="/checkout" style={{ ...iconLinkStyle, position: "relative" }}>
                    <ShoppingCart size={22} />
                    {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
                  </Link>
                  <div style={mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {isMobileMenuOpen && (
            <div style={mobileDrawer}>
              <Link href="/dashboard" style={mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>DASHBOARD</Link>
              <Link href="/solutions/farmers" style={mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>FOR FARMERS</Link>
              <Link href="/solutions/entrepreneurs" style={mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>FOR ENTREPRENEURS</Link>
              <Link href="/solutions/institutional" style={mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>FOR BUYERS</Link>
              <Link href="/contact" style={mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>CONTACT</Link>
            </div>
          )}

          <main style={{ minHeight: "80vh" }}>
            {children}
          </main>

          {/* --- FOOTER SECTION --- */}
          <footer style={footerStyle}>
            <div style={footerInnerStyle}>
              <div style={footerBrandCard}>
                <img
                  src="/Catalyst.png"
                  alt="Catalyst Service Private Limited"
                  style={footerLogoStyle}
                />

                <h3 style={footerCompanyTitle}>
                  CATALYST SERVICE PRIVATE LIMITED
                </h3>

                <p style={footerAddress}>
                  Office No 505 Juhi Niharika Mirage Kharghar Sector 10 District
                  Raigarh Navi Mumbai 410210
                </p>

                <p style={footerContactText}>
                  ☎️ <strong>Phone:</strong>{" "}
                  <a href="tel:+912231430562" style={footerContactLink}>
                    +91-2231430562
                  </a>
                </p>
              </div>

              <div style={footerSupportCard}>
                <h3 style={footerSupportTitle}>Support</h3>

                <p style={footerContactText}>
                  📬 <strong>Email:</strong>{" "}
                  <a href="mailto:support@cerealswale.com" style={footerContactLink}>
                    support@cerealswale.com
                  </a>
                </p>

                <p style={footerSupportNote}>
                  For order, delivery, refund, and product-related help.
                </p>
              </div>
            </div>

            <div style={footerBottomBar}>
              <p style={{ margin: 0 }}>
                © 2026 CATALYST SERVICE PRIVATE LIMITED. All Rights Reserved.
              </p>

              <div style={footerLinksWrap}>
                <Link href="/privacy-policy" style={footerLink}>Privacy Policy</Link>
                <Link href="/refund-policy" style={footerLink}>Refund Policy</Link>
                <Link href="/shipping-policy" style={footerLink}>Shipping Policy</Link>
                <Link href="/terms-conditions" style={footerLink}>Terms Conditions</Link>
                <Link href="/responsible-disclosure" style={footerLink}>Responsible Disclosure</Link>
              </div>
            </div>
          </footer>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={whatsappFloatBtn}>
            <MessageCircle size={30} color="white" />
          </a>

        </CartProvider>
      </body>
    </html>
  );
}

// --- STYLES ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 15px" };
const topHeaderStyle = { background: "#fff", borderBottom: "1px solid #eee", padding: "10px 0" };
const topHeaderContent = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const logoArea = { display: "flex", alignItems: "center", gap: "10px" };
const headerLogoStyle = { height: "46px", maxWidth: "160px", objectFit: "contain", display: "block" };
const brandName = { fontSize: "18px", fontWeight: "800", color: "#2e7d32", letterSpacing: "0.5px" };
const topNavLinks = { display: "flex", gap: "14px", alignItems: "center" };
const topLink = { textDecoration: "none", color: "#444", fontSize: "13px", fontWeight: "800" };

const mainNavStyle = { background: "#f8fdf9", borderBottom: "2px solid #e8f5e9", padding: "12px 0", position: "sticky", top: 0, zIndex: 1000 };
const mainNavContent = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const desktopLinks = { display: "flex", gap: "20px", alignItems: "center" };
const mainLink = { background: "none", border: "none", textDecoration: "none", color: "#333", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center" };

const dropdownStyle = { position: "absolute", top: "100%", left: 0, background: "white", boxShadow: "0 8px 25px rgba(0,0,0,0.1)", borderRadius: "10px", width: "240px", padding: "8px", zIndex: 1100, border: "1px solid #eee" };
const dropdownItem = { display: "block", padding: "10px", textDecoration: "none", color: "#333", fontSize: "12px", fontWeight: "600", borderRadius: "5px" };

const userBadge = { display: "flex", alignItems: "center", gap: "4px", color: "#2e7d32", fontSize: "12px", fontWeight: "bold", background: "#e8f5e9", padding: "5px 9px", borderRadius: "20px" };
const loginBtn = { color: "#2e7d32", textDecoration: "none", border: "1px solid #2e7d32", padding: "6px 12px", borderRadius: "5px", fontSize: "12px", fontWeight: "800" };
const regBtn = { background: "#2e7d32", color: "#fff", textDecoration: "none", padding: "7px 13px", borderRadius: "5px", fontSize: "12px", fontWeight: "800" };
const logoutBtn = { background: "none", border: "none", color: "#d32f2f", cursor: "pointer" };
const adminLinkStyle = { color: "#d32f2f", textDecoration: "none", border: "1px solid #d32f2f", padding: "5px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "800" };
const iconLinkStyle = { color: "#2e7d32", textDecoration: "none", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" };
const badgeStyle = { position: "absolute", top: "-8px", right: "-10px", background: "#d32f2f", color: "white", fontSize: "10px", width: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", border: "2px solid white" };

const footerStyle = {
  background: "linear-gradient(180deg, #f7fbf7 0%, #eef7ef 100%)",
  padding: "46px 20px 28px",
  borderTop: "1px solid #dfe9df",
  marginTop: "50px"
};

const footerInnerStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 1.35fr) minmax(260px, 0.85fr)",
  gap: "28px",
  maxWidth: "1200px",
  margin: "0 auto"
};

const footerBrandCard = {
  background: "#fff",
  border: "1px solid #e4eee4",
  borderRadius: "8px",
  padding: "22px",
  boxShadow: "0 8px 24px rgba(46, 125, 50, 0.08)"
};

const footerSupportCard = {
  background: "#fff",
  border: "1px solid #e4eee4",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 8px 24px rgba(46, 125, 50, 0.08)",
  alignSelf: "start"
};

const footerLogoStyle = {
  width: "300px",
  maxWidth: "100%",
  height: "auto",
  display: "block",
  marginBottom: "18px",
  borderRadius: "6px"
};

const footerCompanyTitle = {
  margin: "0 0 12px",
  color: "#2e7d32",
  fontSize: "17px",
  fontWeight: "800",
  letterSpacing: "0.2px"
};

const footerAddress = {
  margin: "0 0 14px",
  color: "#334155",
  fontSize: "14px",
  lineHeight: "1.7"
};

const footerSupportTitle = {
  margin: "0 0 16px",
  color: "#111827",
  fontSize: "20px",
  fontWeight: "800"
};

const footerContactText = {
  margin: "0 0 12px",
  color: "#111827",
  fontSize: "15px",
  lineHeight: "1.7"
};

const footerContactLink = {
  color: "#2e7d32",
  textDecoration: "none",
  fontWeight: "700"
};

const footerSupportNote = {
  margin: "12px 0 0",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.6"
};

const footerBottomBar = {
  borderTop: "1px solid #dbe7db",
  paddingTop: "18px",
  margin: "28px auto 0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  maxWidth: "1200px",
  fontSize: "12px",
  color: "#56616f"
};

const footerLinksWrap = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  alignItems: "center"
};

const footerLink = {
  color: "#475569",
  textDecoration: "none",
  transition: "color 0.2s",
  fontWeight: "500"
};

const whatsappFloatBtn = { position: "fixed", bottom: "20px", right: "20px", backgroundColor: "#25d366", width: "55px", height: "55px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 9999, textDecoration: "none" };

const mobileMenuBtn = { display: "none", cursor: "pointer", color: "#2e7d32" };
const mobileDrawer = { position: "fixed", top: "110px", left: 0, right: 0, background: "white", padding: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", zIndex: 1000, display: "flex", flexDirection: "column", gap: "15px" };
const mobileNavLink = { textDecoration: "none", color: "#333", fontWeight: "bold", fontSize: "16px", borderBottom: "1px solid #eee", paddingBottom: "10px" };

if (typeof window !== "undefined") {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      div[style*="desktopLinks"] { display: none !important; }
      div[style*="mobileMenuBtn"] { display: block !important; }
      nav[style*="mainNavContent"] { justify-content: flex-end; gap: 15px; }
    }
    a:hover { color: #2e7d32 !important; }
  `;
  document.head.appendChild(style);
}
