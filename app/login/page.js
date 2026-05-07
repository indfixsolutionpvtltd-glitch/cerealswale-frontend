"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (typeof window !== "undefined") {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser && savedUser.email === email && savedUser.password === password) {
        alert("Login Successful! Welcome to Cerealswale 🌾");
        window.location.href = "/products";
      } else {
        alert("Invalid Email or Password ❌");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4fff2" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "10px", width: "350px", boxShadow: "0px 0px 10px #ccc" }}>
        <h1 style={{ textAlign: "center", color: "#1b5e20", marginBottom: "20px" }}>Login</h1>
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ width: "100%", padding: "12px", marginTop: "15px", boxSizing: "border-box", borderRadius: "5px", border: "1px solid #ccc" }} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ width: "100%", padding: "12px", marginTop: "15px", boxSizing: "border-box", borderRadius: "5px", border: "1px solid #ccc" }} 
        />
        
        <button 
          onClick={handleLogin} 
          style={{ width: "100%", padding: "12px", marginTop: "20px", background: "#43a047", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
        >
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
          Don't have an account? <a href="/register" style={{ color: "#1b5e20", fontWeight: "bold" }}>Register</a>
        </p>
      </div>
    </div>
  );
}
