"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { CreditCard } from "lucide-react";

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
            o.customerEmail === email && // Sirf user ka email match ho
            o.createdAt &&              // Tareekh honi zaroori hai
            o.orderId                   // Order ID honi zaroori hai
          );
        
        // Naye orders upar dikhane ke liye sort karein
        setOrders(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => off(ordersRef);
  }, []);

  const handleReorder = (order) => {
    const cartItem = {
      id: order.id,
      name: order.productName,
      price: order.price,
      quantity: 1,
    };
    localStorage.setItem("cart", JSON.stringify([cartItem]));
    window.location.href = "/checkout";
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Loading your orders...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#166534", marginBottom: "40px" }}>📦 Mere Orders</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>Abhi tak koi valid order nahi mila.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "20px", borderLeft: "6px solid #16a34a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1, paddingRight: "15px" }}>
                <h3 style={{ margin: "0 0 5px 0", color: "#334155", fontSize: "16px" }}>{o.productName}</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Order ID: #{o.orderId}</p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "#94a3b8" }}>Tareekh: {o.createdAt}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0, color: "#166534", fontSize: "20px" }}>₹{o.price}</h2>
                <span style={{ fontSize: "11px", background: "#fef3c7", padding: "3px 10px", borderRadius: "20px", fontWeight: "bold", color: "#92400e", display: "inline-block", marginTop: "5px" }}>
                  {o.status}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                <b>Payment:</b> {o.paymentMethod} | <b>UTR:</b> {o.transactionId}
              </div>
              <button 
                onClick={() => handleReorder(o)}
                style={{ background: "#166534", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold", fontSize: "11px" }}
              >
                <CreditCard size={14} /> Re-order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
