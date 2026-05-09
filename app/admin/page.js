"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { Users, ShoppingBag, Package, TrendingUp, MapPin, Phone, Trash2, Edit } from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Orders with User Info
    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setOrders(orderList.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      setLoading(false);
    });

    // 2. Fetch Products for Inventory
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const prodList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(prodList);
      }
    });
  }, []);

  // Update Order Status Logic
  const updateStatus = (orderId, newStatus) => {
    update(ref(db, `orders/${orderId}`), { status: newStatus })
      .then(() => alert(`Order Status Updated to ${newStatus} ✅`))
      .catch((err) => alert(err.message));
  };

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>Admin Panel Loading...</div>;

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh", padding: "30px 5%" }}>
      <h1 style={{ color: "#1b5e20", marginBottom: "30px" }}>🛡️ Admin Control Center</h1>

      {/* Stats Overview */}
      <div style={statsGrid}>
        <div style={statCard}><ShoppingBag color="#1b5e20"/> <h3>{orders.length}</h3> <p>Total Orders</p></div>
        <div style={statCard}><Package color="#1b5e20"/> <h3>{products.length}</h3> <p>Products</p></div>
        <div style={statCard}><TrendingUp color="#1b5e20"/> <h3>₹{orders.reduce((a, b) => a + Number(b.price || 0), 0)}</h3> <p>Revenue</p></div>
      </div>

      {/* --- RECENT ORDERS WITH USER DETAILS --- */}
      <div style={sectionBox}>
        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}><ShoppingBag/> Recent Orders</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer & Contact</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={trStyle}>
                  <td style={tdStyle}>#{o.id.slice(-6)}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: "bold" }}>{o.userName}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}><Phone size={12}/> {o.userMobile}</div>
                    <div style={{ fontSize: "11px", color: "#888", maxWidth: "200px" }}><MapPin size={11}/> {o.address}</div>
                  </td>
                  <td style={tdStyle}>{o.productName}</td>
                  <td style={tdStyle}>₹{o.price}</td>
                  <td style={tdStyle}>
                    <span style={statusTag(o.status)}>{o.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <select 
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      style={dropdownStyle}
                      value={o.status}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" };
const statCard = { background: "#fff", padding: "20px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" };
const sectionBox = { background: "#fff", padding: "25px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "14px" };
const thStyle = { padding: "15px", borderBottom: "2px solid #eee", color: "#666" };
const tdStyle = { padding: "15px", borderBottom: "1px solid #eee" };
const trStyle = { transition: "0.2s" };
const dropdownStyle = { padding: "5px 10px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "12px", cursor: "pointer" };
const statusTag = (status) => ({
  padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold",
  background: status === "Delivered" ? "#dcfce7" : status === "Pending" ? "#fff3cd" : "#e0f2fe",
  color: status === "Delivered" ? "#166534" : status === "Pending" ? "#856404" : "#075985"
});
