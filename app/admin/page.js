"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { ShoppingBag, Package, Trash2, ShieldCheck, LogOut, Edit3, Truck, MapPin } from "lucide-react";

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const SECRET_ADMIN_PASSWORD = "Ram@123"; 

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status options with emojis
  const statusOptions = [
    "🚚 Order Placed",
    "🚚 Shipped",
    "🚚 Out for Delivery",
    "✅ Delivered"
  ];

  const fetchAdminData = () => {
    onValue(ref(db, 'products'), (snapshot) => {
      const data = snapshot.val();
      if (data) setProducts(Object.keys(data).map(key => ({ id: key, ...data[key] })));
    });
    onValue(ref(db, 'orders'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setOrders(orderList.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_authenticated") === "true") {
      setIsAdminLoggedIn(true);
      fetchAdminData();
    } else { setLoading(false); }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === SECRET_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAdminLoggedIn(true);
      fetchAdminData();
    } else { alert("Galat Password! ❌"); }
  };

  // --- AUTOMATIC STATUS & TRACKING LOGIC ---
  const handleStatusSelect = (orderId, selectedStatus) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    // Final String: "🚚 Shipped (13 May, 2026 - 08:30 AM)"
    const finalStatusText = `${selectedStatus} (${formattedDate} - ${formattedTime})`;

    update(ref(db, `orders/${orderId}`), { 
      trackingId: finalStatusText,
      status: selectedStatus.includes("Delivered") ? "Delivered" : "Shipped" 
    });
    alert("Status & Time Updated! ✅");
  };

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>Loading Panel...</div>;

  if (!isAdminLoggedIn) {
    return (
      <div style={loginOverlay}>
        <div style={loginCard}>
          <ShieldCheck size={50} color="#1b5e20" style={{marginBottom:"10px"}} />
          <h2>Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Password" style={inputStyle} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
            <button type="submit" style={saveBtn}>Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ color: "#1b5e20" }}>🛡️ Admin Panel</h1>
      
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2e7d32", color: "white" }}>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Update Tracking & Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>
                  <b>{o.userName}</b><br/>
                  <small><MapPin size={10}/> {o.address || "No Address"}</small>
                </td>
                <td style={tdStyle}>{o.productName}<br/>₹{o.price}</td>
                
                {/* STATUS DROPDOWN WITH AUTO-DATE */}
                <td style={tdStyle}>
                  <select 
                    style={{...inputStyle, padding:"5px", fontSize:"12px"}}
                    onChange={(e) => handleStatusSelect(o.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Choose Status...</option>
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div style={{fontSize:"10px", marginTop:"5px", color:"#2e7d32"}}>
                    Current: {o.trackingId || "No Status Set"}
                  </div>
                </td>

                <td style={tdStyle}>
                  <button onClick={() => remove(ref(db, `orders/${o.id}`))} style={{background:"none", border:"none", cursor:"pointer"}}><Trash2 size={18} color="#d32f2f"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const loginOverlay = { height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f0fdf4" };
const loginCard = { background:"white", padding:"40px", borderRadius:"20px", width:"320px", textAlign:"center", boxShadow:"0 10px 30px rgba(0,0,0,0.1)" };
const tableContainer = { background: "white", borderRadius: "15px", overflowX: "auto", marginTop: "20px" };
const thStyle = { padding:"15px", textAlign:"left" };
const tdStyle = { padding:"15px", fontSize:"13px" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" };
const saveBtn = { width: "100%", padding: "12px", background: "#1b5e20", color: "white", border: "none", borderRadius: "8px", marginTop: "10px", cursor:"pointer" };
