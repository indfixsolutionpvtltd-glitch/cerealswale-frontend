"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { CheckCircle, MapPin, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ fullName: "", phone: "", houseNo: "" });
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      onValue(ref(db, `users/${user.uid || 'guest'}/address`), (s) => {
        if (s.exists()) setAddress(s.val());
      });
    }
  }, []);

  const totalAmount = cartItems.reduce((a, i) => a + (Number(i.salePrice || i.price) * i.quantity), 0);

  const handleFinalOrder = async () => {
    if (isProcessing) return;
    if (paymentMethod === "UPI" && utrNumber.length < 6) return alert("Sahi UTR bharein!");

    setIsProcessing(true);
    const orderId = "CW" + Math.floor(100000 + Math.random() * 900000);
    const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "Guest";

    const orderData = {
      orderId: orderId,
      customerName: address.fullName,
      customerEmail: userEmail,
      productName: cartItems.map(i => i.name).join(", "),
      price: totalAmount,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "COD-Order",
      status: "Pending",
      createdAt: new Date().toLocaleString('en-IN') // Sahi date format
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
    <div style={{ textAlign: "center", padding: "100px" }}>
      <CheckCircle size={80} color="#16a34a" />
      <h2>Order Successful!</h2>
      <button onClick={() => window.location.href = "/orders"} style={btnStyle}>View My Orders</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 20px" }}>
      {!paymentStep ? (
        <div style={cardStyle}>
          <h3><MapPin/> Shipping Details</h3>
          <input style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} placeholder="Full Name" />
          <input style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} placeholder="Phone" />
          <input style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} placeholder="Address" />
          <button onClick={()=>setPaymentStep(true)} style={btnStyle}>Next <ArrowRight size={18}/></button>
        </div>
      ) : (
        <div style={cardStyle}>
          <button onClick={()=>setPaymentStep(false)} style={{border:"none", background:"none", cursor:"pointer"}}><ArrowLeft/> Back</button>
          <h3><CreditCard/> Payment (₹{totalAmount})</h3>
          <label style={payLabel}><input type="radio" checked={paymentMethod === "COD"} onChange={()=>setPaymentMethod("COD")}/> COD</label>
          <label style={payLabel}><input type="radio" checked={paymentMethod === "UPI"} onChange={()=>setPaymentMethod("UPI")}/> UPI/QR</label>
          {paymentMethod === "UPI" && (
            <div style={{textAlign:"center"}}>
              <img src="/scan-qr.jpeg" style={{width:"100%", borderRadius:"10px"}} />
              <input style={inputStyle} placeholder="Enter UTR Number" onChange={(e)=>setUtrNumber(e.target.value)} />
            </div>
          )}
          <button onClick={handleFinalOrder} disabled={isProcessing} style={btnStyle}>
            {isProcessing ? "Wait..." : "Place Order Now"}
          </button>
        </div>
      )}
    </div>
  );
}

const cardStyle = { background: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd", boxSizing:"border-box" };
const btnStyle = { width: "100%", padding: "15px", background: "#166534", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" };
const payLabel = { display: "block", padding: "12px", border: "1px solid #eee", borderRadius: "8px", marginBottom: "10px", cursor: "pointer" };
