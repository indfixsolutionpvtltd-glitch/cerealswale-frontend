"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const email = savedUser?.email || "";

    onValue(ref(db, 'orders'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userOrders = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(order => order.customerEmail === email);
        setOrders(userOrders.reverse());
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading Orders...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#166534", marginBottom: "30px" }}>📦 Mere Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", color: "#64748b" }}>Abhi tak koi order nahi kiya gaya hai.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "20px", borderLeft: "5px solid #16a34a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0" }}>{order.items?.[0]?.name} {order.items?.length > 1 ? `+ ${order.items.length - 1} more` : ""}</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Order ID: #{order.orderId}</p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "#94a3b8" }}>Tareekh: {order.createdAt}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0, color: "#166534" }}>₹{order.totalAmount || order.price}</h2>
                <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: "#fef3c7", color: "#92400e", fontWeight: "bold" }}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Complete Payment Button for Pending UPI Orders */}
            {order.status === "Pending" && order.paymentMethod === "UPI" && order.transactionId === "N/A" && (
              <div style={{ marginTop: "15px", padding: "15px", background: "#fffbeb", borderRadius: "10px", border: "1px solid #fde68a" }}>
                <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#92400e" }}>⚠️ Aapka UPI payment verification pending hai.</p>
                <button 
                  onClick={() => window.location.href = "/checkout"} 
                  style={{ background: "#92400e", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                >
                  Complete Payment Now
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
