"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Smartphone, Truck } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ 
    fullName: "", phone: "", houseNo: "", area: "", pincode: "", city: "Navi Mumbai" 
  });
  const [paymentStep, setPaymentStep] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0 && !orderSuccess) {
      alert("Aapka Cart khali hai!");
      window.location.href = "/products";
      return;
    }
    setCartItems(savedCart);

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      onValue(ref(db, `users/${savedUser.uid || 'guest'}/address`), (snapshot) => {
        if (snapshot.exists()) setAddress(snapshot.val());
      });
    }
  }, [orderSuccess]);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.salePrice || item.price) * item.quantity), 0);

  const proceedToPayment = () => {
    if (!address.fullName || !address.phone || !address.houseNo) {
      alert("Kripya Shipping Details puri bharein! 📍");
      return;
    }
    setPaymentStep(true);
  };

  const handleFinalOrder = async () => {
    if (paymentMethod === "UPI" && utrNumber.length < 6) {
      alert("Kripya valid Transaction ID (UTR) bharein! 💳");
      return;
    }

    setIsProcessing(true);
    const orderId = "CW" + Math.floor(100000 + Math.random() * 900000);
    
    // YAHAN FIX KIYA HAI (Double line hata di gayi hai)
    const orderData = {
      orderId: orderId,
      customerName: address.fullName,
      customerEmail: JSON.parse(localStorage.getItem("user"))?.email || "Guest",
      productName: cartItems.map(i => i.name).join(", "), 
      price: totalAmount,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "COD-Order",
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    try {
      await set(ref(db, `orders/${orderId}`), orderData);
      localStorage.removeItem("cart");
      setOrderSuccess(true);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <CheckCircle size={80} color="#16a34a" />
      <h1 style={{ color: "#166534" }}>Order Successful!</h1>
      <button onClick={() => window.location.href = "/orders"} style={btnPrimary}>Check My Orders</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      {!paymentStep ? (
        <div style={cardStyle}>
          <h3 style={sectionTitle}><MapPin size={22} color="#166534" /> 1. Shipping Details</h3>
          <input style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} placeholder="Full Name" />
          <input style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} placeholder="Phone Number" />
          <input style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} placeholder="Address" />
          <button onClick={proceedToPayment} style={btnPrimary}>Proceed to Payment <ArrowRight size={18} /></button>
        </div>
      ) : (
        <div style={cardStyle}>
          <button onClick={() => setPaymentStep(false)} style={backBtn}><ArrowLeft size={16} /> Back</button>
          <h3 style={sectionTitle}><CreditCard size={22} color="#166534" /> 2. Payment</h3>
          <label style={payOption(paymentMethod === "COD")}>
            <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> <Truck size={20} /> COD
          </label>
          <label style={payOption(paymentMethod === "UPI")}>
            <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} /> <Smartphone size={20} /> UPI / QR
          </label>
          {paymentMethod === "UPI" && (
            <div style={qrSection}>
              <img src="/scan-qr.jpeg" style={{ width: "200px", borderRadius: "10px" }} />
              <input placeholder="Enter UTR Number" style={inputStyle} onChange={(e)=>setUtrNumber(e.target.value)} />
            </div>
          )}
          <button onClick={handleFinalOrder} disabled={isProcessing} style={btnPrimary}>
            {isProcessing ? "Processing..." : `Confirm Order (₹${totalAmount})`}
          </button>
        </div>
      )}
    </div>
  );
}

// Minimal Styles
const cardStyle = { background: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" };
const sectionTitle = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "10px", border: "1px solid #ddd" };
const btnPrimary = { width: "100%", padding: "15px", background: "#166534", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" };
const backBtn = { border: "none", background: "none", color: "#666", cursor: "pointer", marginBottom: "10px" };
const payOption = (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "15px", border: active ? "2px solid #16a34a" : "1px solid #eee", borderRadius: "10px", marginBottom: "10px", cursor: "pointer" });
const qrSection = { textAlign: "center", background: "#f8fafc", padding: "20px", borderRadius: "10px" };
