"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { CreditCard, Package, Calendar, Hash } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email || "Guest";

    const ordersRef = ref(db, 'orders');

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(o => o.customerEmail === email);
        
        // Naye orders sabse upar dikhane ke liye
        setOrders(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => off(ordersRef);
  }, []);

  // Order ko wapas Checkout par bhejne ke liye function
  const handlePayNow = (order) => {
    const cartItem = {
      id: order.id,
      name: order.productName,
      price: order.price,
      quantity: 1,
    };
    localStorage.setItem("cart", JSON.stringify([cartItem]));
    window.location.href = "/checkout";
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px", color: "#166534", fontWeight: "bold" }}>Loading Orders...</div>;

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#166534", marginBottom: "30px", fontSize: "28px" }}>📦 Mere Orders</h2>
      
      {orders.length === 0 ? (
        <div style={emptyState}>
           <Package size={60} color="#cbd5e1" />
           <p style={{ color: "#64748b", marginTop: "15px" }}>Abhi tak koi order nahi mila hai.</p>
           <button onClick={() => window.location.href = "/products"} style={shopBtn}>Start Shopping</button>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={orderCard}>
            <div style={cardHeader}>
              <div style={{ flex: 1 }}>
                <h3 style={productTitle}>{o.productName}</h3>
                <div style={infoGrid}>
                  <span style={infoText}><Hash size={14} /> <b>ID:</b> {o.orderId || "CW" + o.id.slice(-6)}</span>
                  <span style={infoText}><Calendar size={14} /> <b>Date:</b> {o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : "N/A"}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={priceText}>₹{o.price}</h2>
                <span style={statusBadge(o.status)}>{o.status}</span>
              </div>
            </div>
            
            <div style={cardFooter}>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                <b>Payment:</b> {o.paymentMethod} | <b>UTR:</b> {o.transactionId || "N/A"}
              </div>
              
              {/* PAYMENT BUTTON - Sirf tab dikhega jab status Pending ho ya payment na hui ho */}
              {(o.status === "Pending" || o.transactionId === "COD-Order") && (
                <button onClick={() => handlePayNow(o)} style={payBtn}>
                  <CreditCard size={16} /> Pay Now
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// --- Professional Styles ---
const orderCard = { background: "#fff", padding: "25px", borderRadius: "18px", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", marginBottom: "20px", border: "1px solid #e2e8f0" };
const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" };
const productTitle = { margin: "0 0 10px 0", color: "#1e293b", fontSize: "18px", fontWeight: "700" };
const infoGrid = { display: "flex", flexDirection: "column", gap: "6px" };
const infoText = { fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" };
const priceText = { margin: 0, color: "#166534", fontSize: "24px", fontWeight: "800" };
const statusBadge = (status) => ({ fontSize: "11px", background: status === "Pending" ? "#fef3c7" : "#dcfce7", padding: "5px 12px", borderRadius: "20px", fontWeight: "bold", color: status === "Pending" ? "#92400e" : "#166534", display: "inline-block", marginTop: "8px", textTransform: "uppercase" });
const cardFooter = { marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" };
const payBtn = { background: "#166534", color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "13px", transition: "0.3s shadow" };
const emptyState = { textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "20px", border: "2px dashed #e2e8f0" };
const shopBtn = { background: "#166534", color: "white", border: "none", padding: "12px 25px", borderRadius: "10px", cursor: "pointer", marginTop: "20px", fontWeight: "bold" };
