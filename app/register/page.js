"use client";
import React, { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { Phone, User, MapPin, Calendar, Mail, Lock, CheckCircle } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1); // Step 1: Details, Step 2: OTP
  const [formData, setFormData] = useState({
    name: "",
    mobile: "+91",
    email: "",
    address: "",
    dob: "",
    password: ""
  });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Recaptcha Setup
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  // Step 1: Send OTP Logic
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const { name, mobile, email, address, dob, password } = formData;

    if (!name || mobile.length < 13 || !email || !address || !dob || !password) {
      alert("Kripya saari details sahi se bharein! (+91 ke saath mobile number)");
      return;
    }

    setLoading(true);
    try {
      // Pehle check karein mobile already registered toh nahi hai
      const pureMobile = mobile.replace("+91", "");
      const userRef = ref(db, 'users/' + pureMobile);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        alert("Ye Mobile Number pehle se registered hai! ❌");
        setLoading(false);
        return;
      }

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, mobile, appVerifier);
      
      setConfirmationResult(result);
      setStep(2);
      alert("OTP bhej diya gaya hai! 📲");
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  // Step 2: Verify OTP & Save Data
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      
      const pureMobile = formData.mobile.replace("+91", "");

      // Database mein save karein
      await set(ref(db, 'users/' + pureMobile), {
        name: formData.name,
        mobile: pureMobile,
        email: formData.email,
        address: formData.address,
        dob: formData.dob,
        password: formData.password,
        createdAt: new Date().toISOString()
      });

      // Login detail locally save karein
      localStorage.setItem("cw_user", JSON.stringify({
        name: formData.name,
        mobile: pureMobile,
        address: formData.address
      }));

      alert("Registration Successful! CerealsWale mein aapka swagat hai 🌾");
      window.location.href = "/";
    } catch (error) {
      alert("Galat OTP! Kripya sahi code dalein ❌");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div id="recaptcha-container"></div>
      
      <div style={cardStyle}>
        <h1 style={{ color: "#1b5e20", marginBottom: "10px" }}>
          {step === 1 ? "Naya Account" : "OTP Verification"}
        </h1>
        <p style={{ color: "#666", marginBottom: "25px" }}>
          {step === 1 ? "CerealsWale par account banayein" : `Enter OTP sent to ${formData.mobile}`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div style={inputGroup}>
              <User size={18} color="#43a047" />
              <input type="text" placeholder="Pura Naam" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} style={inputStyle} required />
            </div>

            <div style={inputGroup}>
              <Phone size={18} color="#43a047" />
              <input type="text" placeholder="Mobile (+91...)" value={formData.mobile} onChange={(e)=>setFormData({...formData, mobile:e.target.value})} style={inputStyle} required />
            </div>

            <div style={inputGroup}>
              <Mail size={18} color="#43a047" />
              <input type="email" placeholder="Email ID" value={formData.email} onChange={(e)=>setFormData({...formData, email:e.target.value})} style={inputStyle} required />
            </div>

            <div style={inputGroup}>
              <Calendar size={18} color="#43a047" />
              <div style={{width: "100%", textAlign: "left"}}>
                <small style={{fontSize: "10px", color: "#888", display: "block", marginLeft: "10px"}}>Date of Birth</small>
                <input type="date" value={formData.dob} onChange={(e)=>setFormData({...formData, dob:e.target.value})} style={{...inputStyle, border: "none", marginTop: "0"}} required />
              </div>
            </div>

            <div style={inputGroup}>
              <MapPin size={18} color="#43a047" />
              <input type="text" placeholder="Address" value={formData.address} onChange={(e)=>setFormData({...formData, address:e.target.value})} style={inputStyle} required />
            </div>

            <div style={inputGroup}>
              <Lock size={18} color="#43a047" />
              <input type="password" placeholder="Password" value={formData.password} onChange={(e)=>setFormData({...formData, password:e.target.value})} style={inputStyle} required />
            </div>

            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Process ho raha hai..." : "Get OTP 📲"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister}>
            <input type="number" placeholder="6-digit OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} style={{...inputStyle, textAlign: "center", border: "1px solid #ddd", height: "50px", fontSize: "20px", letterSpacing: "5px"}} required />
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? "Verifying..." : "Verify & Register ✅"}
            </button>
            <button type="button" onClick={()=>setStep(1)} style={backBtn}>Number badlein</button>
          </form>
        )}

        {step === 1 && (
          <p style={{ marginTop: "20px", fontSize: "14px" }}>
            Pehle se account hai? <a href="/login" style={{ color: "#2e7d32", fontWeight: "bold", textDecoration: "none" }}>Login Karein</a>
          </p>
        )}
      </div>
    </div>
  );
}

// --- STYLES ---
const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f4fdf4", padding: "20px" };
const cardStyle = { background: "#fff", padding: "40px", borderRadius: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", textAlign: "center" };
const inputGroup = { display: "flex", alignItems: "center", gap: "10px", background: "#f9f9f9", padding: "8px 15px", borderRadius: "12px", border: "1px solid #eee", marginBottom: "12px" };
const inputStyle = { border: "none", background: "none", outline: "none", width: "100%", padding: "10px", fontSize: "14px" };
const btnStyle = { width: "100%", padding: "15px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginTop: "10px", boxShadow: "0 4px 15px rgba(46,125,50,0.2)" };
const backBtn = { background: "none", border: "none", color: "#666", marginTop: "15px", cursor: "pointer", fontSize: "14px" };
