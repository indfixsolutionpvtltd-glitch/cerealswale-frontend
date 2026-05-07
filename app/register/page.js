"use client"; // <--- Ye line likhna sabse zaroori hai

import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    const user = { name, email, password };

    // Browser check for localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      alert("Registration Successful ✅");
      window.location.href = "/login";
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4fff2" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "10px", width: "350px", boxShadow: "0px 0px 10px #ccc" }}>
        <h1 style={{ textAlign: "center", color: "#1b5e20" }}>Register</h1>
        
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ width: "100%", padding: "12px", marginTop: "15px", boxSizing: "border-box" }} 
        />
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ width: "100%", padding: "12px", marginTop: "15px", boxSizing: "border-box" }} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ width: "100%", padding: "12px", marginTop: "15px", boxSizing: "border-box" }} 
        />
        
        <button 
          onClick={handleRegister} 
          style={{ width: "100%", padding: "12px", marginTop: "20px", background: "#43a047", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
