"use client";
import React, { useState } from "react";
import { db } from "../../lib/firebase"; 
import { ref, get } from "firebase/database";
import { LogIn, Phone, Lock, HelpCircle, X, Calendar } from "lucide-react";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Forget Password States ---
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotDob, setForgotDob] = useState("");

  const handleLogin = async () => {
    if (!mobile || !password) {
      alert("Kripya Mobile aur Password bharein! ⚠️");
      return;
    }
    setLoading(true);
    try {
      const userRef = ref(db, 'users/' + mobile);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          localStorage.setItem("cw_user", JSON.stringify(userData));
          alert(`Welcome back, ${userData.name}! ✅`);
          window.location.href = "/dashboard";
        } else { alert("Galat Password! ❌"); }
      } else { alert("Ye Mobile Number registered nahi hai! ❌"); }
    } catch (error) { alert("Error: " + error.message); }
    finally { setLoading(false); }
  };

  // --- Forget Password Logic ---
  const handleForgotPass = async () => {
    if (!forgotMobile || !forgotDob) {
      alert("Kripya Mobile aur DOB dono bharein!");
      return;
    }
    try {
      const userRef = ref(db, 'users/' + forgotMobile);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.dob === forgotDob) {
          alert(`Success! Aapka Password hai: ${userData.password} 🔑`);
          setShowForgot(false);
        } else { alert("DOB match nahi kar raha! ❌"); }
      } else { alert("User nahi mila! ❌"); }
    } catch (error) { alert("Error: " + error.message); }
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
          <input type="number" placeholder="Mobile Number" style={inputStyle} onChange={(e) => setMobile(e.target.value)} />
        </div>

        <div style={inputGroup}>
          <Lock size={18} color="#666" />
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* Forget Password Link */}
        <div style={{textAlign: 'right', marginTop: '10px'}}>
          <button onClick={() => setShowForgot(true)} style={forgotLinkBtn}>Forgot Password?</button>
        </div>

        <button onClick={handleLogin} disabled={loading} style={loading ? { ...btnStyle, opacity: 0.7 } : btnStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Account nahi hai? <a href="/register" style={{ color: "#43a047", fontWeight: "bold", textDecoration: "none" }}>Register karein</a>
        </p>
      </div>

      {/* --- Forget Password Modal --- */}
      {showForgot && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h3 style={{color: '#1b5e20', margin: 0}}>Find Password</h3>
              <X size={20} cursor="pointer" onClick={() => setShowForgot(false)} />
            </div>
            <p style={{fontSize: '12px', color: '#666'}}>Apna registered mobile aur DOB bharein.</p>
            
            <div style={inputGroup}>
              <Phone size={18} color="#666" />
              <input type="number" placeholder="Mobile Number" style={inputStyle} onChange={(e) => setForgotMobile(e.target.value)} />
            </div>
            <div style={inputGroup}>
              <Calendar size={18} color="#666" />
              <input type="date" style={inputStyle} onChange={(e) => setForgotDob(e.target.value)} />
            </div>

            <button onClick={handleForgotPass} style={{...btnStyle, marginTop: '20px'}}>Check Details</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4fff2" };
const cardStyle = { background: "white", padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "380px", boxShadow: "0px 10px 30px rgba(0,0,0,0.08)" };
const inputGroup = { display: "flex", alignItems: "center", gap: "10px", background: "#f9f9f9", padding: "10px 15px", borderRadius: "10px", marginTop: "15px", border: "1px solid #eee" };
const inputStyle = { border: "none", background: "none", outline: "none", width: "100%", fontSize: "15px" };
const btnStyle = { width: "100%", padding: "14px", marginTop: "25px", background: "#1b5e20", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" };
const forgotLinkBtn = { background: 'none', border: 'none', color: '#43a047', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalCard = { background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '350px' };
