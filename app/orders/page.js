"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Package, Clock, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email || "Guest";

    onValue(ref(db, 'orders'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(o => o.customerEmail === email);
        setOrders(list.reverse());
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Order loading ho rahe hain...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#166534", marginBottom: "40px" }}>📦 Mere Orders</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>Abhi tak koi order nahi mila.</p>
      ) : (
        orders.map(o => (
          <div key={o.id} style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "20px", borderLeft: "6px solid #16a34a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#334155" }}>{o.productName}</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Order ID: #{o.orderId}</p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "#94a3b8" }}>Tareekh: {o.createdAt}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0, color: "#16a34a" }}>₹{o.price}</h2>
                <span style={{ fontSize: "12px", background: "#fef3c7", padding: "4px 12px", borderRadius: "20px", fontWeight: "bold", color: "#92400e" }}>
                  {o.status}
                </span>
              </div>
            </div>
            <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f1f5f9", fontSize: "13px", color: "#64748b" }}>
              <b>Payment:</b> {o.paymentMethod} | <b>UTR:</b> {o.transactionId}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
