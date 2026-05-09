"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { CreditCard, Package } from "lucide-react";

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
          .filter(o => o.customerEmail === email); // Sirf email par filter rakhte hain
        
        // Sorting: Naya order sabse upar
        setOrders(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => off(ordersRef);
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#166534", marginBottom: "40px" }}>📦 Mere Orders</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "#f8fafc", borderRadius: "20px" }}>
           <Package size={50} color="#cbd5e1" style={{ marginBottom: "15px" }} />
           <p style={{ color: "#64748b" }}>Abhi tak koi order nahi mila hai.</p>
           <button onClick={() => window.location.href = "/products"} style={{ background: "#166534", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", marginTop: "10px" }}>Start Shopping</button>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={{ background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", marginBottom: "20px", borderLeft: "6px solid #16a34a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#334155", fontSize: "16px", fontWeight: "700" }}>{o.productName}</h3>
                <div style={{ fontSize: "12px", color: "#64748b", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span><b>Order ID:</b> #{o.orderId || o.id.slice(-6)}</span>
                  <span><b>Tareekh:</b> {o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : "Processing..."}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ margin: 0, color: "#16a34a", fontSize: "22px" }}>₹{o.price}</h2>
                <span style={{ fontSize: "11px", background: "#fef3c7", padding: "4px 12px", borderRadius: "20px", fontWeight: "bold", color: "#92400e", display: "inline-block", marginTop: "8px" }}>
                  {o.status}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                <b>Payment:</b> {o.paymentMethod} | <b>UTR:</b> {o.transactionId}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
