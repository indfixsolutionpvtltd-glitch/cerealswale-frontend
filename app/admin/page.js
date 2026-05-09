"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, set, push, update, remove } from "firebase/database";
import { ShoppingBag, Package, PlusCircle, Trash2, X, Lock, ShieldCheck, LogOut, Edit3, Save, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const SECRET_ADMIN_PASSWORD = "Ram@123"; 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null); // Edit tracking

  const [newProduct, setNewProduct] = useState({
    name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", price: "", stock: "", image: "", description: "", inStock: true
  });

  const quantityOptions = ["250 GM", "500 GM", "1 KG", "5 KG", "10 KG", "25 KG", "50 KG"];
  const liquidOptions = ["1 Litre", "5 Litre", "10 Litre"];
  const packetOptions = ["1 pc", "2 pc", "6 pc", "12 pc"];

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") setIsAdminLoggedIn(true);

    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const prodList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(prodList);
      }
      setLoading(false);
    });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === SECRET_ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem("admin_authenticated", "true");
    } else { alert("Galat Password! ❌"); }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAdminLoggedIn(false);
    window.location.reload();
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Details bharein!");
    try {
      const productsRef = ref(db, 'products');
      const newProdRef = push(productsRef);
      await set(newProdRef, { ...newProduct, createdAt: new Date().toISOString() });
      setIsAdding(false);
      setNewProduct({ name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", price: "", stock: "", image: "", description: "", inStock: true });
    } catch (e) { alert(e.message); }
  };

  // --- EDIT LOGIC ---
  const handleEditClick = (product) => {
    setEditId(product.id);
    setNewProduct({ ...product });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProduct = async () => {
    try {
      await update(ref(db, `products/${editId}`), newProduct);
      alert("Product Updated! ✅");
      setEditId(null);
      setIsAdding(false);
      setNewProduct({ name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", price: "", stock: "", image: "", description: "", inStock: true });
    } catch (e) { alert(e.message); }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete karein?")) remove(ref(db, `products/${id}`));
  };

  const toggleStock = (id, currentStatus) => {
    update(ref(db, `products/${id}`), { inStock: !currentStatus });
  };

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

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>Loading...</div>;

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "30px 5%" }}>
      {/* HEADER & STATS */}
      <div style={headerSection}>
        <h1 style={{ color: "#1b5e20", margin: 0 }}>🛡️ Inventory Control</h1>
        <div style={{display:"flex", gap:"10px"}}>
          <button onClick={() => { setIsAdding(!isAdding); setEditId(null); }} style={isAdding ? cancelBtn : addBtn}>
            {isAdding ? "Cancel" : "+ Add New"}
          </button>
          <button onClick={handleLogout} style={logoutBtn}><LogOut size={16}/> Logout</button>
        </div>
      </div>

      <div style={statsGrid}>
        <div style={statCard}><Package color="#1b5e20"/> <div><h3>{products.length}</h3><p>Total Items</p></div></div>
        <div style={statCard}><TrendingUp color="#1b5e20"/> <div><h3>₹{products.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.stock)), 0)}</h3><p>Inventory Value</p></div></div>
      </div>

      {/* FORM: ADD OR EDIT */}
      {isAdding && (
        <div style={formCard}>
          <h3 style={{color:"#1b5e20"}}>{editId ? "✏️ Edit Product" : "📦 Add New Product"}</h3>
          <div style={gridForm}>
            <input placeholder="Name" style={inputStyle} value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name:e.target.value})} />
            <select style={inputStyle} value={newProduct.unitType} onChange={(e)=>setNewProduct({...newProduct, unitType:e.target.value})}>
              <option value="Weight">Weight</option>
              <option value="Liquid">Liquid</option>
              <option value="Packet">Packet</option>
            </select>
            <select style={inputStyle} value={newProduct.quantity} onChange={(e)=>setNewProduct({...newProduct, quantity:e.target.value})}>
              {newProduct.unitType === "Weight" && quantityOptions.map(q => <option key={q} value={q}>{q}</option>)}
              {newProduct.unitType === "Liquid" && liquidOptions.map(q => <option key={q} value={q}>{q}</option>)}
              {newProduct.unitType === "Packet" && packetOptions.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
            <input placeholder="Price" type="number" style={inputStyle} value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct, price:e.target.value})} />
            <input placeholder="Stock" type="number" style={inputStyle} value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock:e.target.value})} />
            <input placeholder="Image URL" style={inputStyle} value={newProduct.image} onChange={(e)=>setNewProduct({...newProduct, image:e.target.value})} />
          </div>
          <button onClick={editId ? handleUpdateProduct : handleAddProduct} style={saveBtn}>
            {editId ? "Update Product Details" : "Add to Inventory"}
          </button>
        </div>
      )}

      {/* TABLE */}
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1b5e20", color: "white", textAlign: "left" }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}><img src={p.image || "/logo.png"} style={{width:"45px", height:"45px", borderRadius:"8px", objectFit:"cover"}} /></td>
                <td style={tdStyle}><b>{p.name}</b><br/><small>{p.quantity}</small></td>
                <td style={tdStyle}>₹{p.price}</td>
                <td style={{...tdStyle, color: p.stock < 10 ? 'red' : 'black'}}>{p.stock}</td>
                <td style={tdStyle}>
                  <button onClick={() => toggleStock(p.id, p.inStock)} style={p.inStock ? stockIn : stockOut}>
                    {p.inStock ? "Active" : "Hidden"}
                  </button>
                </td>
                <td style={tdStyle}>
                  <div style={{display:"flex", gap:"10px"}}>
                    <Edit3 size={18} color="#1b5e20" style={{cursor:"pointer"}} onClick={() => handleEditClick(p)} />
                    <Trash2 size={18} color="#d32f2f" style={{cursor:"pointer"}} onClick={() => handleDelete(p.id)} />
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

