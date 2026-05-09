"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Smartphone, Truck } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ fullName: "", phone: "", houseNo: "", area: "", pincode: "", city: "Navi Mumbai" });
  const [paymentStep, setPaymentStep] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0 && !orderSuccess) {
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
      alert("Kripya address pura bharein!");
      return;
    }
    setPaymentStep(true);
  };

  const handleFinalOrder = async () => {
    // 1. Double click protection
    if (isProcessing) return; 
    
    if (paymentMethod === "UPI" && utrNumber.length < 6) {
      alert("Kripya sahi UTR number bharein!");
      return;
    }

    setIsProcessing(true); // Button disable ho jayega

    const orderId = "CW" + Math.floor(100000 + Math.random() * 900000);
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "Guest";

    // Date ko clean format mein lein
    const currentDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const orderData = {
      orderId: orderId,
      customerName: address.fullName,
      customerEmail: userEmail,
      productName: cartItems.map(i => i.name).join(", "), 
      price: totalAmount,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "COD-Order",
      status: "Pending",
      createdAt: currentDate // Yahan fix kiya hai
    };

    try {
      // Database mein sirf ek baar save karein
      await set(ref(db, `orders/${orderId}`), orderData);
      
      // Cart saaf karein
      localStorage.removeItem("cart");
      
      // Success state
      setOrderSuccess(true);
    } catch (e) {
      alert("Order error: " + e.message);
      setIsProcessing(false);
    }
  };

  if (orderSuccess) return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <CheckCircle size={80} color="#16a34a" />
      <h1 style={{ color: "#166534" }}>Order Successful!</h1>
      <p>Order ID: {cartItems[0]?.orderId}</p>
      <button onClick={() => window.location.href = "/orders"} style={btnStyle}>View My Orders</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
      {!paymentStep ? (
        <div style={cardStyle}>
          <h3 style={titleStyle}><MapPin /> Shipping Address</h3>
          <input style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} placeholder="Full Name" />
          <input style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} placeholder="Phone" />
          <input style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} placeholder="Address" />
          <button onClick={proceedToPayment} style={btnStyle}>Next</button>
        </div>
      ) : (
        <div style={cardStyle}>
          <button onClick={()=>setPaymentStep(false)} style={{border:"none", background:"none", cursor:"pointer"}}><ArrowLeft /> Back</button>
          <h3 style={titleStyle}><CreditCard /> Payment</h3>
          <label style={payOption(paymentMethod === "COD")}>
            <input type="radio" checked={paymentMethod === "COD"} onChange={()=>setPaymentMethod("COD")} /> COD
          </label>
          <label style={payOption(paymentMethod === "UPI")}>
            <input type="radio" checked={paymentMethod === "UPI"} onChange={()=>setPaymentMethod("UPI")} /> Online
          </label>
          {paymentMethod === "UPI" && (
            <div style={{textAlign:"center", padding:"10/px"}}>
              <img src="/scan-qr.jpeg" style={{width:"200px"}} />
              <input style={inputStyle} placeholder="Enter UTR" onChange={(e)=>setUtrNumber(e.target.value)} />
            </div>
          )}
          <button onClick={handleFinalOrder} disabled={isProcessing} style={btnStyle}>
            {isProcessing ? "Placing Order..." : `Pay ₹${totalAmount}`}
          </button>
        </div>
      )}
    </div>
  );
}

const cardStyle = { background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" };
const titleStyle = { display: "flex", alignItems: "center", gap: "10px", color: "#166534" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: "15px", background: "#166534", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" };
const payOption = (active) => ({ display: "flex", gap: "10px", padding: "15px", border: active ? "2px solid #16a34a" : "1px solid #eee", borderRadius: "10px", marginBottom: "10px", cursor: "pointer" });
