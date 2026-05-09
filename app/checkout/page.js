"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { MapPin, CreditCard, Smartphone, Truck, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ fullName: "", phone: "", houseNo: "", area: "", pincode: "", city: "Navi Mumbai" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

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

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone) return alert("Kripya address pura bharein! 📍");
    if (paymentMethod === "UPI" && utrNumber.length < 6) return alert("Sahi Transaction ID (UTR) bharein! 💳");

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
    } catch (e) { alert("Order fail ho gaya: " + e.message); }
  };

  if (orderSuccess) return (
    <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "sans-serif" }}>
      <CheckCircle size={80} color="#16a34a" style={{ marginBottom: "20px" }} />
      <h1 style={{ color: "#166534" }}>Order Successful!</h1>
      <p>Aapka Order ID: <b>{Math.random().toString(36).substr(2, 9).toUpperCase()}</b></p>
      <button onClick={() => window.location.href = "/orders"} style={btnStyle}>Check My Orders</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        {/* Address & Payment */}
        <div>
          <h3 style={titleStyle}><MapPin size={20}/> Shipping Details</h3>
          <div style={cardStyle}>
            <input placeholder="Pura Naam" style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} />
            <input placeholder="Mobile Number" style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} />
            <input placeholder="Ghar No / Building" style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} />
          </div>

          <h3 style={{...titleStyle, marginTop: "30px"}}><CreditCard size={20}/> Payment Method</h3>
          <div style={cardStyle}>
            <label style={payOption(paymentMethod === "COD")}>
              <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> Cash on Delivery
            </label>
            <label style={payOption(paymentMethod === "UPI")}>
              <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} /> UPI / Scan QR
            </label>

            {paymentMethod === "UPI" && (
              <div style={qrBox}>
                <p style={{ fontWeight: "bold", color: "#166534" }}>Scan to Pay: ₹{totalAmount}</p>
                <img src="/scan-qr.jpeg" style={{ width: "100%", maxWidth: "200px", borderRadius: "10px", margin: "15px 0" }} />
                <input 
                  placeholder="Enter Transaction ID / UTR" 
                  style={{ ...inputStyle, border: "2px solid #16a34a" }} 
                  onChange={(e) => setUtrNumber(e.target.value)} 
                />
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", height: "fit-content" }}>
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>
          <div style={{ borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "15px" }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{Number(item.salePrice || item.price) * item.quantity}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
            <span>Total Payable:</span>
            <span style={{ color: "#16a34a" }}>₹{totalAmount}</span>
          </div>
          <button onClick={handlePlaceOrder} style={btnStyle}>Confirm Order</button>
        </div>
      </div>
    </div>
  );
}

const titleStyle = { display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", color: "#334155", marginBottom: "15px" };
const cardStyle = { background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #eee" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" };
const payOption = (active) => ({ display: "flex", gap: "10px", padding: "12px", border: active ? "2px solid #16a34a" : "1px solid #eee", borderRadius: "8px", marginBottom: "10px", cursor: "pointer", background: active ? "#f0fdf4" : "#fff" });
const qrBox = { textAlign: "center", marginTop: "15px", padding: "15px", background: "#f8fafc", borderRadius: "10px" };
const btnStyle = { width: "100%", padding: "15px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" };
