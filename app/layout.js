import React from 'react';

export const metadata = {
  title: 'Cerealswale | Smart Agriculture Solutions',
  description: 'Empowering farmers with high-quality seeds',
};

export default function RootLayout({ children }) {
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
          <div style={{ display: "flex", gap: "12px", fontSize: "12px", fontWeight: "600", flexWrap: "wrap", padding: "10px 0" }}>
            <a href="/" style={{ color: "#333", textDecoration: "none" }}>HOME</a>
            <a href="/company" style={{ color: "#333", textDecoration: "none" }}>COMPANY</a>
            <a href="/solutions" style={{ color: "#333", textDecoration: "none" }}>SOLUTIONS</a>
            <a href="/products" style={{ color: "#333", textDecoration: "none" }}>PRODUCTS</a>
            <a href="/network" style={{ color: "#333", textDecoration: "none" }}>NETWORK</a>
            <a href="/careers" style={{ color: "#333", textDecoration: "none" }}>CAREERS</a>
            <a href="/contact" style={{ color: "#333", textDecoration: "none" }}>CONTACT US</a>
            
            {/* Login & Register Links (Ab yahan dikhenge) */}
            <a href="/login" style={{ color: "#2e7d32", textDecoration: "none", border: "1px solid #2e7d32", padding: "2px 8px", borderRadius: "4px" }}>LOGIN</a>
            <a href="/register" style={{ background: "#2e7d32", color: "#fff", textDecoration: "none", padding: "3px 10px", borderRadius: "4px" }}>REGISTER</a>
            
            <a href="/admin" style={{ color: "#d32f2f", textDecoration: "none", border: "1px solid #d32f2f", padding: "2px 8px", borderRadius: "4px" }}>ADMIN</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
