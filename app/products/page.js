"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Search, ShoppingCart, Loader2 } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  // Search Logic
  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  if (loading) return <div style={loaderStyle}><Loader2 className="animate-spin" /> Loading Products...</div>;

  return (
    <div style={{ padding: "30px 5%", background: "#f8fdf9", minHeight: "100vh" }}>
      {/* Search Bar Section */}
      <div style={searchContainer}>
        <Search size={20} color="#666" />
        <input 
          type="text" 
          placeholder="Apna pasandida anaj ya dal dhundein..." 
          style={searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 style={{ color: "#1b5e20", marginBottom: "20px" }}>Hamare Products</h2>
      
      <div style={productGrid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} style={productCard}>
              <img src={p.image || "/placeholder.png"} alt={p.name} style={productImg} />
              <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{p.name}</h3>
              <p style={{ color: "#1b5e20", fontWeight: "bold", fontSize: "18px" }}>₹{p.price}</p>
              <button style={addToCartBtn}>
                <ShoppingCart size={16} /> Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>Koi product nahi mila.</p>
        )}
      </div>
    </div>
  );
}

// Styles
const searchContainer = { display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "12px 20px", borderRadius: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "30px" };
const searchInput = { border: "none", outline: "none", width: "100%", fontSize: "16px" };
const productGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "25px" };
const productCard = { background: "white", padding: "20px", borderRadius: "15px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.02)", border: "1px solid #eee" };
const productImg = { width: "100%", height: "150px", objectFit: "contain", borderRadius: "10px" };
const addToCartBtn = { width: "100%", padding: "10px", background: "#43a047", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px", fontWeight: "bold" };
const loaderStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "18px", color: "#1b5e20", gap: "10px" };
