"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { MapPin, CreditCard, Smartphone, Truck, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const userId = "User_Ankur_123"; // Jab Auth integrate hoga toh dynamic hoga
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({
    fullName: "", phone: "", houseNo: "", area: "", pincode: "", city: "Navi Mumbai"
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // 1. Fetch Address
    onValue(ref(db, `users/${userId}/address`), (snapshot) => {
      if (snapshot.exists()) setAddress(snapshot.val());
    });

    // 2. Local Storage se Cart uthao
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  const placeOrder = () => {
    if (!address.fullName || !address.phone) return alert("Please fill address details!");

    const orderId = "ORD" + Math.floor(Math.random() * 1000000);
    const orderData = {
      orderId,
      userId,
      customerName: address.fullName,
      phone: address.phone,
      address: `${address.houseNo}, ${address.area}, ${address.city} - ${address.pincode}`,
      items: cartItems,
      price: totalAmount,
      paymentMode: paymentMethod,
      status: "Pending",
      orderDate: new Date().toLocaleString()
    };

    set(ref(db, `orders/${orderId}`), orderData).then(() => {
      localStorage.removeItem("cart");
      setOrderSuccess(true);
    });
  };

  if (orderSuccess) {
    return (
      <div style={successBox}>
        <CheckCircle size={80} color="#16a34a" />
        <h1>Order Placed Successfully!</h1>
        <p>Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        <button onClick={() => window.location.href = "/"} style={btnStyle}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto", fontFamily: "sans-serif", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
      
      {/* Left: Shipping & Payment */}
      <div>
        <h2 style={sectionTitle}><MapPin /> Shipping Address</h2>
        <div style={cardStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <input placeholder="Full Name" style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName: e.target.value})} />
            <input placeholder="Phone" style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone: e.target.value})} />
            <input placeholder="House/Flat No" style={{...inputStyle, gridColumn: "span 2"}} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo: e.target.value})} />
          </div>
        </div>

        <h2 style={{...sectionTitle, marginTop: "30px"}}><CreditCard /> Payment Method</h2>
        <div style={cardStyle}>
          <div onClick={() => setPaymentMethod("COD")} style={paymentOption(paymentMethod === "COD")}>
            <Truck size={20} /> Cash on Delivery (COD)
          </div>
          <div onClick={() => setPaymentMethod("UPI")} style={paymentOption(paymentMethod === "UPI")}>
            <Smartphone size={20} /> UPI / Scan QR
          </div>

          {paymentMethod === "UPI" && (
            <div style={{ textAlign: "center", marginTop: "20px", padding: "20px", background: "#f8fafc", borderRadius: "10px" }}>
              <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Scan & Pay via any UPI App</p>
              {/* Aapka Upload kiya gaya QR Code */}
              <img src="/scan-qr.jpeg" alt="Payment QR" style={{ width: "200px", borderRadius: "10px", border: "5px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>Payment karne ke baad "Place Order" par click karein.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Order Summary */}
      <div style={{ position: "sticky", top: "20px", height: "fit-content" }}>
        <h2 style={sectionTitle}>Order Summary</h2>
        <div style={cardStyle}>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.salePrice * item.quantity}</span>
            </div>
          ))}
          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "15px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px" }}>
            <span>Total Payable</span>
            <span style={{ color: "#16a34a" }}>₹{totalAmount}</span>
          </div>
          <button onClick={placeOrder} style={{...btnStyle, marginTop: "25px"}}>Confirm & Place Order</button>
        </div>
      </div>
    </div>
  );
}

// Styles
const sectionTitle = { fontSize: "18px", fontWeight: "700", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" };
const cardStyle = { background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" };
const inputStyle = { padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none" };
const paymentOption = (isActive) => ({
  display: "flex", alignItems: "center", gap: "12px", padding: "15px", border: isActive ? "2px solid #16a34a" : "1px solid #e2e8f0",
  borderRadius: "10px", marginBottom: "10px", cursor: "pointer", background: isActive ? "#f0fdf4" : "white", fontWeight: isActive ? "bold" : "normal"
});
const btnStyle = { width: "100%", padding: "15px", background: "#16a34a", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" };
const successBox = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", textAlign: "center" };
