"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  TrendingUp, AlertTriangle, Plus, FileText, Edit, Trash2, X, Search 
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form States
  const [editingId, setEditingId] = useState(null);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pUnit, setPUnit] = useState("1kg");
  const [pImage, setPImage] = useState("");

  const verifyAdmin = () => {
    if (pass === "Ankur@123") setIsAuthorized(true);
    else alert("Wrong Password! ❌");
  };

  useEffect(() => {
    if (isAuthorized) {
      onValue(ref(db, 'orders'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setOrders(list.reverse());
        } else {
          setOrders([]);
        }
      });
      onValue(ref(db, 'products'), (snapshot) => {
        const data = snapshot.val();
        if (data) setProducts(Object.keys(data).map(key => ({ id: key, ...data[key] })));
        else setProducts([]);
      });
    }
  }, [isAuthorized]);

  // --- Orders Functions ---
  const deleteOrder = (id) => {
    if (confirm("Kya aap is Order ko hamesha ke liye delete karna chahte hain? 🗑️")) {
      remove(ref(db, `orders/${id}`))
        .then(() => alert("Order Deleted! ✅"))
        .catch((err) => alert("Error: " + err.message));
    }
  };

  const updateOrderStatus = (id, newStatus) => {
    update(ref(db, `orders/${id}`), { status: newStatus });
  };

  // --- Product Functions ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productData = {
      name: pName, price: pPrice, unit: pUnit,
      image: pImage || "https://via.placeholder.com/150",
      updatedAt: new Date().toISOString()
    };

    if (editingId) {
      update(ref(db, `products/${editingId}`), productData).then(() => {
        alert("Product Updated!"); setEditingId(null); clearForm();
      });
    } else {
      const newRef = push(ref(db, 'products'));
      set(newRef, { ...productData, createdAt: new Date().toISOString() }).then(() => {
        alert("Product Added!"); clearForm();
      });
    }
  };

  const clearForm = () => {
    setEditingId(null); setPName(""); setPPrice(""); setPImage("");
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0fdf4" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center", width: "350px" }}>
          <h2>🔐 CATALYST Admin</h2>
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setPass(e.target.value)} />
          <button onClick={verifyAdmin} style={btnPrimary}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#064e3b", color: "white", padding: "25px", position: "fixed", height: "100vh" }}>
        <h2 style={{ marginBottom: "40px" }}>🌾 Cerealswale</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div onClick={()=>setActiveTab('dashboard')} style={activeTab === 'dashboard' ? activeLink : navLink}><LayoutDashboard size={20}/> Dashboard</div>
          <div onClick={()=>setActiveTab('products')} style={activeTab === 'products' ? activeLink : navLink}><Package size={20}/> Products</div>
          <div onClick={()=>setActiveTab('orders')} style={activeTab === 'orders' ? activeLink : navLink}><ShoppingCart size={20}/> Orders ({orders.length})</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "260px", flex: 1, padding: "40px" }}>
        
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
              <div style={statCard}><h4>Revenue</h4><h2>₹{orders.reduce((a,b)=>a+(Number(b.price)||0),0)}</h2></div>
              <div style={statCard}><h4>Orders</h4><h2>{orders.length}</h2></div>
              <div style={statCard}><h4>Products</h4><h2>{products.length}</h2></div>
              <div style={statCard}><h4>Pending</h4><h2>{orders.filter(o=>o.status==="Pending").length}</h2></div>
            </div>

            <div style={whiteCard}>
              <h3 style={{ marginBottom: "20px" }}>Recent Orders Management</h3>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                    <th style={paddingStyle}>Customer</th>
                    <th style={paddingStyle}>Product</th>
                    <th style={paddingStyle}>Price</th>
                    <th style={paddingStyle}>Status</th>
                    <th style={paddingStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={paddingStyle}>{o.customerName}</td>
                      <td style={paddingStyle}>{o.productName}</td>
                      <td style={paddingStyle}>₹{o.price}</td>
                      <td style={paddingStyle}>
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ddd" }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Confirmed">Confirmed</option>
                        </select>
                      </td>
                      <td style={paddingStyle}>
                        <button 
                          onClick={() => deleteOrder(o.id)} 
                          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Products Tab aur baki features yahan rahenge... */}
        {activeTab === 'products' && (
           <div style={whiteCard}>
              <h3>Product Management feature active...</h3>
              {/* Purana Product Form aur Table yahan paste karein */}
           </div>
        )}

      </div>
    </div>
  );
}

// --- Styles ---
const navLink = { display: "flex", alignItems: "center", gap: "10px", padding: "12px", cursor: "pointer", borderRadius: "8px" };
const activeLink = { ...navLink, background: "#16a34a", fontWeight: "bold" };
const statCard = { background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" };
const whiteCard = { background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const paddingStyle = { padding: "15px" };
const inputStyle = { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ddd" };
const btnPrimary = { width: "100%", padding: "12px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
