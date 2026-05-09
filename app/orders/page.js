"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { CreditCard, Package, Calendar, Hash, AlertCircle } from "lucide-react";

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
          .filter(o => 
            o.customerEmail === email && 
            o.createdAt && // 👈 Date honi chahiye
            o.createdAt !== "N/A" && // 👈 Date N/A nahi honi chahiye
            o.orderId // 👈 Order ID honi chahiye
          );
        
        // Sorting: Naya order sabse upar
        setOrders(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => off(ordersRef);
  }, []);

  const handlePayNow = (order) => {
    const cartItem = { id: order.id, name: order.productName, price: order.price, quantity: 1 };
    localStorage.setItem("cart", JSON.stringify([cartItem]));
    window.location.href = "/checkout";
  };

  if (loading) return <div style={msgStyle}>Loading Orders...</div>;

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#166534", marginBottom: "30px" }}>📦 Mere Orders</h2>
      
      {orders.length === 0 ? (
        <div style={emptyState}>
           <AlertCircle size={50} color="#cbd5e1" />
           <p style={{ color: "#64748b", marginTop: "15px" }}>Abhi tak koi valid order nahi mila.</p>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={orderCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "18px" }}>{o.productName}</h3>
                <div style={infoBox}>
                  <span style={infoText}><Hash size={14} /> ID: {o.orderId}</span>
                  <span style={infoText}><Calendar size={14} /> Date: {o.createdAt}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0, color: "#166534" }}>₹{o.price}</h2>
                <span style={badgeStyle}>{o.status}</span>
              </div>
            </div>
            
            <div style={footerStyle}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                <b>Payment:</b> {o.paymentMethod} | <b>UTR:</b> {o.transactionId}
              </div>
              {o.status === "Pending" && (
                <button onClick={() => handlePayNow(o)} style={payBtn}>
                  <CreditCard size={14} /> Pay Now
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// --- Styles ---
const orderCard = { background: "#fff", padding: "25px", borderRadius: "18px", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", marginBottom: "20px", border: "1px solid #e2e8f0", borderLeft: "6px solid #16a34a" };
const infoBox = { display: "flex", flexDirection: "column", gap: "5px" };
const infoText = { fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" };
const badgeStyle = { fontSize: "11px", background: "#fef3c7", padding: "5px 12px", borderRadius: "20px", fontWeight: "bold", color: "#92400e", display: "inline-block", marginTop: "8px" };
const footerStyle = { marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" };
const payBtn = { background: "#166534", color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" };
const emptyState = { textAlign: "center", padding: "60px", background: "#fff", borderRadius: "20px", border: "2px dashed #e2e8f0" };
const msgStyle = { textAlign: "center", padding: "100px", color: "#166534", fontWeight: "bold" };
