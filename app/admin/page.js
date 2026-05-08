"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); 
  
  // States for New Product
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pUnit, setPUnit] = useState("kg"); // Naya: kg ya pc
  const [pImage, setPImage] = useState(""); 

  const verifyAdmin = () => {
    if (pass === "Ankur@123") setIsAuthorized(true);
    else alert("Wrong Password! ❌");
  };

  useEffect(() => {
    if (isAuthorized) {
      // Fetch Orders
      onValue(ref(db, 'orders'), (snapshot) => {
        const data = snapshot.val();
        if (data) setOrders(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse());
      });

      // Fetch Products
      onValue(ref(db, 'products'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setProducts(list);
        } else {
          setProducts([]);
        }
      });
    }
  }, [isAuthorized]);

  const addProduct = (e) => {
    e.preventDefault();
    const productsRef = ref(db, 'products');
    const newProductRef = push(productsRef);

    set(newProductRef, {
      name: pName,
      price: pPrice,
      unit: pUnit, // kg ya pc save ho raha hai
      image: pImage || "https://via.placeholder.com/150",
    }).then(() => {
      alert("Product Successfully Added! ✅");
      setPName(""); setPPrice(""); setPImage(""); setPUnit("kg");
    });
  };

  const deleteProduct = (id) => {
    if (confirm("Kya aap is product ko hatana chahte hain?")) {
      remove(ref(db, `products/${id}`)).then(() => alert("Product Deleted! 🗑️"));
    }
  };

  const updateStatus = (id, status) => {
    update(ref(db, `orders/${id}`), { status: status });
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <div style={{ padding: "40px", background: "white", borderRadius: "15px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "#1b5e20" }}>🔐 CATALYST Admin</h2>
          <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: "12px", margin: "20px 0", borderRadius: "8px", border: "1px solid #ddd" }} />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#1b5e20", color: "white", padding: "30px 20px" }}>
        <h2>ADMIN DASHBOARD</h2>
        <hr style={{ opacity: 0.2 }}/>
        <p>📊 Orders: <b>{orders.length}</b></p>
        <p>🛒 Products: <b>{products.length}</b></p>
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        {/* Step 1: Add Product Form */}
        <section style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginBottom: "20px" }}>➕ Add New Product</h3>
          <form onSubmit={addProduct} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <input type="text" placeholder="Product Name" value={pName} onChange={(e)=>setPName(e.target.value)} required style={{ padding: "10px", flex: "1", minWidth: "150px", borderRadius: "5px", border: "1px solid #ddd" }} />
            
            <input type="number" placeholder="Price (₹)" value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required style={{ padding: "10px", width: "100px", borderRadius: "5px", border: "1px solid #ddd" }} />
            
            <select value={pUnit} onChange={(e)=>setPUnit(e.target.value)} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd", background: "white" }}>
              <option value="kg">per kg</option>
              <option value="pc">per pc</option>
              <option value="packet">per packet</option>
            </select>

            <input type="text" placeholder="Paste Image URL" value={pImage} onChange={(e)=>setPImage(e.target.value)} style={{ padding: "10px", flex: "1", minWidth: "200px", borderRadius: "5px", border: "1px solid #ddd" }} />
            
            <button type="submit" style={{ padding: "10px 25px", background: "#2e7d32", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Add Product</button>
          </form>
        </section>

        {/* Step 2: Manage Inventory */}
        <section style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginBottom: "20px" }}>⚙️ Manage Inventory</h3>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", background: "#f8f9fa", fontSize: "14px" }}>
                  <th style={{ padding: "12px" }}>Image</th>
                  <th style={{ padding: "12px" }}>Product</th>
                  <th style={{ padding: "12px" }}>Price</th>
                  <th style={{ padding: "12px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>
                      {/* Image Fix: Added onError to handle broken links */}
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover", display: "block", border: "1px solid #eee" }} 
                        onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=No+Img"; }}
                      />
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: "bold" }}>{p.name}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>Unit: {p.unit || 'kg'}</div>
                    </td>
                    <td style={{ padding: "12px" }}>₹{p.price}</td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => deleteProduct(p.id)} style={{ background: "#ff5252", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Step 3: Orders List */}
        <h1>Recent Orders</h1>
        <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#e8f5e9" }}>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: "15px" }}>Customer</th>
                <th style={{ padding: "15px" }}>Product</th>
                <th style={{ padding: "15px" }}>Price</th>
                <th style={{ padding: "15px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px" }}>{o.customerName}</td>
                  <td style={{ padding: "15px" }}>{o.productName}</td>
                  <td style={{ padding: "15px" }}>₹{o.price}</td>
                  <td style={{ padding: "15px" }}>
                    <select onChange={(e) => updateStatus(o.id, e.target.value)} value={o.status} style={{ padding: "5px", borderRadius: "4px" }}>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
