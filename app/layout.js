export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {/* Main Navbar */}
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 50px",
          background: "#2e7d32",
          color: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ margin: 0 }}>🌾 Cerealswale</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a>
            <a href="/products" style={{ color: "white", textDecoration: "none" }}>Products</a>
            <a href="/orders" style={{ color: "white", textDecoration: "none" }}>My Orders</a>
            <a href="/login" style={{ color: "white", textDecoration: "none" }}>Login</a>
            <a href="/register" style={{
              color: "white",
              background: "#1b5e20",
              padding: "8px 15px",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold"
            }}>
              Register
            </a>
            {/* Admin link thoda alag dikhe isliye thoda gap */}
            <a href="/admin" style={{ color: "#a5d6a7", textDecoration: "none", fontSize: "14px", marginLeft: "10px" }}>Admin Panel</a>
          </div>
        </nav>

        {/* Iske andar saare pages load honge */}
        {children}
      </body>
    </html>
  );
}
