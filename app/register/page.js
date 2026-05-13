"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { Phone, User, MapPin, Calendar, Mail, Lock, Smartphone } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", mobile: "+91", email: "", address: "", dob: "", password: ""
  });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FIXED RECAPTCHA LOGIC ---
  const setupRecaptcha = () => {
    try {
      // Agar pehle se verifier hai toh use reset ya delete karein taaki "removed" error na aaye
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        const element = document.getElementById('recaptcha-container');
        if (element) element.innerHTML = ""; 
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          alert("reCAPTCHA expire ho gaya, please try again.");
        }
      });
    } catch (err) {
      console.error("Recaptcha Error:", err);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const { name, mobile, email, address, dob, password } = formData;

    if (!name || mobile.length < 13 || !email || !address || !dob || !password) {
      alert("Kripya saari details sahi se bharein!");
      return;
    }

    setLoading(true);
    try {
      const pureMobile = mobile.replace("+91", "");
      const userRef = ref(db, 'users/' + pureMobile);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        alert("Ye Mobile Number pehle se registered hai! ❌");
        setLoading(false);
        return;
      }

      // Har baar fresh recaptcha setup
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      
      const result = await signInWithPhoneNumber(auth, mobile, appVerifier);
      setConfirmationResult(result);
      setStep(2);
      alert("OTP bhej diya gaya hai! 📲");
      
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
      // Error aane par recaptcha reset karein
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      const pureMobile = formData.mobile.replace("+91", "");

      await set(ref(db, 'users/' + pureMobile), {
        ...formData,
        mobile: pureMobile,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("cw_user", JSON.stringify({
        name: formData.name,
        mobile: pureMobile,
        address: formData.address
      }));

      alert("Registration Successful! ✅");
      window.location.href = "/";
    } catch (error) {
      alert("Galat OTP! ❌");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      {/* Container hamesha DOM mein hona chahiye */}
      <div id="recaptcha-container"></div> 
      
      <div style={cardStyle}>
        <h2 style={{color: "#1b5e20"}}>{step === 1 ? "Naya Account" : "OTP Verify"}</h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div style={inputGroup}><User size={18} color="#43a047"/><input type="text" placeholder="Full Name" onChange={(e)=>setFormData({...formData, name:e.target.value})} style={inputStyle} required /></div>
            <div style={inputGroup}><Phone size={18} color="#43a047"/><input type="text" placeholder="Mobile (+91...)" value={formData.mobile} onChange={(e)=>setFormData({...formData, mobile:e.target.value})} style={inputStyle} required /></div>
            <div style={inputGroup}><Mail size={18} color="#43a047"/><input type="email" placeholder="Email" onChange={(e)=>setFormData({...formData, email:e.target.value})} style={inputStyle} required /></div>
            <div style={inputGroup}><Calendar size={18} color="#43a047"/><input type="date" onChange={(e)=>setFormData({...formData, dob:e.target.value})} style={inputStyle} required /></div>
            <div style={inputGroup}><MapPin size={18} color="#43a047"/><input type="text" placeholder="Full Address" onChange={(e)=>setFormData({...formData, address:e.target.value})} style={inputStyle} required /></div>
            <div style={inputGroup}><Lock size={18} color="#43a047"/><input type="password" placeholder="Password" onChange={(e)=>setFormData({...formData, password:e.target.value})} style={inputStyle} required /></div>
            <button type="submit" style={btnStyle} disabled={loading}>{loading ? "SMS Bhej rahe hain..." : "Get OTP 📲"}</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister}>
            <div style={inputGroup}><Smartphone size={18} color="#43a047"/><input type="number" placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)} style={inputStyle} required /></div>
            <button type="submit" style={btnStyle} disabled={loading}>{loading ? "Verifying..." : "Register ✅"}</button>
            <button type="button" onClick={()=>setStep(1)} style={backBtn}>Number badlein</button>
          </form>
        )}
      </div>
    </div>
  );
}

const containerStyle = { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0fdf4", padding: "20px" };
const cardStyle = { background: "#fff", padding: "30px", borderRadius: "20px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", textAlign: "center" };
const inputGroup = { display: "flex", alignItems: "center", gap: "10px", background: "#f9f9f9", padding: "10px", borderRadius: "10px", marginBottom: "10px", border: "1px solid #eee" };
const inputStyle = { border: "none", background: "none", outline: "none", width: "100%", fontSize: "14px" };
const btnStyle = { width: "100%", padding: "12px", background: "#2e7d32", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" };
const backBtn = { background: "none", border: "none", color: "#888", marginTop: "10px", cursor: "pointer", fontSize: "13px" };
