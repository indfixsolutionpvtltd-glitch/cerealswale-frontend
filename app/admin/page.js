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

  const quantityOptions = ["250 GM", "500 GM", "1 KG", "5 KG", "10 KG", "25 KG", "50 KG"];
  const liquidOptions = ["1 Litre", "5 Litre", "10 Litre"];
  const packetOptions = ["1 pc", "2 pc", "6 pc", "12 pc"];

  // --- NAYA FUNCTION YAHAN HAI ---
  const fetchAdminData = () => {
    setLoading(true); 
    
    try {
      const productsRef = ref(db, 'products');
      const ordersRef = ref(db, 'orders');

      onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const prodList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setProducts(prodList);
        }
        setLoading(false); 
      }, (error) => {
        console.error("Products Fetch Error:", error);
        setLoading(false); 
      });

      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const orderList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setOrders(orderList.sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
        setLoading(false); 
      }, (error) => {
        console.error("Orders Fetch Error:", error);
        setLoading(false);
      });

      setTimeout(() => {
        setLoading(false);
      }, 5000);

    } catch (err) {
      console.error("General Error:", err);
      setLoading(false);
    }
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
    } else { 
      alert("Galat Password! ❌"); 
    }
  };

  // ... baaki saara code (handleLogout, handleAddProduct, handleUpdateProduct, return UI) waisa hi rahega ...
  // (Maine short kiya hai taaki aap sirf fetchAdminData par focus karein)

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAdminLoggedIn(false);
    window.location.reload();
  };

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>Loading Admin Panel...</div>;

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

  // Aapka original return UI yahan niche paste hoga
  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "30px 5%" }}>
       {/* ... Aapka table aur dashboard UI ... */}
       <h1 style={{ color: "#1b5e20", margin: 0 }}>🛡️ Admin Control Center</h1>
    </div>
  );
}

// ... styles bhi waise hi rahenge ...
const loginOverlay = { height:"100vh", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", background:"#f0fdf4" };
const loginCard = { background:"white", padding:"40px", borderRadius:"20px", boxShadow:"0 10px 30px rgba(0,0,0,0.1)", textAlign:"center", width:"350px" };
const loginInputGroup = { display:"flex", alignItems:"center", gap:"10px", background:"#f9f9f9", padding:"12px", borderRadius:"10px", border:"1px solid #ddd", marginBottom:"15px" };
const loginInput = { border:"none", background:"none", outline:"none", width:"100%", fontSize:"16px" };
const loginBtn = { width:"100%", padding:"12px", background:"#1b5e20", color:"white", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"bold" };
