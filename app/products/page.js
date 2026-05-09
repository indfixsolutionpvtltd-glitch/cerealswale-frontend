"use client"; // Sabse upar ye hona zaroori hai

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Search, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
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
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  // Buy Now Logic
  const handleBuyNow = (product) => {
    const cartItem = { 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      quantity: 1 
    };
    // Local storage mein save karke checkout par bhejna
    localStorage.setItem("cart", JSON.stringify([cartItem]));
    router.push("/checkout");
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#1b5e20", gap: "10px" }}>
      <Loader2 className="animate-spin" /> Loading Products...
    </div>
  );

  return (
    <div style={{ padding: "30px 5%", background: "#f8fdf9", minHeight: "100vh" }}>
      {/* Search Bar Section */}
      <div style={searchContainer}>
        <Search size={20} color="#666" />
        <input 
          type="text" 
          placeholder="Anaj ya dal search karein..." 
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
              <div style={imgContainer}>
                <img src={p.image || "/logo.png"} alt={p.name} style={productImg} />
              </div>
              <h3 style={{ fontSize: "16px", margin: "10px 0", height: "40px", overflow: "hidden" }}>{p.name}</h3>
              <p style={{ color: "#1b5e20", fontWeight: "bold", fontSize: "18px", margin: "10px 0" }}>₹{p.price}</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => handleBuyNow(p)} style={buyNowBtn}>
                  Buy Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", width: "100%", padding: "50px" }}>
             <p style={{ color: "#666" }}>Koi product nahi mila.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Internal Styles ---
const searchContainer = { display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "12px 20px", borderRadius: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "30px", border: "1px solid #eefae1" };
const searchInput = { border: "none", outline: "none", width: "100%", fontSize: "16px" };
const productGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px" };
const productCard = { background: "white", padding: "20px", borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.03)", border: "1px solid #eee", transition: "transform 0.2s" };
const imgContainer = { height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" };
const productImg = { maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "10px" };
const buyNowBtn = { width: "100%", padding: "12px", background: "#1b5e20", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "bold", fontSize: "14px" };
