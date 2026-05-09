"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("cw_user"));
    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Sirf is user ke orders filter karein (Mobile number ke basis par)
        const userOrders = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(order => order.userMobile === savedUser.mobile);
        
        setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      setLoading(false);
    });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock size={16} color="#f59e0b" />;
      case "Processing": return <Loader2 size={16} color="#3b82f6" className="animate-spin" />;
      case "Shipped": return <Truck size={16} color="#8b5cf6" />;
      case "Delivered": return <CheckCircle size={16} color="#10b981" />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Orders load ho rahe hain...</div>;

  return (
    <div style={{ padding: "40px 5%", background: "#f8fdf9", minHeight: "100vh" }}>
      <h2 style={{ color: "#1b5e20", display: "flex", alignItems: "center", gap: "10px" }}>
        <Package color="#1b5e20" /> Mere Orders
      </h2>

      <div style={{ marginTop: "30px" }}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} style={orderCardStyle}>
              <div style={orderHeader}>
                <div>
                  <span style={{ fontSize: "12px", color: "#666" }}>Order ID: #{order.id.slice(-6)}</span>
                  <h4 style={{ margin: "5px 0" }}>{order.productName}</h4>
                </div>
                <div style={statusBadge(order.status)}>
                  {getStatusIcon(order.status)} {order.status}
                </div>
              </div>
              <div style={orderFooter}>
                <span>Quantity: <b>{order.quantity}</b></span>
                <span>Total: <b style={{ color: "#1b5e20" }}>₹{order.price}</b></span>
                <span>Date: {new Date(order.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "50px", background: "white", borderRadius: "15px" }}>
            <p>Aapne abhi tak koi order nahi kiya hai.</p>
            <a href="/products" style={{ color: "#43a047", fontWeight: "bold" }}>Shopping shuru karein</a>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const orderCardStyle = { background: "white", padding: "20px", borderRadius: "15px", marginBottom: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", border: "1px solid #eee" };
const orderHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: "10px" };
const orderFooter = { display: "flex", justifyContent: "space-between", marginTop: "15px", fontSize: "14px", color: "#444" };
const statusBadge = (status) => ({
  display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
  background: status === "Delivered" ? "#dcfce7" : status === "Pending" ? "#fef3c7" : "#eff6ff",
  color: status === "Delivered" ? "#166534" : status === "Pending" ? "#92400e" : "#1e40af"
});