// --- UPDATED STYLES ---
const headerSection = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
const statsGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" };
const statCard = { background: "white", padding: "20px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" };
const loginOverlay = { height:"100vh", width:"100%", display:"flex", justifyContent:"center", alignItems:"center", background:"#f0fdf4" };
const loginCard = { background:"white", padding:"40px", borderRadius:"20px", boxShadow:"0 10px 30px rgba(0,0,0,0.1)", textAlign:"center", width:"350px" };
const loginInputGroup = { display:"flex", alignItems:"center", gap:"10px", background:"#f9f9f9", padding:"12px", borderRadius:"10px", border:"1px solid #ddd", marginBottom:"15px" };
const loginInput = { border:"none", background:"none", outline:"none", width:"100%", fontSize:"16px" };
const loginBtn = { width:"100%", padding:"12px", background:"#1b5e20", color:"white", border:"none", borderRadius:"10px", cursor:"pointer", fontWeight:"bold" };
const logoutBtn = { background:"#ffebee", color:"#d32f2f", border:"none", padding:"8px 15px", borderRadius:"8px", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", fontWeight:"bold" };
const formCard = { background:"white", padding:"25px", borderRadius:"15px", boxShadow:"0 10px 25px rgba(0,0,0,0.05)", marginBottom:"30px", border:"1px solid #1b5e20" };
const gridForm = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:"15px" };
const inputStyle = { width:"100%", padding:"12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box" };
const addBtn = { background:"#1b5e20", color:"white", border:"none", padding:"10px 20px", borderRadius:"8px", cursor:"pointer", fontWeight:"bold" };
const cancelBtn = { background:"#666", color:"white", border:"none", padding:"10px 20px", borderRadius:"8px", cursor:"pointer" };
const saveBtn = { width:"100%", padding:"15px", background:"#1b5e20", color:"white", border:"none", borderRadius:"10px", marginTop:"20px", fontWeight:"bold", cursor:"pointer" };
const tableContainer = { background:"white", borderRadius:"15px", overflow:"hidden", boxShadow:"0 4px 15px rgba(0,0,0,0.02)" };
const thStyle = { padding:"15px" };
const tdStyle = { padding:"15px", fontSize:"14px" };
const stockIn = { background:"#dcfce7", color:"#166534", border:"none", padding:"5px 10px", borderRadius:"5px", cursor:"pointer" };
const stockOut = { background:"#fee2e2", color:"#991b1b", border:"none", padding:"5px 10px", borderRadius:"5px", cursor:"pointer" };
