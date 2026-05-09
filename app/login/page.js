"use client";
import React, { useState } from "react";
import { db } from "../../lib/firebase"; 
import { ref, get } from "firebase/database";
import { LogIn, Phone, Lock } from "lucide-react";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobile || !password) {
      alert("Kripya Mobile aur Password bharein! ⚠️");
      return;
    }

    setLoading(true);
    try {
      // Mobile Number ke basis par user data fetch karna
      const userRef = ref(db, 'users/' + mobile);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        // Password Match check
        if (userData.password === password) {
          // 'cw_user' session key (CerealsWale specific)
          localStorage.setItem("cw_user", JSON.stringify(userData));
          alert(`Welcome back, ${userData.name}! ✅`);
          window.location.href = "/dashboard";
        } else {
          alert("Galat Password! ❌");
        }
      } else {
        alert("Ye Mobile Number registered nahi hai! ❌");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <LogIn size={40} color="#1b5e20" />
          <h2 style={{ color: "#1b5e20", marginTop: "10px" }}>User Login</h2>
        </div>

        <div style={inputGroup}>
          <Phone size={18} color="#666" />
          <input 
            type="number" 
            placeholder="Mobile Number" 
            style={inputStyle} 
            onChange={(e) => setMobile(e.target.value)} 
          />
        </div>

        <div style={inputGroup}>
          <Lock size={18} color="#666" />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button 
          onClick={handleLogin} 
          disabled={loading} 
          style={loading ? { ...btnStyle, opacity: 0.7 } : btnStyle}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Account nahi hai? <a href="/register" style={{ color: "#43a047", fontWeight: "bold", textDecoration: "none" }}>Register karein</a>
        </p>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4fff2" };
const cardStyle = { background: "white", padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "380px", boxShadow: "0px 10px 30px rgba(0,0,0,0.08)" };
const inputGroup = { display: "flex", alignItems: "center", gap: "10px", background: "#f9f9f9", padding: "10px 15px", borderRadius: "10px", marginTop: "15px", border: "1px solid #eee" };
const inputStyle = { border: "none", background: "none", outline: "none", width: "100%", fontSize: "15px" };
const btnStyle = { width: "100%", padding: "14px", marginTop: "25px", background: "#1b5e20", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" };
