"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, set } from "firebase/database";
import { MapPin, CreditCard, CheckCircle, ArrowRight, ArrowLeft, Smartphone, Truck } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ 
    fullName: "", 
    phone: "", 
    houseNo: "", 
    area: "", 
    pincode: "", 
    city: "Navi Mumbai" 
  });
  
  const [paymentStep, setPaymentStep] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [utrNumber, setUtrNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 1. Cart Items Load Karein
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0 && !orderSuccess) {
      alert("Aapka Cart khali hai! Kripya products add karein.");
      window.location.href = "/products";
      return;
    }
    setCartItems(savedCart);

    // 2. Saved Address Fetch Karein
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      onValue(ref(db, `users/${savedUser.uid || 'guest'}/address`), (snapshot) => {
        if (snapshot.exists()) {
          setAddress(snapshot.val());
        }
      });
    }
  }, [orderSuccess]);

  const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.salePrice || item.price) * item.quantity), 0);

  // Validation for Step 1
  const proceedToPayment = () => {
    if (!address.fullName || !address.phone || !address.houseNo) {
      alert("Kripya Shipping Details puri bharein! 📍");
      return;
    }
    setPaymentStep(true);
  };

  // Final Order placement
  const handleFinalOrder = async () => {
    if (paymentMethod === "UPI" && utrNumber.length < 6) {
      alert("Kripya valid 12-digit UTR ya Transaction ID bharein! 💳");
      return;
    }

    setIsProcessing(true);
    const orderId = "CW" + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      orderId: orderId,
      customerName: address.fullName,
      customerEmail: JSON.parse(localStorage.getItem("user"))?.email || "Guest User",
      productName: cartItems.map(i => i.name).join(", "), 
      price: totalAmount,
      paymentMethod: paymentMethod,
      transactionId: paymentMethod === "UPI" ? utrNumber : "COD-Order",
      status: "Pending",
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    try {
      await set(ref(db, `orders/${orderId}`), orderData);
      localStorage.removeItem("cart"); // Clear cart after order
      setOrderSuccess(true);
    } catch (e) {
      alert("Order placement mein error aaya: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Success Screen
  if (orderSuccess) {
    return (
      <div style={fullPageCenter}>
        <div style={successCard}>
          <CheckCircle size={80} color="#16a34a" />
          <h1 style={{ color: "#166534", margin: "20px 0 10px" }}>Order Successful!</h1>
          <p style={{ color: "#64748b", marginBottom: "30px" }}>Aapka order mil gaya hai. Jald hi confirmation milega.</p>
          <button onClick={() => window.location.href = "/orders"} style={btnPrimary}>
            Check My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: paymentStep ? "1fr" : "1.5fr 1fr", gap: "30px" }}>
        
        {/* LEFT COLUMN: FORMS */}
        <div>
          {!paymentStep ? (
            /* STEP 1: ADDRESS */
            <div style={cardStyle}>
              <h3 style={sectionTitle}><MapPin size={22} color="#166534" /> 1. Shipping Details</h3>
              <div style={grid2}>
                <div style={inputGroup}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} placeholder="Ankur Gupta" />
                </div>
                <div style={inputGroup}>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} placeholder="9876543210" />
                </div>
              </div>
              <div style={inputGroup}>
                <label style={labelStyle}>Address (House No, Building, Area)</label>
                <input style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} placeholder="Plot 10, Kharghar Sector 10" />
              </div>
              <button onClick={proceedToPayment} style={btnPrimary}>
                Proceed to Payment <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            /* STEP 2: PAYMENT */
            <div style={cardStyle}>
              <button onClick={() => setPaymentStep(false)} style={backBtn}>
                <ArrowLeft size={16} /> Back to Address
              </button>
              <h3 style={sectionTitle}><CreditCard size={22} color="#166534" /> 2. Choose Payment Mode</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <label style={payOption(paymentMethod === "COD")}>
                  <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
                  <Truck size={20} /> Cash on Delivery (COD)
                </label>

                <label style={payOption(paymentMethod === "UPI")}>
                  <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} />
                  <Smartphone size={20} /> Online UPI / Scan QR
                </label>
              </div>

              {paymentMethod === "UPI" && (
                <div style={qrSection}>
                  <p style={{ fontWeight: "bold", color: "#166534", marginBottom: "15px" }}>Payable Amount: ₹{totalAmount}</p>
                  <img src="/scan-qr.jpeg" alt="UPI QR" style={qrImage} />
                  <p style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>Scan karke payment karein aur niche Transaction ID bharein</p>
                  <input 
                    placeholder="Enter 12-digit UTR / Ref No." 
                    style={{ ...inputStyle, border: "2px solid #16a34a", marginTop: "15px", textAlign: "center" }}
                    onChange={(e) => setUtrNumber(e.target.value)}
                  />
                </div>
              )}

              <div style={summaryFooter}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
                  <span>Final Total:</span>
                  <span style={{ color: "#166534" }}>₹{totalAmount}</span>
                </div>
                <button onClick={handleFinalOrder} disabled={isProcessing} style={btnPrimary}>
                  {isProcessing ? "Processing Order..." : "Confirm & Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SUMMARY (Only visible on Step 1) */}
        {!paymentStep && (
          <div style={{ position: "sticky", top: "100px", height: "fit-content" }}>
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Order Summary</h3>
              <div style={itemScroll}>
                {cartItems.map((item, idx) => (
                  <div key={idx} style={summaryItem}>
                    <span>{item.name} (x{item.quantity})</span>
                    <b>₹{(item.salePrice || item.price) * item.quantity}</b>
                  </div>
                ))}
              </div>
              <div style={totalRow}>
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Styles ---
const cardStyle = { background: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" };
const sectionTitle = { display: "flex", alignItems: "center", gap: "10px", color: "#1e293b", marginBottom: "25px", borderBottom: "1px solid #f1f5f9", paddingBottom: "15px" };
const inputGroup = { marginBottom: "20px" };
const labelStyle = { display: "block", fontSize: "14px", fontWeight: "600", color: "#64748b", marginBottom: "8px" };
const inputStyle = { width: "100%", padding: "12px 15px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", boxSizing: "border-box", transition: "0.2s" };
const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" };
const btnPrimary = { width: "100%", padding: "16px", background: "#166534", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "0.3s" };
const backBtn = { border: "none", background: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", fontSize: "14px" };
const payOption = (active) => ({ display: "flex", alignItems: "center", gap: "12px", padding: "18px", border: active ? "2px solid #16a34a" : "1px solid #e2e8f0", borderRadius: "15px", cursor: "pointer", background: active ? "#f0fdf4" : "#fff", fontWeight: active ? "bold" : "normal", transition: "0.2s" });
const qrSection = { textAlign: "center", marginTop: "20px", padding: "25px", background: "#f8fafc", borderRadius: "20px", border: "1px dashed #cbd5e1" };
const qrImage = { width: "220px", height: "auto", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", background: "#fff", padding: "10px" };
const summaryFooter = { marginTop: "30px", borderTop: "2px solid #f1f5f9", paddingTop: "20px" };
const itemScroll = { maxHeight: "300px", overflowY: "auto", marginBottom: "20px" };
const summaryItem = { display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#475569", marginBottom: "10px" };
const totalRow = { display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", color: "#166534", borderTop: "1px solid #eee", paddingTop: "15px" };
const fullPageCenter = { display: "flex", alignItems: "center", justifyContent: "center", height: "80vh", padding: "20px" };
const successCard = { background: "#fff", padding: "50px", borderRadius: "30px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "400px" };
