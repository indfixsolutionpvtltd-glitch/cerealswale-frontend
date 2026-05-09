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
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.salePrice || item.price) * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone) return alert("Address complete karein! 📍");
    if (paymentMethod === "UPI" && !utrNumber) return alert("Please enter Transaction ID / UTR! 💳");

    const orderId = "CW" + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId: orderId,
      customerName: address.fullName,
      customerEmail: JSON.parse(localStorage.getItem("user"))?.email || "Guest",
      productName: cartItems.map(i => i.name).join(", "), // Multiple items handling
      price: totalAmount,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "N/A",
      status: "Pending",
      createdAt: new Date().toLocaleString('en-IN')
    };

    try {
      await set(ref(db, `orders/${orderId}`), orderData);
      localStorage.removeItem("cart");
      setOrderSuccess(true);
    } catch (e) { alert("Error: " + e.message); }
  };

  if (orderSuccess) return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <CheckCircle size={80} color="#16a34a" />
      <h1>Order Successful!</h1>
      <button onClick={() => window.location.href = "/orders"} style={{ padding: "10px 20px", background: "#16a34a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Check My Orders</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ color: "#166534" }}><MapPin /> Delivery Details</h2>
      <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
        <input placeholder="Full Name" style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} />
        <input placeholder="Phone Number" style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} />
      </div>

      <h2 style={{ color: "#166534" }}><CreditCard /> Payment</h2>
      <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <label style={payLabel}><input type="radio" checked={paymentMethod==="COD"} onChange={()=>setPaymentMethod("COD")} /> Cash on Delivery</label>
        <label style={payLabel}><input type="radio" checked={paymentMethod==="UPI"} onChange={()=>setPaymentMethod("UPI")} /> UPI (Scan QR)</label>
        
        {paymentMethod === "UPI" && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <img src="/scan-qr.jpeg" style={{ width: "200px", borderRadius: "10px" }} />
            <p>Total: ₹{totalAmount}</p>
            <input placeholder="Enter 12 digit UTR/Transaction ID" style={inputStyle} onChange={(e)=>setUtrNumber(e.target.value)} />
          </div>
        )}
      </div>
      <button onClick={handlePlaceOrder} style={{ width: "100%", padding: "15px", background: "#166534", color: "white", border: "none", borderRadius: "8px", marginTop: "20px", fontWeight: "bold", cursor: "pointer" }}>Place Order (₹{totalAmount})</button>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" };
const payLabel = { display: "block", padding: "10px", border: "1px solid #eee", borderRadius: "8px", marginBottom: "10px", cursor: "pointer" };
