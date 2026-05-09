"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, set, onValue } from "firebase/database";
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
    if (savedCart.length === 0 && !orderSuccess) {
      window.location.href = "/products";
      return;
    }
    setCartItems(savedCart);
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      onValue(ref(db, `users/${user.uid || 'guest'}/address`), (s) => {
        if (s.exists()) setAddress(s.val());
      });
    }
  }, [orderSuccess]);

  const totalAmount = cartItems.reduce((a, i) => a + (Number(i.salePrice || i.price) * i.quantity), 0);

  const handleFinalOrder = async () => {
    // SECURITY LOCK: Do baar click karne par bhi ek hi order banega
    if (isProcessing) return;
    
    if (paymentMethod === "UPI" && utrNumber.length < 6) {
      alert("Kripya valid UTR/Transaction ID bharein!");
      return;
    }

    setIsProcessing(true); // Button disable ho jayega

    // Unique Numerical ID
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
      createdAt: new Date().toLocaleString('en-IN')
    };

    try {
      // Database mein save karein
      await set(ref(db, `orders/${orderId}`), orderData);
      
      // Cart saaf karein taaki loop na bane
      localStorage.removeItem("cart");
      
      // Success state par jayein
      setOrderSuccess(true);
    } catch (e) {
      alert("Order failed: " + e.message);
      setIsProcessing(false);
    }
  };

  if (orderSuccess) return (
    <div style={{ textAlign: "center", padding: "100px 20px" }}>
      <CheckCircle size={80} color="#16a34a" style={{marginBottom:"20px"}}/>
      <h1 style={{color:"#166534"}}>Order Successful!</h1>
      <p style={{color:"#64748b"}}>Aapka order id #{Math.floor(Math.random()*999999)} process ho raha hai.</p>
      <button onClick={() => window.location.href = "/orders"} style={btnStyle}>View My Orders</button>
    </div>
  );

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 20px" }}>
      {!paymentStep ? (
        <div style={cardStyle}>
          <h3 style={{display:"flex", alignItems:"center", gap:"10px", color:"#166534"}}><MapPin/> Shipping Address</h3>
          <input style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName:e.target.value})} placeholder="Full Name" />
          <input style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} placeholder="Phone Number" />
          <textarea style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo:e.target.value})} placeholder="Complete Address" rows="3" />
          <button onClick={()=>setPaymentStep(true)} style={btnStyle}>Proceed to Payment <ArrowRight size={18}/></button>
        </div>
      ) : (
        <div style={cardStyle}>
          <button onClick={()=>setPaymentStep(false)} style={{border:"none", background:"none", cursor:"pointer", marginBottom:"15px", display:"flex", alignItems:"center", gap:"5px", color:"#64748b"}}><ArrowLeft size={16}/> Back</button>
          <h3 style={{display:"flex", alignItems:"center", gap:"10px", color:"#166534"}}><CreditCard/> Total: ₹{totalAmount}</h3>
          
          <div style={{marginBottom:"20px"}}>
             <label style={payOption(paymentMethod === "COD")}>
                <input type="radio" name="pay" checked={paymentMethod === "COD"} onChange={()=>setPaymentMethod("COD")}/> Cash on Delivery (COD)
             </label>
             <label style={payOption(paymentMethod === "UPI")}>
                <input type="radio" name="pay" checked={paymentMethod === "UPI"} onChange={()=>setPaymentMethod("UPI")}/> Pay Online (UPI/QR)
             </label>
          </div>

          {paymentMethod === "UPI" && (
            <div style={{textAlign:"center", background:"#f8fafc", padding:"15px", borderRadius:"12px", marginBottom:"15px"}}>
              <p style={{fontSize:"12px", marginBottom:"10px"}}>Scan & Pay using any UPI App</p>
              <img src="/scan-qr.jpeg" style={{width:"200px", borderRadius:"10px", marginBottom:"10px"}} />
              <input style={inputStyle} placeholder="Enter 12-digit UTR/Transaction ID" onChange={(e)=>setUtrNumber(e.target.value)} />
            </div>
          )}

          <button onClick={handleFinalOrder} disabled={isProcessing} style={btnStyle}>
            {isProcessing ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      )}
    </div>
  );
}

const cardStyle = { background: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", boxSizing:"border-box", fontSize:"14px" };
const btnStyle = { width: "100%", padding: "15px", background: "#166534", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" };
const payOption = (active) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "15px", border: active ? "2px solid #16a34a" : "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "10px", cursor: "pointer", fontSize:"14px", background: active ? "#f0fdf4" : "#fff" });
