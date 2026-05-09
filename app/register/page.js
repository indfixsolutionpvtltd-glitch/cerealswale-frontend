"use client";
import { useState } from "react";
import { db } from "../../lib/firebase"; // Database import
import { ref, set, get } from "firebase/database";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    password: ""
  });

  const handleRegister = async () => {
    const { name, mobile, email, address, password } = formData;

    if (!name || !mobile || !email || !address || !password) {
      alert("Kripya saari details bharein! ⚠️");
      return;
    }

    try {
      // 1. Pehle check karein ki mobile number already registered toh nahi hai
      const userRef = ref(db, 'users/' + mobile);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        alert("Ye Mobile Number pehle se registered hai! ❌");
        return;
      }

      // 2. Database mein permanent save karein
      await set(userRef, {
        name,
        mobile,
        email,
        address,
        password, // Security tip: Real projects mein ise hash karna chahiye
        createdAt: new Date().toISOString()
      });

      alert("Registration Successful! Permanent Database mein save ho gaya ✅");
      window.location.href = "/login";
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4fff2", padding: "20px" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "15px", width: "100%", maxWidth: "400px", boxShadow: "0px 10px 30px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textAlign: "center", color: "#1b5e20", marginBottom: "30px" }}>Naya Account Banayein</h1>
        
        <input type="text" placeholder="Pura Naam" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
        
        <input type="number" placeholder="Mobile Number (Login ID)" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} style={inputStyle} />
        
        <input type="email" placeholder="Email ID" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
        
        <textarea placeholder="Pura Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{...inputStyle, height: "80px"}} />
        
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={inputStyle} />
        
        <button onClick={handleRegister} style={btnStyle}>Register Karein</button>
        
        <p style={{textAlign: "center", marginTop: "15px", fontSize: "14px"}}>
          Pehle se account hai? <a href="/login" style={{color: "#43a047", fontWeight: "bold"}}>Login Karein</a>
        </p>
      </div>
    </div>
  );
}

// Styles
const inputStyle = { width: "100%", padding: "12px", marginTop: "15px", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #ddd", outline: "none" };
const btnStyle = { width: "100%", padding: "14px", marginTop: "25px", background: "#43a047", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" };
