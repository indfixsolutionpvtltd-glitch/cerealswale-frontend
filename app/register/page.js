"use client";
import { useState } from "react";
import { db } from "../../lib/firebase"; // <-- Path sahi check karein
import { ref, set, get } from "firebase/database";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", mobile: "", email: "", address: "", password: ""
  });

  const handleRegister = async () => {
    const { name, mobile, email, address, password } = formData;
    if (!name || !mobile || !email || !address || !password) return alert("All fields are required!");

    try {
      const userRef = ref(db, 'users/' + mobile);
      const snapshot = await get(userRef);
      if (snapshot.exists()) return alert("Mobile number already registered!");

      await set(userRef, { ...formData, createdAt: new Date().toISOString() });
      alert("Account Created! Database mein save ho gaya ✅");
      window.location.href = "/login";
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{color: "#1b5e20"}}>Create Account</h2>
        <input type="text" placeholder="Full Name" style={inputStyle} onChange={(e)=>setFormData({...formData, name:e.target.value})} />
        <input type="number" placeholder="Mobile Number" style={inputStyle} onChange={(e)=>setFormData({...formData, mobile:e.target.value})} />
        <input type="email" placeholder="Email" style={inputStyle} onChange={(e)=>setFormData({...formData, email:e.target.value})} />
        <input type="text" placeholder="Address" style={inputStyle} onChange={(e)=>setFormData({...formData, address:e.target.value})} />
        <input type="password" placeholder="Password" style={inputStyle} onChange={(e)=>setFormData({...formData, password:e.target.value})} />
        <button onClick={handleRegister} style={btnStyle}>Register</button>
      </div>
    </div>
  );
}

// Styles (Minified)
const containerStyle = { display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#f4fff2" };
const cardStyle = { background:"white", padding:"30px", borderRadius:"12px", width:"350px", boxShadow:"0 5px 15px rgba(0,0,0,0.1)" };
const inputStyle = { width:"100%", padding:"10px", marginTop:"10px", borderRadius:"6px", border:"1px solid #ddd", boxSizing:"border-box" };
const btnStyle = { width:"100%", padding:"12px", marginTop:"20px", background:"#43a047", color:"white", border:"none", borderRadius:"8px", cursor:"pointer" };
