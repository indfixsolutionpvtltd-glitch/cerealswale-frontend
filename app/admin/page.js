"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, set, push, update, remove } from "firebase/database";
import { ShoppingBag, Package, PlusCircle, Trash2, X, Lock, ShieldCheck, LogOut, Edit3, Save, TrendingUp, AlertTriangle, Truck, CheckCircle, Ban, Percent } from "lucide-react";

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

  const [newProduct, setNewProduct] = useState({
    name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", 
    price: "", originalPrice: "", discount: "", stock: "", image: "", description: "", inStock: true
  });

  const fetchAdminData = () => {
    // Products fetch logic
    onValue(ref(db, 'products'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const prodList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(prodList);
      }
      setLoading(false);
    }, (err) => setLoading(false));

    // Orders fetch logic
    onValue(ref(db, 'orders'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setOrders(orderList.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    });
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAdminLoggedIn(true);
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === SECRET_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAdminLoggedIn(true);
      fetchAdminData();
    } else { alert("Galat Password! ❌"); }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAdminLoggedIn(false);
    window.location.reload();
  };

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>CerealsWale Loading...</div>;

  if (!isAdminLoggedIn) {
    return (
      <div style={loginOverlay}>
        <div style={loginCard}>
          <ShieldCheck size={50} color="#1b5e20" style={{marginBottom:"10px"}} />
          <h2>Admin Access</h2>
          <form onSubmit={handleLogin} style={{width:"100%"}}>
            <div style={loginInputGroup}>
              <Lock size={18} color="#666" />
              <input type="password" placeholder="Password" style={loginInput} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
            </div>
            <button type="submit" style={loginBtn}>Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // YAHAN SE DASHBOARD KA MAIN CONTENT SHURU HOTA HAI
  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "30px 5%" }}>
      <div style={headerSection}>
        <h1 style={{ color: "#1b5e20", margin: 0 }}>🛡️ Admin Control Center</h1>
        <button onClick={handleLogout} style={logoutBtn}><LogOut size={16}/> Logout</button>
      </div>

      {/* Stats Section */}
      <div style={statsGrid}>
        <div style={statCard}><Package color="#1b5e20"/> <div><h3>{products.length}</h3><p>Products</p></div></div>
        <div style={statCard}><ShoppingBag color="#1b5e20"/> <div><h3>{orders.length}</h3><p>Orders</p></div></div>
      </div>

      {/* Inventory Table */}
      <h2 style={{color: "#1b5e20", marginTop:"30px"}}>Current Inventory</h2>
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{background:"#1b5e20", color:"white"}}>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{borderBottom:"1px solid #eee"}}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>₹{p.price}</td>
                <td style={tdStyle}>{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// STYLES (Wahi hain jo pehle the)
const loginOverlay = { height:"100vh", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", background:"#f0fdf4" };
const loginCard = { background:"white", padding:"40px", borderRadius:"20px", boxShadow:"0 10px 30px rgba(0,0,0,0.1)", textAlign:"center", width:"350px" };
const loginInputGroup = { display:"flex", alignItems:"center", gap:"10px", background:"#f9f9f9", padding:"12px", borderRadius:"10px", border:"1px solid #ddd", marginBottom:"15px" };
const loginInput = { border:"none", background:"none", outline:"none", width:"100%", fontSize:"16px" };
const loginBtn = { width:"100%", padding:"12px", background:"#1b5e20", color:"white", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"bold" };
const headerSection = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
const logoutBtn = { background:"#ffebee", color:"#d32f2f", border:"none", padding:"8px 15px", borderRadius:"8px", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", fontWeight:"bold" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" };
const statCard = { background: "white", padding: "20px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "15px" };
const tableContainer = { background: "white", borderRadius: "15px", overflow: "hidden" };
const thStyle = { padding:"15px", textAlign:"left" };
const tdStyle = { padding:"15px" };
