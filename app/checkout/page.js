"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, set, push } from "firebase/database";
import { CreditCard, CheckCircle, Smartphone, Truck } from "lucide-react";

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

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("cw_user"));
    if (!user) return alert("Login zaroori hai!");

    if (paymentMethod === "UPI" && !utrNumber) {
      return alert("Kripya Transaction ID/UTR bharein!");
    }

    setIsProcessing(true);

    // Order Data Structure
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
      const newOrderRef = push(ordersRef); // Unique ID generate karega
      await set(newOrderRef, orderData);

      localStorage.removeItem("cart"); // Checkout ke baad cart saaf
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
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
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
              <Smartphone size={20} /> Pay via UPI (QR Scan)
            </label>
          </div>

          {paymentMethod === "UPI" && (
            <div style={upiBox}>
              <p>Niche diye gaye QR ko scan karke ₹{totalAmount} pay karein</p>
              <img src="/qr-code.png" alt="Payment QR" style={{ width: "200px", margin: "10px 0" }} />
              <input 
                type="text" 
                placeholder="Transaction ID / UTR Number" 
                style={inputStyle} 
                onChange={(e) => setUtrNumber(e.target.value)}
              />
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
const upiBox = { background: "#f0fdf4", padding: "20px", borderRadius: "10px", textAlign: "center", marginBottom: "15px" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: "15px", background: "#1b5e20", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" };
