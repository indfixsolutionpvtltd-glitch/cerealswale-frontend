"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email || "";

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

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#166534", textAlign: "center" }}>📦 Mere Orders</h1>
      {orders.length === 0 ? <p>No orders found.</p> : orders.map(o => (
        <div key={o.id} style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", marginBottom: "20px", borderLeft: "5px solid #16a34a" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: 0 }}>{o.productName || "Product Name"}</h3>
              <p style={{ fontSize: "12px", color: "#666" }}>Order ID: #{o.orderId || o.id}</p>
              <p style={{ fontSize: "12px", color: "#999" }}>Tareekh: {o.createdAt}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ color: "#16a34a", margin: 0 }}>₹{o.price}</h2>
              <span style={{ fontSize: "12px", background: "#fef3c7", padding: "2px 8px", borderRadius: "10px" }}>{o.status}</span>
            </div>
          </div>
          {/* Payment Prompt if UPI and No ID */}
          {o.paymentMethod === "UPI" && o.transactionId === "N/A" && (
            <div style={{ marginTop: "10px", background: "#fee2e2", padding: "10px", borderRadius: "8px", fontSize: "13px" }}>
              ⚠️ Payment Pending! Please complete on Checkout page.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
