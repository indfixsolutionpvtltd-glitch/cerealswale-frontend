"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  TrendingUp, AlertTriangle, Plus, FileText, Edit, Trash2, X, Search, Filter 
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form & Edit States
  const [editingId, setEditingId] = useState(null);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pSalePrice, setPSalePrice] = useState("");
  const [pUnit, setPUnit] = useState("1kg");
  const [pImage, setPImage] = useState("");
  const [pStock, setPStock] = useState("In Stock");

  const verifyAdmin = () => {
    if (pass === "Ankur@123") setIsAuthorized(true);
    else alert("Wrong Password! ❌");
  };

  useEffect(() => {
    if (isAuthorized) {
      onValue(ref(db, 'orders'), (snapshot) => {
        const data = snapshot.val();
        if (data) setOrders(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
        else setOrders([]); // Agar orders khali hain
      });
      onValue(ref(db, 'products'), (snapshot) => {
        const data = snapshot.val();
        if (data) setProducts(Object.keys(data).map(key => ({ id: key, ...data[key] })));
        else setProducts([]);
      });
    }
  }, [isAuthorized]);

  // --- Functions ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productData = {
      name: pName, price: pPrice, salePrice: pSalePrice || pPrice,
      unit: pUnit, image: pImage || "https://via.placeholder.com/150",
      stockStatus: pStock, updatedAt: new Date().toISOString()
    };

    if (editingId) {
      update(ref(db, `products/${editingId}`), productData)
        .then(() => { alert("Product Updated! ✨"); setEditingId(null); clearForm(); });
    } else {
      const newRef = push(ref(db, 'products'));
      set(newRef, { ...productData, createdAt: new Date().toISOString() })
        .then(() => { alert("Product Added! ✅"); clearForm(); });
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setPName(p.name); setPPrice(p.price); setPSalePrice(p.salePrice);
    setPUnit(p.unit); setPImage(p.image); setPStock(p.stockStatus || "In Stock");
    window.scrollTo(0, 0);
  };

  const clearForm = () => {
    setEditingId(null); setPName(""); setPPrice(""); setPSalePrice(""); setPImage("");
  };

  const updateOrderStatus = (id, newStatus) => {
    update(ref(db, `orders/${id}`), { status: newStatus });
  };

  const deleteOrder = (id) => {
    if (confirm("Kya aap is order ko hamesha ke liye delete karna chahte hain? 🗑️")) {
      remove(ref(db, `orders/${id}`))
        .then(() => alert("Order Deleted Successfully! ✅"))
        .catch(() => alert("Kucch error aaya hai delete karne mein."));
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0fdf4" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", textAlign: "center", width: "380px" }}>
          <div style={{ background: "#16a34a", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <LayoutDashboard color="white" size={30} />
          </div>
          <h2 style={{ color: "#1f2937" }}>CATALYST Admin 2.0</h2>
          <input type="password" placeholder="Admin Password" style={inputStyle} onChange={(e) => setPass(e.target.value)} />
          <button onClick={verifyAdmin} style={btnPrimary}>Login to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#064e3b", color: "white", padding: "25px", position: "fixed", height: "100vh" }}>
        <h2 style={{ marginBottom: "40px", display: "flex", alignItems: "center", gap: "10px" }}><Package/> Cerealswale</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <SidebarLink active={activeTab === 'dashboard'} icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={()=>setActiveTab('dashboard')} />
          <SidebarLink active={activeTab === 'products'} icon={<Package size={20}/>} label="Inventory" onClick={()=>setActiveTab('products')} />
          <SidebarLink active={activeTab === 'orders'} icon={<ShoppingCart size={20}/>} label="Orders" onClick={()=>setActiveTab('orders')} />
        </div>
      </div>

      {/* Content Area */}
      <div style={{ marginLeft: "260px", flex: 1, padding: "40px" }}>
        
        {activeTab === 'dashboard' && (
          <>
            <h1 style={{ marginBottom: "30px" }}>Dashboard Overview</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px", marginBottom: "40px" }}>
              <StatCard title="Total Sales" value={`₹${orders.reduce((a,b)=>a+(Number(b.price || b.totalAmount)||0),0)}`} icon={<TrendingUp color="#16a34a"/>} color="#dcfce7" />
              <StatCard title="Active Orders" value={orders.filter(o=>o.status==="Pending").length} icon={<ShoppingCart color="#2563eb"/>} color="#dbeafe" />
              <StatCard title="Total Products" value={products.length} icon={<Package color="#9333ea"/>} color="#f3e8ff" />
              <StatCard title="Low Stock" value={products.filter(p=>p.stockStatus==="Out of Stock").length} icon={<AlertTriangle color="#dc2626"/>} color="#fee2e2" />
            </div>
            
            <div style={cardStyle}>
              <h3 style={{ marginBottom: "20px" }}>Recent Orders</h3>
              <OrderTable orders={orders.slice(0,5)} updateStatus={updateOrderStatus} deleteOrder={deleteOrder} />
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <h1>{editingId ? "Edit Product" : "Manage Inventory"}</h1>
              {editingId && <button onClick={clearForm} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>Cancel Edit X</button>}
            </div>

            {/* Add/Edit Form */}
            <div style={{ ...cardStyle, marginBottom: "30px", border: editingId ? "2px solid #16a34a" : "none" }}>
              <form onSubmit={handleSaveProduct} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                <input placeholder="Product Name" style={inputStyle} value={pName} onChange={(e)=>setPName(e.target.value)} required />
                <input type="number" placeholder="Regular Price" style={inputStyle} value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required />
                <input type="number" placeholder="Sale Price" style={inputStyle} value={pSalePrice} onChange={(e)=>setPSalePrice(e.target.value)} />
                <select style={inputStyle} value={pUnit} onChange={(e)=>setPUnit(e.target.value)}>
                  <option value="1kg">1 kg</option><option value="500gm">500 gm</option><option value="1pc">1 pc</option>
                </select>
                <select style={inputStyle} value={pStock} onChange={(e)=>setPStock(e.target.value)}>
                  <option value="In Stock">In Stock</option><option value="Out of Stock">Out of Stock</option>
                </select>
                <input placeholder="Image URL" style={inputStyle} value={pImage} onChange={(e)=>setPImage(e.target.value)} />
                <button type="submit" style={{ ...btnPrimary, gridColumn: "span 3", marginTop: "0" }}>
                  {editingId ? "Update Product Details" : "Add Product to Shop"}
                </button>
              </form>
            </div>

            {/* Product List */}
            <div style={cardStyle}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f8fafc", textAlign: "left" }}>
                  <tr>
                    <th style={thStyle}>Img</th>
                    <th style={thStyle}>Product Name</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Stock</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={tdStyle}><img src={p.image} style={{ width: "40px", height: "40px", borderRadius: "5px", objectFit: "cover" }} /></td>
                      <td style={tdStyle}><b>{p.name}</b><br/><small style={{ color: "#64748b" }}>{p.unit}</small></td>
                      <td style={tdStyle}>₹{p.salePrice} <del style={{ fontSize: "12px", color: "#94a3b8" }}>₹{p.price}</del></td>
                      <td style={tdStyle}>
                        <span style={{ color: p.stockStatus === "In Stock" ? "#16a34a" : "#dc2626", fontSize: "12px", fontWeight: "bold" }}>{p.stockStatus}</span>
                      </td>
                      <td style={tdStyle}>
                        <button onClick={()=>startEdit(p)} style={{ marginRight: "10px", color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}><Edit size={18}/></button>
                        <button onClick={()=>{ if(confirm("Delete?")) remove(ref(db, `products/${p.id}`)); }} style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h1 style={{ marginBottom: "30px" }}>Order Management</h1>
            <div style={cardStyle}>
              <OrderTable orders={orders} updateStatus={updateOrderStatus} deleteOrder={deleteOrder} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Sub-Components ---
function SidebarLink({ active, icon, label, onClick }) {
  return (
    <div onClick={onClick} style={{ 
      display: "flex", alignItems: "center", gap: "15px", padding: "12px 15px", 
      borderRadius: "10px", cursor: "pointer", transition: "0.3s",
      background: active ? "#16a34a" : "transparent",
      fontWeight: active ? "bold" : "normal"
    }}>
      {icon} {label}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "20px" }}>
      <div style={{ background: color, padding: "15px", borderRadius: "12px" }}>{icon}</div>
      <div>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{title}</p>
        <h2 style={{ margin: 0, fontSize: "24px" }}>{value}</h2>
      </div>
    </div>
  );
}

function OrderTable({ orders, updateStatus, deleteOrder }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead style={{ background: "#f8fafc", textAlign: "left" }}>
        <tr>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Customer</th>
          <th style={thStyle}>Product</th>
          <th style={thStyle}>Total</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
            <td style={tdStyle}>{o.createdAt || o.orderDate?.split(',')[0] || "N/A"}</td>
            <td style={tdStyle}><b>{o.customerName}</b></td>
            <td style={tdStyle}>{o.productName || "No Name"}</td>
            <td style={{ ...tdStyle, color: "#16a34a", fontWeight: "bold" }}>₹{o.price || o.totalAmount}</td>
            <td style={tdStyle}>
              <select 
                value={o.status} 
                onChange={(e) => updateStatus(o.id, e.target.value)}
                style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "12px" }}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Confirmed">Delivered</option>
              </select>
            </td>
            <td style={tdStyle}>
              <button 
                onClick={() => deleteOrder(o.id)} 
                style={{ color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}
                title="Delete Order"
              >
                <Trash2 size={18}/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Styles ---
const cardStyle = { background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" };
const inputStyle = { width: "100%", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", fontSize: "14px" };
const btnPrimary = { width: "100%", padding: "12px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", marginTop: "20px" };
const thStyle = { padding: "15px", color: "#64748b", fontSize: "13px", fontWeight: "600" };
const tdStyle = { padding: "15px", fontSize: "14px", color: "#334155" };
