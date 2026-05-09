"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ fullName: "", phone: "", houseNo: "", area: "", pincode: "", city: "Navi Mumbai" });
  const [paymentStep, setPaymentStep] = useState(false); // Step control
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      onValue(ref(db, `users/${savedUser.uid || 'guest'}/address`), (snapshot) => {
        if (snapshot.exists()) setAddress(snapshot.val());
      });
    }
    setCartItems(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.salePrice || item.price) * item.quantity), 0);

  // Pehle Step ke liye validation
  const proceedToPayment = () => {
    if (!address.fullName || !address.phone || !address.houseNo) {
      alert("Kripya pura address bharein! 📍");
      return;
    }
    setPaymentStep(true);
  };

  // Final Order placement
  const handleFinalOrder = async () => {
    if (paymentMethod === "UPI" && utrNumber.length < 6) {
      alert("Kripya valid Transaction ID (UTR) bharein! 💳");
      return;
    }

    setIsProcessing(true);
    const orderId = "CW" + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId: orderId,
      customerName: address.fullName,
      customerEmail: JSON.parse(localStorage.getItem("user"))?.email || "Guest",
      productName: cartItems.map(i => i.name).join(", "), 
      price: totalAmount,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "COD-Order",
      status: "Pending",
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    try {
      await set(ref(db, `orders/${orderId}`), orderData);
      localStorage.removeItem("cart");
      setOrderSuccess(true);
    } catch (e) {
      alert("Order fail ho gaya: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <CheckCircle size={80} color="#16a34a" />
      <h1 style={{ color: "#166534" }}>Order Successful!</h1>
      <button onClick={() => window.location.href = "/orders"} style={btnStyle}>View My Orders</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      {!paymentStep ? (
        /* STEP 1: ADDRESS DETAILS */
        <div style={cardStyle}>
          <h3 style={titleStyle}><MapPin size={20}/> Shipping Address</h3>
          <input placeholder="Pura Naam" style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} />
          <input placeholder="Mobile Number" style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} />
          <input placeholder="Ghar No / Flat / Building" style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} />
          <input placeholder="Area / Colony" style={inputStyle} value={address.area} onChange={(e)=>setAddress({...address, area:e.target.value})} />
          <button onClick={proceedToPayment} style={btnStyle}>
            Proceed to Payment <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        /* STEP 2: PAYMENT PAGE */
        <div style={cardStyle}>
          <button onClick={() => setPaymentStep(false)} style={{ border: "none", background: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", marginBottom: "15px" }}>
            <ArrowLeft size={16} /> Back to Address
          </button>
          <h3 style={titleStyle}><CreditCard size={20}/> Select Payment Method</h3>
          
          <label style={payOption(paymentMethod === "COD")}>
            <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> Cash on Delivery (COD)
          </label>
          
          <label style={payOption(paymentMethod === "UPI")}>
            <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} /> Online Payment (UPI / QR)
          </label>

          {paymentMethod === "UPI" && (
            <div style={qrBox}>
              <p style={{ fontWeight: "bold", color: "#166534" }}>Amount to Pay: ₹{totalAmount}</p>
              <img src="/scan-qr.jpeg" alt="Scan to Pay" style={{ width: "200px", borderRadius: "10px", margin: "10px 0" }} />
              <p style={{ fontSize: "12px", color: "#64748b" }}>Scan karke payment karein aur niche UTR number daalein</p>
              <input 
                placeholder="Enter 12-digit UTR / Transaction ID" 
                style={{ ...inputStyle, border: "2px solid #16a34a", marginTop: "10px" }} 
                onChange={(e) => setUtrNumber(e.target.value)} 
              />
            </div>
          )}

          <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", marginBottom: "15px" }}>
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
            <button onClick={handleFinalOrder} disabled={isProcessing} style={btnStyle}>
              {isProcessing ? "Processing..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const titleStyle = { display: "flex", alignItems: "center", gap: "10px", color: "#334155", marginBottom: "20px" };
const cardStyle = { background: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: "15px", background: "#166534", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" };
const payOption = (active) => ({ display: "flex", gap: "10px", padding: "15px", border: active ? "2px solid #16a34a" : "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "12px", cursor: "pointer", background: active ? "#f0fdf4" : "#fff" });
const qrBox = { textAlign: "center", marginTop: "10px", padding: "20px", background: "#f8fafc", borderRadius: "15px", border: "1px dashed #cbd5e1" };
