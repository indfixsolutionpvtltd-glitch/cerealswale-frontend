export default function Home() {
  return (
    <div style={{
      fontFamily: "Arial",
      background: "#f4fff2",
      minHeight: "100vh"
    }}>

      {/* Navbar */}
     <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 50px",
        background: "#2e7d32",
        color: "white"
      }}>
        <h2>🌾 Cerealswale</h2>

        <div>
          <a href="/" style={{color:"white", marginRight:"20px"}}>Home</a>
          <a href="/products" style={{color:"white", marginRight:"20px"}}>Products</a>
          <a href="/register" style={{
            color:"white", 
            background: "#1b5e20", 
            padding: "8px 15px", 
            borderRadius: "5px", 
            textDecoration: "none"
          }}>
            Register
          </a>
        </div>
      </div>
<div>
  <a href="/" style={{color:"white", marginRight:"20px", textDecoration:"none"}}>Home</a>
  <a href="/products" style={{color:"white", marginRight:"20px", textDecoration:"none"}}>Products</a>
  <a href="/login" style={{color:"white", marginRight:"20px", textDecoration:"none"}}>Login</a>
  <a href="/register" style={{color:"white", background: "#1b5e20", padding: "8px 15px", borderRadius: "5px", textDecoration: "none"}}>Register</a>
</div>
          {/* Hero Section */}
      <div style={{
        textAlign: "center",
        padding: "100px 20px"
      }}>

        <h1 style={{
          fontSize: "50px",
          color: "#1b5e20"
        }}>
          आधुनिक खेती के लिए आधुनिक समाधान
        </h1>

        <p style={{
          fontSize: "22px",
          color: "#555"
        }}>
          उन्नत खेती, खुशहाल किसान 🌱
        </p>

        <a href="/products">
          <button style={{
            padding: "15px 30px",
            background: "#43a047",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer"
          }}>
            🛒 Products देखें
          </button>
        </a>
      </div>

      {/* Features */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        padding: "40px",
        flexWrap: "wrap"
      }}>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "250px",
          boxShadow: "0px 0px 10px #ccc"
        }}>
          <h3>🌾 Quality Seeds</h3>
          <p>बेहतरीन गुणवत्ता वाले कृषि उत्पाद</p>
        </div>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "250px",
          boxShadow: "0px 0px 10px #ccc"
        }}>
          <h3>🚚 Fast Delivery</h3>
          <p>सीधे आपके खेत तक तेज डिलीवरी</p>
        </div>

        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "250px",
          boxShadow: "0px 0px 10px #ccc"
        }}>
          <h3>👨‍🌾 Farmer Support</h3>
          <p>कृषि विशेषज्ञों की सलाह</p>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        background: "#1b5e20",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        <p>© 2026 Cerealswale | CATALYST SERVICE PRIVATE LIMITED</p>
      </div>

    </div>
  );
}
