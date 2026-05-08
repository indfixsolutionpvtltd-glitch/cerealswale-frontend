"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set, update } from "firebase/database";

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
      unit: pUnit,
      image: pImage || "https://via.placeholder.com/150",
      status: "In Stock"
    }).then(() => {
      alert("Product Added Successfully! ✅");
      setPName(""); setPPrice(""); setPImage("");
    });
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0fdf4" }}>
        <div style={{ padding: "40px", background: "white", borderRadius: "15px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "350px" }}>
          <h2 style={{ color: "#166534", marginBottom: "20px" }}>🔐 CATALYST Admin</h2>
          <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ddd" }} />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#166534", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Login</button>
        </div>
      </div>
    );
  }

  const revenue = orders.reduce((a, b) => a + (Number(b.price) || 0), 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? "240px" : "0px", background: "#064e3b", color: "white", transition: "0.3s", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ padding: "20px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "40px" }}>🌾 Cerealswale</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ cursor: "pointer" }}>🏠 Dashboard</div>
            <div style={{ cursor: "pointer" }}>📦 Inventory</div>
            <div style={{ cursor: "pointer" }}>🛒 Orders ({orders.length})</div>
            <div style={{ cursor: "pointer" }}>👤 Customers</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", overflowX: "hidden" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: "10px", cursor: "pointer", borderRadius: "5px", border: "1px solid #ddd", background: "white" }}>
            {sidebarOpen ? "❌ Close Menu" : "☰ Open Menu"}
          </button>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "14px", color: "#64748b" }}>Admin: Ankur Gupta</span>
          </div>
        </header>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#dcfce7", padding: "20px", borderRadius: "15px", border: "1px solid #bbf7d0" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#166534" }}>Total Revenue</p>
            <h2 style={{ margin: "5px 0", color: "#166534" }}>₹{revenue}</h2>
          </div>
          <div style={{ background: "#dbeafe", padding: "20px", borderRadius: "15px", border: "1px solid #bfdbfe" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#1e40af" }}>Orders</p>
            <h2 style={{ margin: "5px 0", color: "#1e40af" }}>{orders.length}</h2>
          </div>
          <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "15px", border: "1px solid #fde68a" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>Products</p>
            <h2 style={{ margin: "5px 0", color: "#92400e" }}>{products.length}</h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "30px", alignItems: "start" }}>
          {/* Recent Orders Table */}
          <div style={{ background: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "20px" }}>Recent Orders</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f1f5f9", textAlign: "left" }}>
                <tr>
                  <th style={{ padding: "12px" }}>Customer</th>
                  <th style={{ padding: "12px" }}>Product</th>
                  <th style={{ padding: "12px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px", fontWeight: "bold" }}>{o.customerName}</td>
                    <td style={{ padding: "12px" }}>{o.productName}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#fef3c7", fontSize: "12px" }}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Product Form */}
          <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "15px" }}>➕ Add Product</h3>
            <form onSubmit={addProduct} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="text" placeholder="Product Name" value={pName} onChange={(e)=>setPName(e.target.value)} required style={inputStyle} />
              <select value={pCategory} onChange={(e)=>setPCategory(e.target.value)} style={inputStyle}>
                <option>Cereals</option><option>Pulses</option><option>Spices</option>
              </select>
              <input type="number" placeholder="Price (₹)" value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required style={inputStyle} />
              <select value={pUnit} onChange={(e)=>setPUnit(e.target.value)} style={inputStyle}>
                <option value="1kg">1 kg</option><option value="5kg">5 kg</option><option value="500gm">500 gm</option><option value="1pc">1 pc</option>
              </select>
              <input type="text" placeholder="Image URL" value={pImage} onChange={(e)=>setPImage(e.target.value)} style={inputStyle} />
              <button type="submit" style={{ padding: "12px", background: "#166534", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>Save Product</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none" };
