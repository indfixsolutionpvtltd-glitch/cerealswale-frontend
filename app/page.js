"use client";

export default function Home() {
  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      background: "#f4fff2",
      minHeight: "100vh",
      margin: 0
    }}>

      {/* Navbar - Fixed and Cleaned */}
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
          <a href="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Home</a>
          <a href="/products" style={{ color: "white", textDecoration: "none" }}>Products</a>
          <a href="/login" style={{ color: "white", textDecoration: "none" }}>Login</a>
          <a href="/register" style={{
            color: "white",
            background: "#1b5e20",
            padding: "8px 18px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold"
          }}>
            Register
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        textAlign: "center",
        padding: "100px 20px",
        background: "linear-gradient(to bottom, #e8f5e9, #f4fff2)"
      }}>
        <h1 style={{
          fontSize: "45px",
          color: "#1b5e20",
          marginBottom: "10px"
        }}>
          आधुनिक खेती के लिए आधुनिक समाधान
        </h1>

        <p style={{
          fontSize: "20px",
          color: "#555",
          marginBottom: "30px"
        }}>
          उन्नत खेती, खुशहाल किसान 🌱
        </p>

        <a href="/products">
          <button style={{
            padding: "15px 35px",
            background: "#43a047",
            color: "white",
            border: "none",
            borderRadius: "30px",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 15px rgba(67, 160, 71, 0.3)"
          }}>
            🛒 Products देखें
          </button>
        </a>
      </div>

      {/* Features Section */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        padding: "60px 20px",
        flexWrap: "wrap"
      }}>
        <FeatureCard title="🌾 Quality Seeds" desc="बेहतरीन गुणवत्ता वाले कृषि उत्पाद" />
        <FeatureCard title="🚚 Fast Delivery" desc="सीधे आपके खेत तक तेज डिलीवरी" />
        <FeatureCard title="👨‍🌾 Farmer Support" desc="कृषि विशेषज्ञों की सलाह" />
      </div>

      {/* Footer */}
      <footer style={{
        background: "#1b5e20",
        color: "white",
        padding: "25px",
        textAlign: "center",
        marginTop: "auto"
      }}>
        <p style={{ margin: 0 }}>© 2026 Cerealswale | <b>CATALYST SERVICE PRIVATE LIMITED</b></p>
      </footer>

    </div>
  );
}

// Helper Component for Features
function FeatureCard({ title, desc }) {
  return (
    <div style={{
      background: "white",
      padding: "30px",
      borderRadius: "15px",
      width: "260px",
      textAlign: "center",
      boxShadow: "0px 10px 20px rgba(0,0,0,0.05)",
      border: "1px solid #e0e0e0"
    }}>
      <h3 style={{ color: "#2e7d32", marginBottom: "10px" }}>{title}</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>{desc}</p>
    </div>
  );
}
