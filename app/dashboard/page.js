"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue } from "firebase/database";
import { Search, Loader2, ShoppingBag, Plus, Minus, Trash2, X, User as UserIcon, LogOut, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // 1. User Data Load
    const savedUser = JSON.parse(localStorage.getItem("cw_user")) || JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
        router.push("/login");
    } else {
        setUser(savedUser);
    }

    // 2. Cart Data Load
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    // 3. Products Fetch
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

  // --- CART LOGIC ---
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

  if (loading) return <div style={loaderStyle}><Loader2 className="animate-spin" /> Loading Dashboard...</div>;

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", paddingBottom: "120px" }}>
      
      {/* 1. WELCOME SECTION (As per image_11.png) */}
      <div style={welcomeCard}>
        <div style={userInfo}>
          <div style={userAvatar}><UserIcon size={30} color="white" /></div>
          <div>
            <h2 style={{margin: 0, color: "#1b5e20"}}>Swagat hai, {user?.name || "User"}! 👋</h2>
            <p style={{margin: 0, fontSize: "12px", color: "#666"}}>Mobile: {user?.mobile || "N/A"} | Email: {user?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* 2. SEARCH SECTION */}
      <div style={{padding: "0 5%"}}>
        <h3 style={{color: "#333", marginBottom: "10px"}}>Aap Kya Dhund Rahe Hain?</h3>
        <div style={searchContainer}>
          <Search size={20} color="#666" />
          <input 
            type="text" 
            placeholder="Search product (e.g. Almonds, Black Pepper, Poha, Rice)" 
            style={searchInput} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. PRODUCT GRID */}
      <div style={{padding: "20px 5%"}}>
        <div style={productGrid}>
            {filteredProducts.map((p) => (
            <div key={p.id} style={productCard}>
                <div style={imgWrapper}>
                    {p.discount && <div style={discountTag}>{p.discount}%<br/>OFF</div>}
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
            ))}
        </div>
      </div>

      {/* 4. FLOATING VIEW CART BAR (FIXED) */}
      {cart.length > 0 && (
        <div style={floatingCartBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={cartCountIcon}>{cart.length}</div>
            <div>
              <div style={{fontSize: "14px", fontWeight: "bold"}}>₹{totalAmount}</div>
              <div style={{fontSize: "10px", opacity: 0.9}}>Check items & checkout</div>
            </div>
          </div>
          <button onClick={() => setIsCartOpen(true)} style={viewCartBtn}>
            VIEW CART <ShoppingBag size={18} />
          </button>
        </div>
      )}

      {/* 5. CART EDITING DRAWER */}
      {isCartOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={modalHeader}>
              <h3 style={{margin:0}}>Your Selection ({cart.length})</h3>
              <X onClick={() => setIsCartOpen(false)} style={{cursor: "pointer"}} />
            </div>
            <div style={cartItemsList}>
              {cart.map(item => (
                <div key={item.id} style={cartItemRow}>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight: "bold", fontSize: "14px"}}>{item.name}</div>
                    <div style={{fontSize: "12px", color: "#2e7d32"}}>₹{item.price}</div>
                  </div>
                  <div style={qtyControls}>
                    <button onClick={() => handleQuantityChange(item.id, -1)} style={qtyBtn}><Minus size={14}/></button>
                    <span style={{fontWeight:"bold"}}>{item.quantity}</span>
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

// --- STYLES ---
const welcomeCard = { background: "white", margin: "20px 5%", padding: "20px", borderRadius: "15px", border: "1px solid #eefae1", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" };
const userInfo = { display: "flex", alignItems: "center", gap: "15px" };
const userAvatar = { background: "#2e7d32", width: "50px", height: "50px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" };
const searchContainer = { display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "12px 20px", borderRadius: "12px", border: "1px solid #ddd", marginBottom: "20px" };
const searchInput = { border: "none", outline: "none", width: "100%", fontSize: "14px" };
const productGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))", gap: "15px" };
const productCard = { background: "#fff", borderRadius: "15px", border: "1px solid #f0f0f0", overflow: "hidden" };
const imgWrapper = { background: "#f9f9f9", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" };
const imageStyle = { maxWidth: "80%", maxHeight: "80%", objectFit: "contain" };
const discountTag = { position: "absolute", top: "8px", left: "8px", background: "#ffebee", color: "#d32f2f", padding: "4px 6px", borderRadius: "5px", fontSize: "10px", fontWeight: "bold", textAlign: "center" };
const addBtn = { position: "absolute", bottom: "10px", right: "10px", background: "#ffb703", color: "white", border: "none", padding: "6px 15px", borderRadius: "12px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" };
const contentStyle = { padding: "12px" };
const titleStyle = { fontSize: "14px", fontWeight: "600", color: "#333", margin: "0" };
const qtyStyle = { fontSize: "11px", color: "#888", margin: "4px 0" };
const priceStyle = { fontSize: "15px", fontWeight: "bold", color: "#1b5e20" };
const originalPriceStyle = { fontSize: "11px", color: "#888", textDecoration: "line-through" };
const floatingCartBar = { position: "fixed", bottom: "30px", left: "5%", right: "5%", background: "#1b5e20", color: "white", padding: "15px 20px", borderRadius: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.3)", zIndex: 1000 };
const cartCountIcon = { background: "white", color: "#1b5e20", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" };
const viewCartBtn = { background: "transparent", border: "none", color: "white", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "flex-end" };
const modalContent = { background: "white", width: "100%", borderTopLeftRadius: "25px", borderTopRightRadius: "25px", padding: "25px", maxHeight: "70vh" };
const modalHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" };
const cartItemRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f5f5f5" };
const qtyControls = { display: "flex", alignItems: "center", gap: "10px" };
const qtyBtn = { border: "1px solid #ddd", background: "#f9f9f9", borderRadius: "5px", padding: "3px 8px", cursor: "pointer" };
const finalCheckoutBtn = { width: "100%", background: "#1b5e20", color: "white", border: "none", padding: "15px", borderRadius: "12px", marginTop: "20px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" };
const cartItemsList = { maxHeight: "35vh", overflowY: "auto" };
const loaderStyle = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#1b5e20", fontSize: "18px" };
