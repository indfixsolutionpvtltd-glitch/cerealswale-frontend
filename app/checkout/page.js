"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { MapPin, CreditCard, Smartphone, Truck, CheckCircle, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    fullName: "", phone: "", houseNo: "", area: "", pincode: "", city: "Navi Mumbai"
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // 1. Load User from LocalStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      // Fetch Saved Address from Firebase
      onValue(ref(db, `users/${savedUser.uid || 'guest'}/address`), (snapshot) => {
        if (snapshot.exists()) setAddress(snapshot.val());
      });
    }

    // 2. Load Cart Items
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.salePrice || item.price) * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.houseNo) {
      alert("Please complete your shipping address! 📍");
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
      status: "Pending",
      createdAt: new Date().toLocaleString()
    };

    try {
      await set(ref(db, `orders/${orderId}`), orderData);
      localStorage.removeItem("cart"); // Order ke baad cart saaf
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
        <div style={{ background: "#dcfce7", padding: "20px", borderRadius: "50%", marginBottom: "20px" }}>
          <CheckCircle size={60} color="#16a34a" />
        </div>
        <h1 style={{ color: "#166534" }}>Order Placed Successfully!</h1>
        <p style={{ color: "#64748b", fontSize: "18px" }}>Aapka order mil gaya hai. Ham jald hi aapse sampark karenge.</p>
        <button onClick={() => window.location.href = "/"} style={{ marginTop: "30px", padding: "12px 30px", background: "#166534", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <button onClick={() => window.history.back()} style={{ display: "flex", alignItems: "center", gap: "5px", border: "none", background: "none", cursor: "pointer", color: "#64748b", marginBottom: "20px" }}>
        <ArrowLeft size={18} /> Back to Cart
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>
        
        {/* Left: Address & Payment */}
        <div>
          <section style={sectionStyle}>
            <h3 style={sectionTitle}><MapPin size={20} color="#16a34a"/> Shipping Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input type="text" placeholder="Full Name" style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} />
              <input type="text" placeholder="Phone Number" style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} />
              <input type="text" placeholder="House/Flat No." style={{...inputStyle, gridColumn: "span 2"}} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} />
              <input type="text" placeholder="Area / Landmark" style={inputStyle} value={address.area} onChange={(e)=>setAddress({...address, area:e.target.value})} />
              <input type="text" placeholder="Pincode" style={inputStyle} value={address.pincode} onChange={(e)=>setAddress({...address, pincode:e.target.value})} />
            </div>
          </section>

          <section style={{...sectionStyle, marginTop: "30px"}}>
            <h3 style={sectionTitle}><CreditCard size={20} color="#16a34a"/> Payment Method</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={paymentLabel(paymentMethod === "COD")}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={(e)=>setPaymentMethod(e.target.value)} style={{marginRight: "10px"}} />
                <Truck size={20} /> Cash on Delivery (COD)
              </label>
              
              <label style={paymentLabel(paymentMethod === "UPI")}>
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === "UPI"} onChange={(e)=>setPaymentMethod(e.target.value)} style={{marginRight: "10px"}} />
                <Smartphone size={20} /> UPI / Scan QR Code
              </label>

              {paymentMethod === "UPI" && (
                <div style={{ textAlign: "center", background: "#f8fafc", padding: "20px", borderRadius: "12px", marginTop: "10px", border: "1px dashed #cbd5e1" }}>
                  <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "15px" }}>Scan and Pay ₹{totalAmount}</p>
                  <img src="/scan-qr.jpeg" alt="Payment QR" style={{ width: "220px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "15px" }}>*Payment karne ke baad Confirm button par click karein.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Summary */}
        <div style={{ position: "sticky", top: "20px", height: "fit-content" }}>
          <div style={{ background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ marginTop: 0 }}>Order Summary</h3>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
                  <span>{item.name} (x{item.quantity})</span>
                  <span style={{ fontWeight: "bold" }}>₹{Number(item.salePrice || item.price) * item.quantity}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
              <span>Total</span>
              <span style={{ color: "#166534" }}>₹{totalAmount}</span>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing || cartItems.length === 0}
              style={{ width: "100%", padding: "16px", background: "#166534", color: "white", border: "none", borderRadius: "12px", marginTop: "25px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", opacity: isProcessing ? 0.7 : 1 }}
            >
              {isProcessing ? "Processing..." : "Place Order Now"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Styles
const sectionStyle = { background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" };
const sectionTitle = { display: "flex", alignItems: "center", gap: "10px", margin: "0 0 25px 0", fontSize: "20px" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" };
const paymentLabel = (active) => ({
  display: "flex", alignItems: "center", gap: "10px", padding: "15px", borderRadius: "12px", cursor: "pointer",
  border: active ? "2px solid #16a34a" : "1px solid #e2e8f0", background: active ? "#f0fdf4" : "white", transition: "0.2s"
});
