"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Search, ShoppingCart, Loader2, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Sync local state with localStorage for instant UI update
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(productList);
        setFilteredProducts(productList);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const results = products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleAddToCart = (product) => {
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = currentCart.findIndex(item => item.id === product.id);
    
    if (index > -1) {
      currentCart[index].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(currentCart));
    setCart([...currentCart]); // Update local state
    alert(`${product.name} cart mein add ho gaya! 🛒`);
  };

  if (loading) return (
    <div style={loaderStyle}>
      <Loader2 className="animate-spin" /> Loading Products...
    </div>
  );

  return (
    <div style={{ padding: "20px 5%", background: "#fcfcfc", minHeight: "100vh" }}>
      {/* Search Header */}
      <div style={searchContainer}>
        <Search size={20} color="#2e7d32" />
        <input 
          type="text" 
          placeholder="Anaj ya Dal search karein..." 
          style={searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#333", fontSize: "22px" }}>Products</h2>
        <div onClick={() => router.push("/checkout")} style={cartStatus}>
          <ShoppingBag size={20} />
          <span>{cart.reduce((acc, curr) => acc + curr.quantity, 0)} Items</span>
        </div>
      </div>
      
      <div style={productGrid}>
        {filteredProducts.map((p) => (
          <div key={p.id} style={productCard}>
            <div style={imgWrapper}>
              <img src={p.image || "/logo.png"} alt={p.name} style={imageStyle} />
            </div>
            
            <div style={contentStyle}>
              <h3 style={titleStyle}>{p.name}</h3>
              <p style={qtyStyle}>{p.quantity || "1 KG"}</p>
              
              <div style={footerStyle}>
                <span style={priceStyle}>₹{p.price}</span>
                <button onClick={() => handleAddToCart(p)} style={addBtn}>
                  <Plus size={18} /> ADD
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Floating Checkout Button */}
      {cart.length > 0 && (
        <div style={floatingCart} onClick={() => router.push("/checkout")}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingCart size={24} />
            <span>{cart.length} Products in Cart</span>
          </div>
          <b>View Cart →</b>
        </div>
      )}
    </div>
  );
}

// --- Modern UI Styles (As per your Image) ---
const productGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "15px" };
const productCard = { background: "#fff", borderRadius: "15px", border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" };
const imgWrapper = { background: "#f9f9f9", height: "140px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" };
const imageStyle = { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" };
const contentStyle = { padding: "12px" };
const titleStyle = { fontSize: "14px", fontWeight: "600", margin: "0 0 4px 0", color: "#333" };
const qtyStyle = { fontSize: "12px", color: "#888", marginBottom: "10px" };
const footerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const priceStyle = { fontSize: "16px", fontWeight: "bold", color: "#1b5e20" };
const addBtn = { background: "#fff", color: "#2e7d32", border: "1px solid #2e7d32", padding: "5px 12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" };
const searchContainer = { display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "10px 15px", borderRadius: "12px", border: "1px solid #eee", marginBottom: "25px" };
const searchInput = { border: "none", outline: "none", width: "100%", fontSize: "14px" };
const floatingCart = { position: "fixed", bottom: "85px", left: "5%", right: "5%", background: "#1b5e20", color: "white", padding: "15px 20px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 5px 20px rgba(0,0,0,0.2)", cursor: "pointer", zIndex: 100 };
const cartStatus = { display: "flex", alignItems: "center", gap: "8px", background: "#e8f5e9", color: "#2e7d32", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" };
const loaderStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#1b5e20", gap: "10px" };
