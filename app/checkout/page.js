"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { MapPin, CreditCard, Smartphone, Truck, CheckCircle, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    fullName: "", phone: "", houseNo: "", area: "", pincode: "", city: "Navi Mumbai"
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      onValue(ref(db, `users/${savedUser.uid || 'guest'}/address`), (snapshot) => {
        if (snapshot.exists()) setAddress(snapshot.val());
      });
    }
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.salePrice || item.price) * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.houseNo) {
      alert("Please complete your shipping address! 📍");
      return;
    }

    if (paymentMethod === "UPI" && utrNumber.length < 6) {
      alert("Please enter a valid Transaction ID / UTR Number! 💳");
      return;
    }

    setIsProcessing(true);
    const orderId = "CW" + Date.now().toString().slice(-6);
    
    const orderData = {
      orderId,
      customerName: address.fullName,
      customerEmail: user?.email || "Guest",
      phone: address.phone,
      fullAddress: `${address.houseNo}, ${address.area}, ${address.city} - ${address.pincode}`,
      items: cartItems,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "N/A",
      status: "Pending",
      createdAt: new Date().toLocaleString()
    };

    try {
      await set(ref(db, `orders/${orderId}`), orderData);
      localStorage.removeItem("cart");
      setOrderSuccess(true);
    } catch (error) {
      alert("Order failed! Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center", padding: "20px" }}>
        <CheckCircle size={80} color="#16a34a" />
        <h1 style={{ color: "#166534", marginTop: "20px" }}>Order Placed Successfully!</h1>
        <p style={{ color: "#64748b" }}>Order ID: #{Date.now().toString().slice(-6)}</p>
        <button onClick={() => window.location.href = "/orders"} style={btnStyle}>View My Orders</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
        
        {/* Left Side */}
        <div>
          <h3 style={sectionTitle}><MapPin size={20}/> Shipping Address</h3>
          <div style={cardStyle}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input placeholder="Full Name" style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} />
              <input placeholder="Phone" style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} />
              <input placeholder="House No/Building" style={{...inputStyle, gridColumn: "span 2"}} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} />
            </div>
          </div>

          <h3 style={{...sectionTitle, marginTop: "30px"}}><CreditCard size={20}/> Payment Method</h3>
          <div style={cardStyle}>
            <label style={paymentLabel(paymentMethod === "COD")}>
              <input type="radio" name="pay" checked={paymentMethod === "COD"} onChange={()=>setPaymentMethod("COD")} /> Cash on Delivery
            </label>
            <label style={paymentLabel(paymentMethod === "UPI")}>
              <input type="radio" name="pay" checked={paymentMethod === "UPI"} onChange={()=>setPaymentMethod("UPI")} /> UPI / Scan QR
            </label>

            {paymentMethod === "UPI" && (
              <div style={{ textAlign: "center", marginTop: "20px", background: "#f8fafc", padding: "20px", borderRadius: "10px" }}>
                <p style={{ fontWeight: "bold", color: "#166534" }}>Scan to Pay: ₹{totalAmount}</p>
                <img src="/scan-qr.jpeg" style={{ width: "200px", margin: "15px 0", borderRadius: "10px" }} />
                <input 
                  placeholder="Enter Transaction ID / UTR" 
                  style={{...inputStyle, width: "100%", border: "2px solid #166534"}} 
                  onChange={(e)=>setUtrNumber(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", height: "fit-content" }}>
          <h3>Summary</h3>
          <div style={{ borderTop: "2px solid #eee", paddingTop: "15px", marginTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
              <span>Total:</span>
              <span style={{ color: "#16a34a" }}>₹{totalAmount}</span>
            </div>
            <button onClick={handlePlaceOrder} disabled={isProcessing} style={{...btnStyle, marginTop: "20px"}}>
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = { background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #eee" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" };
const sectionTitle = { display: "flex", alignItems: "center", gap: "10px", color: "#334155" };
const paymentLabel = (active) => ({ display: "flex", gap: "10px", padding: "15px", border: active ? "2px solid #16a34a" : "1px solid #eee", borderRadius: "10px", marginBottom: "10px", cursor: "pointer", background: active ? "#f0fdf4" : "white" });
const btnStyle = { width: "100%", padding: "15px", background: "#166534", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" };
