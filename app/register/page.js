"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Phone, Lock, User, MapPin } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [formData, setInfo] = useState({ name: "", mobile: "+91", address: "" });
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Recaptcha setup (Security ke liye zaroori hai)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  // Step 1: OTP bhejna
  const sendOtp = async (e) => {
    e.preventDefault();
    if (formData.mobile.length < 13) return alert("Sahi mobile number (+91 ke saath) bharein!");
    
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, formData.mobile, appVerifier);
      setConfirmationResult(result);
      setStep(2);
      alert("OTP bhej diya gaya hai! 📲");
    } catch (error) {
      console.error(error);
      alert("OTP bhejne mein dikkat hui: " + error.message);
    }
  };

  // Step 2: OTP Verify karna aur Data Save karna
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      await confirmationResult.confirm(otp);
      
      // Firebase Realtime DB mein user save karna
      await set(ref(db, 'users/' + formData.mobile.replace("+91", "")), {
        name: formData.name,
        mobile: formData.mobile.replace("+91", ""),
        address: formData.address,
        createdAt: new Date().toISOString()
      });

      // Local storage mein login details save karna
      localStorage.setItem("cw_user", JSON.stringify({
        name: formData.name,
        mobile: formData.mobile.replace("+91", ""),
        address: formData.address
      }));

      alert("Registration Successful! 🌾");
      window.location.href = "/";
    } catch (error) {
      alert("Galat OTP! ❌");
    }
  };

  return (
    <div style={containerStyle}>
      <div id="recaptcha-container"></div>
      <div style={cardStyle}>
        <h2>{step === 1 ? "Create Account" : "Verify Mobile"}</h2>
        
        {step === 1 ? (
          <form onSubmit={sendOtp}>
            <input placeholder="Full Name" style={inputStyle} onChange={(e)=>setInfo({...formData, name:e.target.value})} required />
            <input placeholder="Mobile (with +91)" style={inputStyle} value={formData.mobile} onChange={(e)=>setInfo({...formData, mobile:e.target.value})} required />
            <input placeholder="Delivery Address" style={inputStyle} onChange={(e)=>setInfo({...formData, address:e.target.value})} required />
            <button type="submit" style={btnStyle}>Get OTP 📲</button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <p>Enter 6-digit OTP sent to {formData.mobile}</p>
            <input placeholder="Enter OTP" style={inputStyle} onChange={(e)=>setOtp(e.target.value)} required />
            <button type="submit" style={btnStyle}>Verify & Register ✅</button>
            <button type="button" onClick={()=>setStep(1)} style={{background:"none", border:"none", color:"#666", marginTop:"10px", cursor:"pointer"}}>Change Number</button>
          </form>
        )}
      </div>
    </div>
  );
}

// Simple Styles
const containerStyle = { height:"80vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f4f7f6" };
const cardStyle = { background:"#fff", padding:"40px", borderRadius:"20px", width:"350px", boxShadow:"0 10px 30px rgba(0,0,0,0.05)", textAlign:"center" };
const inputStyle = { width:"100%", padding:"12px", marginBottom:"15px", borderRadius:"8px", border:"1px solid #ddd", boxSizing:"border-box" };
const btnStyle = { width:"100%", padding:"12px", background:"#2e7d32", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"bold" };
