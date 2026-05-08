"use client";
import { useState, useEffect } from "react";
import { db, storage } from "../lib/firebase";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [imageFile, setImageFile] = useState(null); // File store karne ke liye
  const [uploading, setUploading] = useState(false);

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
        else setProducts([]);
      });
    }
  }, [isAuthorized]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image first!");
    
    setUploading(true);
    try {
      // 1. Image Upload to Firebase Storage
      const fileRef = sRef(storage, `product_images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(fileRef, imageFile);
      const imageUrl = await getDownloadURL(fileRef);

      // 2. Save Product Data to Database
      const newProductRef = push(ref(db, 'products'));
      await set(newProductRef, {
        name: pName,
        price: pPrice,
        image: imageUrl,
      });

      alert("Product Uploaded Successfully! ✅");
      setPName(""); setPPrice(""); setImageFile(null);
    } catch (error) {
      alert("Error: " + error.message);
    }
    setUploading(false);
  };

  const deleteProduct = (id) => {
    if (confirm("Delete this product?")) remove(ref(db, `products/${id}`));
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <div style={{ padding: "40px", background: "white", borderRadius: "15px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <h2>🔐 CATALYST Admin</h2>
          <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: "12px", margin: "20px 0", borderRadius: "8px", border: "1px solid #ddd" }} />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6" }}>
      <div style={{ width: "260px", background: "#1b5e20", color: "white", padding: "30px 20px" }}>
        <h2>ADMIN PANEL</h2>
        <p>📦 Orders: {orders.length}</p>
        <p>🛒 Products: {products.length}</p>
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <section style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3>➕ Add New Product (Direct Upload)</h3>
          <form onSubmit={handleAddProduct} style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="text" placeholder="Product Name" value={pName} onChange={(e)=>setPName(e.target.value)} required style={{ padding: "10px", flex: 1 }} />
              <input type="number" placeholder="Price" value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required style={{ padding: "10px", width: "150px" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required style={{ padding: "10px", border: "1px dashed #2e7d32", borderRadius: "5px", flex: 1 }} />
              <button type="submit" disabled={uploading} style={{ padding: "12px 30px", background: "#2e7d32", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                {uploading ? "Uploading..." : "Publish Product"}
              </button>
            </div>
          </form>
        </section>

        {/* Manage Products Table */}
        <section style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3>⚙️ Manage Products</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#666" }}>
                <th style={{ padding: "10px" }}>Image</th>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>Price</th>
                <th style={{ padding: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}><img src={p.image} style={{ width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" }} /></td>
                  <td style={{ padding: "10px" }}>{p.name}</td>
                  <td style={{ padding: "10px" }}>₹{p.price}</td>
                  <td style={{ padding: "10px" }}>
                    <button onClick={() => deleteProduct(p.id)} style={{ background: "#f44336", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
