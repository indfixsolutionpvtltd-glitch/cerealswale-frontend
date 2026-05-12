"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, set, push, update, remove, query, equalTo, orderByChild } from "firebase/database";
import { ShoppingBag, Package, PlusCircle, Trash2, X, Lock, ShieldCheck, LogOut, Edit3, Save, TrendingUp, AlertTriangle, Truck, CheckCircle, Ban, Percent } from "lucide-react";

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const SECRET_ADMIN_PASSWORD = "Ram@123"; 
  // Ye key database rules se match honi chahiye
  const ADMIN_DB_KEY = "CerealsWale_Secret_789"; 

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

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAdminLoggedIn(true);
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdminData = () => {
    // Products Fetch
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const prodList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(prodList);
      }
      setLoading(false);
    });

    // Orders Fetch
    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setOrders(orderList.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === SECRET_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAdminLoggedIn(true);
      setLoading(true);
      fetchAdminData();
    } else { 
      alert("Galat Password! ❌"); 
    }
  };

  // --- Secure Update Logic ---
  const handleUpdateProduct = async () => {
    try {
      // Hum naye product data ke saath secret key bhej rahe hain validation ke liye
      const secureUpdate = { ...newProduct, admin_secret: ADMIN_DB_KEY };
      await update(ref(db, `products/${editId}`), secureUpdate);
      alert("Product Updated! ✅");
      setEditId(null);
      setIsAdding(false);
      resetForm();
    } catch (e) { alert("Permission Denied! Security check failed."); }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Details bharein!");
    try {
      const productsRef = ref(db, 'products');
      const newProdRef = push(productsRef);
      await set(newProdRef, { ...newProduct, admin_secret: ADMIN_DB_KEY, createdAt: new Date().toISOString() });
      setIsAdding(false);
      resetForm();
    } catch (e) { alert("Auth Error: Cannot add product."); }
  };

  // ... (Baaki saara UI aur functions handleLogout, handleDelete waghaira same rahenge jo pehle the)
  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAdminLoggedIn(false);
    window.location.reload();
  };

  const resetForm = () => {
    setNewProduct({ name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", price: "", originalPrice: "", discount: "", stock: "", image: "", description: "", inStock: true });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete karein?")) remove(ref(db, `products/${id}`));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    update(ref(db, `orders/${orderId}`), { status: newStatus });
    alert(`Order ${newStatus} ho gaya! ✅`);
  };

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>Securing CerealsWale Panel...</div>;

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

  // Yahan se aapka poora return UI (Inventory, Orders table, etc.) waisa hi rahega jaisa pehle tha.
  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "30px 5%" }}>
       {/* ... existing UI code ... */}
       <h1 style={{ color: "#1b5e20" }}>🛡️ Admin Control Center</h1>
       {/* ... tables and stats ... */}
    </div>
  );
}

// ... Styles remains the same ...
const loginOverlay = { height:"100vh", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", background:"#f0fdf4" };
const loginCard = { background:"white", padding:"40px", borderRadius:"20px", boxShadow:"0 10px 30px rgba(0,0,0,0.1)", textAlign:"center", width:"350px" };
const loginInputGroup = { display:"flex", alignItems:"center", gap:"10px", background:"#f9f9f9", padding:"12px", borderRadius:"10px", border:"1px solid #ddd", marginBottom:"15px" };
const loginInput = { border:"none", background:"none", outline:"none", width:"100%", fontSize:"16px" };
const loginBtn = { width:"100%", padding:"12px", background:"#1b5e20", color:"white", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"bold" };
