"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set } from "firebase/database";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  
  // Product Add karne ke liye states
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pImage, setPImage] = useState("");

  const verifyAdmin = () => {
    if (pass === "Ankur@123") setIsAuthorized(true);
    else alert("Wrong Password! ❌");
  };

  useEffect(() => {
    if (isAuthorized) {
      const ordersRef = ref(db, 'orders');
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setOrders(list.reverse());
        }
      });
    }
  }, [isAuthorized]);

  // --- Naya Product Add karne ka Function ---
  const addProduct = (e) => {
    e.preventDefault();
    const productsRef = ref(db, 'products');
    const newProductRef = push(productsRef);

    const productData = {
      name: pName,
      price: pPrice,
      image: pImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2", // Default image
    };

    set(newProductRef, productData)
      .then(() => {
        alert("Product Successfully Add ho gaya hai! ✅");
        setPName(""); setPPrice(""); setPImage("");
      })
      .catch((err) => alert("Error: " + err.message));
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <div style={{ padding: "40px", background: "white", borderRadius: "15px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <h2>🔐 Admin Login</h2>
          <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: "12px", margin: "20px 0", borderRadius: "8px", border: "1px solid #ddd" }} />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#1b5e20", color: "white", padding: "30px 20px" }}>
        <h2>CATALYST ADMIN</h2>
        <hr/>
        <p>📦 Orders ({orders.length})</p>
        <p>➕ Add Products</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        {/* 1. Add Product Form */}
        <section style={{ background: "white", padding: "30px", borderRadius: "12px", marginBottom: "40px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3>Add New Product (Cerealswale)</h3>
          <form onSubmit={addProduct} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
            <input type="text" placeholder="Product Name" value={pName} onChange={(e)=>setPName(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }} />
            <input type="number" placeholder="Price (₹)" value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", width: "120px" }} />
            <input type="text" placeholder="Image URL (Optional)" value={pImage} onChange={(e)=>setPImage(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 }} />
            <button type="submit" style={{ padding: "10px 20px", background: "#2e7d32", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Product</button>
          </form>
        </section>

        {/* 2. Orders Table (Pehle wala code) */}
        <h1>Live Orders</h1>
        <div style={{ background: "white", borderRadius: "12px", overflow: "hidden" }}>
           <table style={{ width: "100%", borderCollapse: "collapse" }}>
             <thead style={{ background: "#f8f9fa" }}>
               <tr>
                 <th style={{ padding: "15px" }}>Customer</th>
                 <th style={{ padding: "15px" }}>Product</th>
                 <th style={{ padding: "15px" }}>Price</th>
                 <th style={{ padding: "15px" }}>Status</th>
               </tr>
             </thead>
             <tbody>
               {orders.map(o => (
                 <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
                   <td style={{ padding: "15px" }}>{o.customerName}</td>
                   <td style={{ padding: "15px" }}>{o.productName}</td>
                   <td style={{ padding: "15px" }}>₹{o.price}</td>
                   <td style={{ padding: "15px", color: "orange" }}>{o.status}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
