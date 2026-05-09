"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, set, push, update, remove } from "firebase/database";
import { ShoppingBag, Package, PlusCircle, Trash2, Edit, Save, X, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  // States for Inventory
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State for New Product
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Rice",
    quantity: "1 KG",
    unitType: "Weight", // Weight, Liquid, Packet
    price: "",
    stock: "",
    image: "",
    description: "",
    inStock: true
  });

  const quantityOptions = ["250 GM", "500 GM", "1 KG", "5 KG", "10 KG", "25 KG", "50 KG"];
  const liquidOptions = ["1 Litre", "5 Litre", "10 Litre"];
  const packetOptions = ["1 pc", "2 pc", "6 pc", "12 pc"];

  useEffect(() => {
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

  // --- Handlers ---
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Pehle Name aur Price bharein!");
    
    try {
      const productsRef = ref(db, 'products');
      const newProdRef = push(productsRef);
      await set(newProdRef, { ...newProduct, createdAt: new Date().toISOString() });
      alert("Product Upload Ho Gaya! ✅");
      setIsAdding(false);
      setNewProduct({ name: "", category: "Rice", quantity: "1 KG", unitType: "Weight", price: "", stock: "", image: "", description: "", inStock: true });
    } catch (e) { alert(e.message); }
  };

  const handleDelete = (id) => {
    if (window.confirm("Kya aap is product ko delete karna chahte hain?")) {
      remove(ref(db, `products/${id}`));
    }
  };

  const toggleStock = (id, currentStatus) => {
    update(ref(db, `products/${id}`), { inStock: !currentStatus });
  };

  if (loading) return <div style={{textAlign:"center", padding:"100px"}}>Loading Admin Panel...</div>;

  return (
    <div style={{ background: "#f4f7f6", minHeight: "100vh", padding: "30px 5%", fontFamily: "sans-serif" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#1b5e20", margin: 0 }}>🛡️ CerealsWale Inventory</h1>
        <button onClick={() => setIsAdding(!isAdding)} style={isAdding ? cancelBtn : addBtn}>
          {isAdding ? <><X size={18}/> Cancel</> : <><PlusCircle size={18}/> Add New Product</>}
        </button>
      </div>

      {/* --- ADD PRODUCT FORM --- */}
      {isAdding && (
        <div style={formCard}>
          <h3 style={{marginTop:0, color:"#1b5e20"}}>Upload Product Details</h3>
          <div style={gridForm}>
            <input placeholder="Product Name (e.g. Basmati Rice)" style={inputStyle} value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name:e.target.value})} />
            
            <select style={inputStyle} value={newProduct.unitType} onChange={(e)=>setNewProduct({...newProduct, unitType:e.target.value, quantity: e.target.value === "Weight" ? "1 KG" : e.target.value === "Liquid" ? "1 Litre" : "1 pc"})}>
              <option value="Weight">Weight (GM/KG)</option>
              <option value="Liquid">Liquid (Litre)</option>
              <option value="Packet">Packet (pcs)</option>
            </select>

            <select style={inputStyle} value={newProduct.quantity} onChange={(e)=>setNewProduct({...newProduct, quantity:e.target.value})}>
              {newProduct.unitType === "Weight" && quantityOptions.map(q => <option key={q} value={q}>{q}</option>)}
              {newProduct.unitType === "Liquid" && liquidOptions.map(q => <option key={q} value={q}>{q}</option>)}
              {newProduct.unitType === "Packet" && packetOptions.map(q => <option key={q} value={q}>{q}</option>)}
            </select>

            <input placeholder="Price (₹)" type="number" style={inputStyle} value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct, price:e.target.value})} />
            <input placeholder="Stock Quantity" type="number" style={inputStyle} value={newProduct.stock} onChange={(e)=>setNewProduct({...newProduct, stock:e.target.value})} />
            <input placeholder="Image URL (e.g. /products/rice.jpg)" style={inputStyle} value={newProduct.image} onChange={(e)=>setNewProduct({...newProduct, image:e.target.value})} />
          </div>
          <textarea placeholder="Product Description..." style={{...inputStyle, height:"80px", marginTop:"15px"}} value={newProduct.description} onChange={(e)=>setNewProduct({...newProduct, description:e.target.value})} />
          <button onClick={handleAddProduct} style={saveBtn}>Upload Product to Store</button>
        </div>
      )}

      {/* --- PRODUCT LISTING TABLE --- */}
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1b5e20", color: "white", textAlign: "left" }}>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Product Name</th>
              <th style={thStyle}>Quantity/Unit</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}><img src={p.image || "/logo.png"} style={{width:"40px", borderRadius:"5px"}} /></td>
                <td style={tdStyle}><b>{p.name}</b></td>
                <td style={tdStyle}><span style={unitTag}>{p.quantity}</span></td>
                <td style={tdStyle}>₹{p.price}</td>
                <td style={tdStyle}>{p.stock} units</td>
                <td style={tdStyle}>
                  <button onClick={() => toggleStock(p.id, p.inStock)} style={p.inStock ? stockIn : stockOut}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </button>
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(p.id)} style={deleteBtn}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Styles ---
const formCard = { background:"white", padding:"25px", borderRadius:"15px", boxShadow:"0 10px 25px rgba(0,0,0,0.05)", marginBottom:"30px" };
const gridForm = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"15px" };
const inputStyle = { width:"100%", padding:"12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box" };
const addBtn = { background:"#1b5e20", color:"white", border:"none", padding:"10px 20px", borderRadius:"8px", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px", fontWeight:"bold" };
const cancelBtn = { background:"#d32f2f", color:"white", border:"none", padding:"10px 20px", borderRadius:"8px", cursor:"pointer", display:"flex", alignItems:"center", gap:"8px" };
const saveBtn = { width:"100%", padding:"15px", background:"#43a047", color:"white", border:"none", borderRadius:"10px", marginTop:"20px", fontWeight:"bold", cursor:"pointer" };
const tableContainer = { background:"white", borderRadius:"15px", overflow:"hidden", boxShadow:"0 4px 15px rgba(0,0,0,0.02)" };
const thStyle = { padding:"15px" };
const tdStyle = { padding:"15px", fontSize:"14px" };
const unitTag = { background:"#e8f5e9", color:"#2e7d32", padding:"4px 8px", borderRadius:"5px", fontWeight:"bold" };
const stockIn = { background:"#dcfce7", color:"#166534", border:"none", padding:"5px 10px", borderRadius:"5px", cursor:"pointer", fontSize:"12px" };
const stockOut = { background:"#fee2e2", color:"#991b1b", border:"none", padding:"5px 10px", borderRadius:"5px", cursor:"pointer", fontSize:"12px" };
const deleteBtn = { background:"none", border:"none", color:"#d32f2f", cursor:"pointer" };
