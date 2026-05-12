"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, set, push, update, remove } from "firebase/database";
import { ShoppingBag, Package, PlusCircle, Trash2, X, Lock, ShieldCheck, LogOut, Edit3, Save, TrendingUp, AlertTriangle, Truck, CheckCircle, Ban, Percent, MapPin, Hash } from "lucide-react";

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const SECRET_ADMIN_PASSWORD = "Ram@123"; 

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterLowStock, setFilterLowStock] = useState(false);
  
  // Naya state tracking ID handle karne ke liye
  const [tempTrackingIds, setTempTrackingIds] = useState({});

  const [newProduct, setNewProduct] = useState({
    name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", 
    price: "", originalPrice: "", discount: "", stock: "", image: "", description: "", inStock: true
  });

  const fetchAdminData = () => {
    setLoading(true);
    onValue(ref(db, 'products'), (snapshot) => {
      const data = snapshot.val();
      if (data) setProducts(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      setLoading(false);
    }, () => setLoading(false));

    onValue(ref(db, 'orders'), (snapshot) => {
      const data = snapshot.val();
      if (data) setOrders(Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
    setTimeout(() => setLoading(false), 4000);
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

  // Tracking ID ko update karne ka function
  const updateTracking = (orderId, trackingId) => {
    if(!trackingId) return alert("Pehle Tracking ID bharein!");
    update(ref(db, `orders/${orderId}`), { trackingId: trackingId });
    alert("Tracking ID Save Ho Gayi! 📦");
  };

  const updateOrderStatus = (orderId, newStatus, currentTracking) => {
    // Agar status Delivered karna hai par tracking ID nahi hai, toh rok do
    if (newStatus === "Delivered" && !currentTracking) {
      return alert("Error: Bina Tracking ID ke order Deliver nahi ho sakta! 🚫");
    }
    update(ref(db, `orders/${orderId}`), { status: newStatus });
    alert(`Order ${newStatus} ho gaya! ✅`);
  };

  const resetForm = () => {
    setNewProduct({ name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", price: "", originalPrice: "", discount: "", stock: "", image: "", description: "", inStock: true });
  };

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>Loading...</div>;

  if (!isAdminLoggedIn) {
    return (
      <div style={loginOverlay}>
        <div style={loginCard}>
          <ShieldCheck size={50} color="#1b5e20" style={{marginBottom:"10px"}} />
          <h2>Admin Access</h2>
          <form onSubmit={handleLogin} style={{width:"100%"}}>
            <input type="password" placeholder="Password" style={inputStyle} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
            <button type="submit" style={saveBtn}>Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "30px 5%" }}>
      <h1 style={{ color: "#1b5e20" }}>🛡️ Admin Control Center</h1>
      
      <div style={statsGrid}>
        <div style={statCard}><h3>{products.length}</h3><p>Products</p></div>
        <div style={statCard}><h3>{orders.length}</h3><p>Orders</p></div>
      </div>

      <h2 style={{color: "#1b5e20", marginTop: "40px"}}><Truck size={24}/> Manage Orders</h2>
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#2e7d32", color: "white" }}>
              <th style={thStyle}>Customer Details & Address</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Tracking ID</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                {/* FIX: Address display check */}
                <td style={tdStyle}>
                  <b>{o.userName}</b><br/>
                  <small>{o.userMobile}</small><br/>
                  <div style={{color: "#d32f2f", fontSize: "11px", marginTop: "5px"}}>
                    <MapPin size={12} style={{display:"inline"}}/> {o.address || "Address Not Found"}
                  </div>
                </td>
                <td style={tdStyle}>{o.productName}<br/><b>₹{o.price}</b></td>
                
                {/* Naya Tracking ID Input */}
                <td style={tdStyle}>
                  <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                    <input 
                      placeholder="Enter ID" 
                      style={{...inputStyle, padding:"5px", fontSize:"12px"}}
                      value={tempTrackingIds[o.id] || o.trackingId || ""}
                      onChange={(e) => setTempTrackingIds({...tempTrackingIds, [o.id]: e.target.value})}
                    />
                    <button 
                      onClick={() => updateTracking(o.id, tempTrackingIds[o.id])}
                      style={{background:"#1b5e20", color:"white", border:"none", fontSize:"10px", borderRadius:"4px", cursor:"pointer"}}
                    >Save ID</button>
                  </div>
                </td>

                <td style={tdStyle}><span style={statusBadge(o.status)}>{o.status}</span></td>
                
                <td style={tdStyle}>
                  <div style={{display:"flex", gap:"5px"}}>
                    <button onClick={() => updateOrderStatus(o.id, "Shipped", o.trackingId)} style={shipBtn}>Ship</button>
                    {/* Delivered button tabhi chalega jab tracking ID database mein save ho */}
                    <button 
                       onClick={() => updateOrderStatus(o.id, "Delivered", o.trackingId)} 
                       style={{...deliverBtn, opacity: o.trackingId ? 1 : 0.5}}
                    >Deliver</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };
const tableContainer = { background: "white", borderRadius: "15px", overflowX: "auto", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" };
const thStyle = { padding:"15px", textAlign:"left" };
const tdStyle = { padding:"15px", fontSize:"13px" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" };
const saveBtn = { width: "100%", padding: "10px", background: "#1b5e20", color: "white", border: "none", borderRadius: "8px", cursor:"pointer" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" };
const statCard = { background: "white", padding: "20px", borderRadius: "15px", textAlign: "center" };
const shipBtn = { background: "#eff6ff", color: "#1e40af", border: "1px solid #1e40af", padding: "5px", borderRadius: "5px", cursor: "pointer", fontSize: "11px" };
const deliverBtn = { background: "#dcfce7", color: "#166534", border: "1px solid #166534", padding: "5px", borderRadius: "5px", cursor: "pointer", fontSize: "11px" };
const loginOverlay = { height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"#f0fdf4" };
const loginCard = { background:"white", padding:"40px", borderRadius:"20px", width:"350px", textAlign:"center" };
const statusBadge = (status) => ({ background: status === "Delivered" ? "#dcfce7" : "#fef3c7", color: status === "Delivered" ? "#166534" : "#92400e", padding: "4px 8px", borderRadius: "10px", fontSize: "11px" });
