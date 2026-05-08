"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  TrendingUp, AlertTriangle, Search, Plus, 
  FileText, Menu, X 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Form States
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("Cereals");
  const [pPrice, setPPrice] = useState("");
  const [pSalePrice, setPSalePrice] = useState("");
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
        if (data) setOrders(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
      });
      onValue(ref(db, 'products'), (snapshot) => {
        const data = snapshot.val();
        if (data) setProducts(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      });
    }
  }, [isAuthorized]);

  const addProduct = (e) => {
    e.preventDefault();
    const newProductRef = push(ref(db, 'products'));
    set(newProductRef, {
      name: pName,
      category: pCategory,
      price: pPrice,
      salePrice: pSalePrice || pPrice,
      unit: pUnit,
      image: pImage || "https://via.placeholder.com/150",
      createdAt: new Date().toISOString()
    }).then(() => {
      alert("Product Added Successfully! ✅");
      setPName(""); setPPrice(""); setPSalePrice(""); setPImage("");
    });
  };

  const chartData = [
    { name: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { name: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { name: 'Delivered', count: orders.filter(o => o.status === 'Confirmed').length },
  ];

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0fdf4" }}>
        <div style={{ background: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "380px", border: "1px solid #dcfce7" }}>
          <div style={{ background: "#16a34a", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <LayoutDashboard color="white" size={30} />
          </div>
          <h2 style={{ fontSize: "24px", color: "#1f2937", marginBottom: "10px" }}>CATALYST Admin</h2>
          <input 
            type="password" placeholder="Admin Password" 
            style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px", outline: "none" }}
            onChange={(e) => setPass(e.target.value)} 
          />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Login Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? "250px" : "80px", background: "#064e3b", color: "white", transition: "0.3s", padding: "20px", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
           <Package size={24} />
           {sidebarOpen && <span style={{ fontWeight: "bold", fontSize: "18px" }}>Cerealswale</span>}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#065f46", borderRadius: "8px" }}><LayoutDashboard size={20}/> {sidebarOpen && "Dashboard"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", cursor: "pointer" }}><Package size={20}/> {sidebarOpen && "Inventory"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", cursor: "pointer" }}><ShoppingCart size={20}/> {sidebarOpen && "Orders"}</div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", overflowX: "hidden" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "white", border: "1px solid #ddd", padding: "8px", borderRadius: "8px", cursor: "pointer" }}>
            {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div style={{ position: "relative", width: "300px" }}>
            <Search style={{ position: "absolute", left: "10px", top: "10px", color: "#94a3b8" }} size={18} />
            <input type="text" placeholder="Search orders..." style={{ width: "100%", padding: "10px 10px 10px 40px", border: "none", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }} />
          </div>
        </header>

        {/* Stats Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <StatCard icon={<TrendingUp color="#16a34a"/>} title="Revenue" value={`₹${orders.reduce((a,b)=>a+(Number(b.price)||0),0)}`} color="#dcfce7" />
          <StatCard icon={<ShoppingCart color="#2563eb"/>} title="Pending" value={orders.filter(o=>o.status==="Pending").length} color="#dbeafe" />
          <StatCard icon={<Users color="#9333ea"/>} title="Merchants" value="12" color="#f3e8ff" />
          <StatCard icon={<AlertTriangle color="#dc2626"/>} title="Low Stock" value="3 Items" color="#fee2e2" />
        </div>

        {/* Charts & Form */}
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", marginBottom: "30px" }}>
          <div style={{ flex: 2, minWidth: "400px", background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "20px", color: "#374151" }}>Delivery Overview</h3>
            <div style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="count" fill="#16a34a" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: "300px", background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "20px" }}><Plus size={18}/> Add Product</h3>
            <form onSubmit={addProduct} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Name" style={inputStyle} value={pName} onChange={(e)=>setPName(e.target.value)} required />
              <select style={inputStyle} value={pCategory} onChange={(e)=>setPCategory(e.target.value)}>
                <option>Cereals</option><option>Pulses</option><option>Spices</option>
              </select>
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="number" placeholder="MRP" style={inputStyle} value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required />
                <input type="number" placeholder="Sale" style={inputStyle} value={pSalePrice} onChange={(e)=>setPSalePrice(e.target.value)} />
              </div>
              <select style={inputStyle} value={pUnit} onChange={(e)=>setPUnit(e.target.value)}>
                <option value="1kg">1kg</option><option value="5kg">5kg</option><option value="500gm">500gm</option>
              </select>
              <input type="text" placeholder="Image URL" style={inputStyle} value={pImage} onChange={(e)=>setPImage(e.target.value)} />
              <button style={{ padding: "12px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Save Product</button>
            </form>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: "white", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <h3 style={{ padding: "20px", margin: 0, borderBottom: "1px solid #eee" }}>Recent Orders</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "#f8fafc" }}>
                <tr>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>{o.customerName}</td>
                    <td style={tdStyle}>{o.productName}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold", color: "#16a34a" }}>₹{o.price}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", background: o.status === "Confirmed" ? "#dcfce7" : "#fee2e2", color: o.status === "Confirmed" ? "#166534" : "#991b1b" }}>
                        {o.status === 'Confirmed' ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td style={tdStyle}><button style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }}><FileText size={18}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "15px" }}>
      <div style={{ background: color, padding: "12px", borderRadius: "12px" }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{title}</p>
        <h3 style={{ margin: "5px 0 0", fontSize: "20px" }}>{value}</h3>
      </div>
    </div>
  );
}

const inputStyle = { padding: "10px", border: "1px solid #ddd", borderRadius: "8px", outline: "none", fontSize: "14px" };
const thStyle = { padding: "15px", color: "#64748b", fontSize: "13px", fontWeight: "600" };
const tdStyle = { padding: "15px", fontSize: "14px", color: "#334155" };
