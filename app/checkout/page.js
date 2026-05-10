"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, set, push } from "firebase/database";
import { CreditCard, CheckCircle, Smartphone, Truck, ExternalLink } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Smart UPI Intent Link (Mobile Apps ke liye)
  const upiId = "cerealswale@ptyes";
  const upiUrl = `upi://pay?pa=${upiId}&pn=CerealsWale&am=${totalAmount}&cu=INR`;

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("cw_user"));
    if (!user) return alert("Login zaroori hai!");

    if (paymentMethod === "UPI" && !utrNumber) {
      return alert("Kripya Transaction ID/UTR bharein!");
    }

    setIsProcessing(true);

    const orderData = {
      userMobile: user.mobile,
      userName: user.name,
      address: user.address,
      productName: cartItems.map(i => i.name).join(", "),
      price: totalAmount,
      quantity: cartItems.length,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "COD-ORDER",
      status: "Pending",
      date: new Date().toISOString()
    };

    try {
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);
      localStorage.removeItem("cart");
      setOrderDone(true);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderDone) return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <CheckCircle size={80} color="#10b981" />
      <h2 style={{ color: "#1b5e20" }}>Order Successfully Placed! ✅</h2>
      <p>Aapke orders "My Orders" section mein dikh jayenge.</p>
      <button onClick={() => window.location.href = "/orders"} style={btnStyle}>View My Orders</button>
    </div>
  );

  return (
    <div style={{ padding: "40px 5%", background: "#f8fdf9", minHeight: "100vh" }}>
      <h2 style={{ color: "#1b5e20" }}>Final Checkout</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
        {/* Order Summary */}
        <div style={sectionBox}>
          <h3>Saaman ki List</h3>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
              <span>{item.name} (x{item.quantity})</span>
              <b>₹{item.price}</b>
            </div>
          ))}
          <hr />
          <div style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }}>Total: ₹{totalAmount}</div>
        </div>

        {/* Payment Method */}
        <div style={sectionBox}>
          <h3>Payment Mode Chunein</h3>
          <div style={{ marginBottom: "20px" }}>
            <label style={payOption}>
              <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              <Truck size={20} /> Cash on Delivery (COD)
            </label>
            <label style={payOption}>
              <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} />
              <Smartphone size={20} /> Pay via UPI (Scan or App)
            </label>
          </div>

          {paymentMethod === "UPI" && (
            <div style={upiBox}>
              <p style={{ fontWeight: "bold", color: "#1b5e20" }}>Payment Karein</p>
              
              {/* Smart App Link (Only works on Mobile) */}
              <a href={upiUrl} style={smartPayBtn}>
                <ExternalLink size={18} /> Open UPI App (PhonePe/GPay)
              </a>

              <p style={{ margin: "15px 0", fontSize: "12px", color: "#666" }}>या niche diye QR ko scan karein:</p>
              
              <img src="/qr-code.png" alt="Payment QR" style={{ width: "180px", border: "5px solid white", borderRadius: "10px" }} />
              
              <div style={{ marginTop: "15px" }}>
                <input 
                  type="text" 
                  placeholder="Transaction ID / UTR Number" 
                  style={inputStyle} 
                  onChange={(e) => setUtrNumber(e.target.value)}
                />
                <p style={{ fontSize: "10px", color: "#666", marginTop: "5px" }}>*Payment ke baad Transaction ID bharna zaroori hai.</p>
              </div>
            </div>
          )}

          <button onClick={handlePlaceOrder} disabled={isProcessing} style={btnStyle}>
            {isProcessing ? "Processing..." : "Place Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const sectionBox = { background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" };
const payOption = { display: "flex", alignItems: "center", gap: "10px", padding: "15px", border: "1px solid #eee", borderRadius: "10px", cursor: "pointer", marginBottom: "10px" };
const upiBox = { background: "#f0fdf4", padding: "20px", borderRadius: "15px", textAlign: "center", marginBottom: "15px", border: "1px dashed #43a047" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box", textAlign: "center" };
const btnStyle = { width: "100%", padding: "15px", background: "#1b5e20", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" };
const smartPayBtn = { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "#43a047", color: "white", padding: "12px", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "14px", marginBottom: "10px" };
