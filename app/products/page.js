"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Search, Loader2, ShoppingBag, Plus, Minus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
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

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleAddToCart = (product) => {
    let currentCart = [...cart];
    const index = currentCart.findIndex(item => item.id === product.id);
    if (index > -1) {
      currentCart[index].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    updateCart(currentCart);
  };

  const handleQuantityChange = (productId, delta) => {
    let currentCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = (item.quantity || 1) + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    });
    updateCart(currentCart);
  };

  const removeItem = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateCart(newCart);
  };

  const totalAmount = cart.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);

  if (loading) return <div style={loaderStyle}><Loader2 className="animate-spin" /> Loading CerealsWale...</div>;

  return (
    <div style={{ padding: "20px 5%", background: "#fcfcfc", minHeight: "100vh", paddingBottom: "100px" }}>
      
      <div style={searchContainer}>
        <Search size={20} color="#2e7d32" />
        <input 
          type="text" 
          placeholder="Search product..." 
          style={searchInput} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2 style={{ color: "#333", fontSize: "22px", marginBottom: "20px" }}>Hamare Products</h2>
      
      <div style={productGrid}>
        {filteredProducts.map((p) => {
          const discountVal = p.discount ? `${p.discount}%` : null;
          return (
            <div key={p.id} style={productCard}>
              <div style={imgWrapper}>
                {discountVal && <div style={discountTag}>{discountVal}<br/>OFF</div>}
                {/* UPDATED: Image scale increased to fill more space */}
                <img src={p.image || "/logo.png"} alt={p.name} style={imageStyle} />
                <button onClick={() => handleAddToCart(p)} style={addBtn}>Add</button>
              </div>
              <div style={contentStyle}>
                <h3 style={titleStyle}>{p.name}</h3>
                <p style={qtyStyle}>{p.unit || "1 KG"}</p>
                <div style={{display: "flex", alignItems: "baseline", gap: "5px"}}>
                  <span style={priceStyle}>₹{p.price}</span>
                  {p.originalPrice && <span style={originalPriceStyle}>₹{p.originalPrice}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div style={floatingCartBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={cartCountIcon}>{cart.length}</div>
            <div>
              <div style={{fontSize: "14px", fontWeight: "bold"}}>₹{totalAmount}</div>
              <div style={{fontSize: "10px", opacity: 0.8}}>Plus Taxes & Delivery</div>
            </div>
          </div>
          <button onClick={() => setIsCartOpen(true)} style={viewCartBtn}>
            VIEW CART <ShoppingBag size={18} />
          </button>
        </div>
      )}

      {isCartOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={modalHeader}>
              <h3>Your Cart ({cart.length} Items)</h3>
              <X onClick={() => setIsCartOpen(false)} style={{cursor: "pointer"}} />
            </div>
            
            <div style={cartItemsList}>
              {cart.map(item => (
                <div key={item.id} style={cartItemRow}>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: "bold"}}>{item.name}</div>
                    <div style={{fontSize: "12px", color: "#666"}}>₹{item.price}</div>
                  </div>
                  <div style={qtyControls}>
                    <button onClick={() => handleQuantityChange(item.id, -1)} style={qtyBtn}><Minus size={14}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)} style={qtyBtn}><Plus size={14}/></button>
                    <Trash2 onClick={() => removeItem(item.id)} size={18} color="#d32f2f" style={{marginLeft: "10px", cursor: "pointer"}} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => router.push("/checkout")} style={finalCheckoutBtn}>
              Proceed to Checkout (₹{totalAmount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- UPDATED STYLES FOR LARGER IMAGES ---
const productGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "15px" };
const productCard = { background: "#fff", borderRadius: "15px", border: "1px solid #f0f0f0", overflow: "hidden", position: "relative", transition: "transform 0.2s" };

const imgWrapper = { 
  background: "#fdfdfd", 
  height: "180px", // Card height thodi badhayi
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  position: "relative",
  overflow: "hidden"
};

const imageStyle = { 
  width: "100%", // Poori width cover karega
  height: "100%", 
  objectFit: "cover", // Isse image badi aur card ke size ki dikhegi
  transition: "transform 0.3s ease" 
};

// ... baaki styles same rahenge ...
const floatingCartBar = { position: "fixed", bottom: "20px", left: "5%", right: "5%", background: "#1b5e20", color: "white", padding: "12px 20px", borderRadius: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", zIndex: 1000 };
const cartCountIcon = { background: "white", color: "#1b5e20", width: "24px", height: "24px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" };
const viewCartBtn = { background: "transparent", border: "none", color: "white", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "flex-end" };
const modalContent = { background: "white", width: "100%", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", padding: "25px", maxHeight: "80vh", overflowY: "auto" };
const modalHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "15px" };
const cartItemRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f9f9f9" };
const qtyControls = { display: "flex", alignItems: "center", gap: "10px" };
const qtyBtn = { border: "1px solid #ddd", background: "white", borderRadius: "5px", padding: "2px 5px", cursor: "pointer" };
const finalCheckoutBtn = { width: "100%", background: "#1b5e20", color: "white", border: "none", padding: "15px", borderRadius: "12px", marginTop: "20px", fontWeight: "bold", cursor: "pointer" };
const cartItemsList = { maxHeight: "40vh", overflowY: "auto" };
const discountTag = { position: "absolute", top: "10px", left: "10px", background: "#ffebee", color: "#d32f2f", padding: "4px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: "bold", textAlign: "center", zIndex: 1 };
const addBtn = { position: "absolute", bottom: "10px", right: "10px", background: "#ffb703", color: "white", border: "none", padding: "6px 15px", borderRadius: "12px", fontWeight: "bold", fontSize: "12px", zIndex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" };
const contentStyle = { padding: "12px" };
const titleStyle = { fontSize: "14px", fontWeight: "600", color: "#333", margin: "0" };
const qtyStyle = { fontSize: "11px", color: "#888", margin: "4px 0" };
const priceStyle = { fontSize: "16px", fontWeight: "bold", color: "#1b5e20" };
const originalPriceStyle = { fontSize: "12px", color: "#888", textDecoration: "line-through" };
const searchContainer = { display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "10px 15px", borderRadius: "12px", border: "1px solid #eee", marginBottom: "25px" };
const searchInput = { border: "none", outline: "none", width: "100%", fontSize: "14px" };
const loaderStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#1b5e20", fontSize: "18px" };
