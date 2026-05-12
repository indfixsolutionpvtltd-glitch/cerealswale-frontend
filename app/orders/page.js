"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Package, Clock, Truck, CheckCircle, Download, Loader2, MapPin } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("cw_user"));
    if (!savedUser) {
      window.location.href = "/login";
      return;
    }
    setCurrentUser(savedUser);

    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userOrders = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(order => order.userMobile === savedUser.mobile);
        
        setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      setLoading(false);
    });
  }, []);

  // --- Invoice Generation Logic (Updated with Tracking ID) ---
  const downloadInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - ${order.id.slice(-6)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #1b5e20; padding-bottom: 10px; }
            .biz-name { color: #1b5e20; font-size: 28px; font-weight: bold; margin: 0; }
            .details { display: flex; justify-content: space-between; margin-top: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .table th { background-color: #f4fdf2; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="biz-name">CerealsWale</p>
            <p>Quality Grains & Cereals | One Click Par</p>
          </div>
          <div class="details">
            <div>
              <p><strong>Billed To:</strong></p>
              <p>${currentUser?.name}<br>${currentUser?.mobile}<br>${currentUser?.address || 'N/A'}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Invoice Details:</strong></p>
              <p>Order ID: #${order.id.slice(-6)}<br>Date: ${new Date(order.date).toLocaleDateString()}<br>Status: ${order.status}</p>
              ${order.trackingId ? `<p><strong>Tracking ID:</strong> ${order.trackingId}</p>` : ""}
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Product Description</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.productName}</td>
                <td>${order.quantity}</td>
                <td>₹${order.price}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total Amount: ₹${order.price}</div>
          <div class="footer">
            <p>Thank you for shopping with CerealsWale!</p>
            <p>This is a computer generated invoice.</p>
            <button class="no-print" onclick="window.print()" style="margin-top:20px; padding:10px 20px; background:#1b5e20; color:white; border:none; border-radius:5px; cursor:pointer;">Print Invoice</button>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock size={16} color="#f59e0b" />;
      case "Processing": return <Loader2 size={16} color="#3b82f6" className="animate-spin" />;
      case "Shipped": return <Truck size={16} color="#8b5cf6" />;
      case "Delivered": return <CheckCircle size={16} color="#10b981" />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "100px" }}>Orders loading...</div>;

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

              {/* TRACKING ID DISPLAY (IF AVAILABLE) */}
              {order.trackingId && (
                <div style={trackingBoxStyle}>
                  <Truck size={14} /> <b>Tracking ID:</b> {order.trackingId}
                </div>
              )}
              
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button 
                  onClick={() => downloadInvoice(order)}
                  style={invoiceBtnStyle}
                >
                  <Download size={14} /> Download Invoice
                </button>
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
const orderFooter = { display: "flex", justifyContent: "space-between", marginTop: "15px", fontSize: "14px", color: "#444", marginBottom: "10px" };
const invoiceBtnStyle = { display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf2", color: "#1b5e20", border: "1px solid #1b5e20", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold", transition: "0.2s" };
const trackingBoxStyle = { background: "#e8f5e9", color: "#2e7d32", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", border: "1px dashed #2e7d32", marginBottom: "10px" };

const statusBadge = (status) => ({
  display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
  background: status === "Delivered" ? "#dcfce7" : status === "Pending" ? "#fef3c7" : "#eff6ff",
  color: status === "Delivered" ? "#166534" : status === "Pending" ? "#92400e" : "#1e40af"
});
