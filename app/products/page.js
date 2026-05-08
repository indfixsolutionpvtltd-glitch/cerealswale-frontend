"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set } from "firebase/database";

export default function ProductDetailPage() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null); // Login state store karne ke liye

  // 1. Firebase se Products aur LocalStorage se User fetch karna
  useEffect(() => {
    // Products Fetching
    onValue(ref(db, 'products'), (snapshot) => {
      const data = snapshot.val();
      if (data) setProducts(Object.keys(data).map(key => ({ id: key, ...data[key] })));
    });

    // Login State Check
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // 2. Cart Functions
  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
  };

  // 3. Checkout Function (Login Linkage)
  const handleCheckout = () => {
    if (!user) {
      alert("Pehle Login karein! 🔐");
      window.location.href = "/login";
      return;
    }

    // Firebase mein Order save karna
    const ordersRef = ref(db, 'orders');
    cart.forEach(item => {
      const newOrderRef = push(ordersRef);
      set(newOrderRef, {
        productName: item.name,
        price: item.price * item.quantity,
        quantity: `${item.quantity} ${item.unit || 'kg'}`,
        status: "Pending",
        orderDate: new Date().toLocaleString(),
        customerName: user.name || user.email, // Login user ka data
        customerEmail: user.email
      });
    });

    alert(`Dhanyawad ${user.name}! Aapka order mil gaya hai. ✅`);
    setCart([]);
    setIsCartOpen(false);
    window.location.href = "/orders";
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh", paddingBottom: "80px" }}>
      
      {/* Header with User Info */}
      <div style={{ padding: "10px 5%", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <p style={{ color: "#2e7d32", fontWeight: "bold" }}>
          {user ? `Welcome, ${user.name}` : "Please Login to shop"}
        </p>
      </div>

      {/* Main Products Grid */}
      <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {products.map((p) => {
          const cartItem = cart.find(item => item.id === p.id);
          return (
            <div key={p.id} style={{ background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
              <img src={p.image} style={{ width: "100%", height: "200px", objectFit: "cover" }} alt={p.name} />
              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0" }}>{p.name}</h3>
                <p style={{ color: "#2e7d32", fontWeight: "bold", fontSize: "18px" }}>₹{p.price} / {p.unit || 'kg'}</p>
                
                {!cartItem ? (
                  <button onClick={() => addToCart(p)} style={{ width: "100%", padding: "10px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>🛒 Add to Cart</button>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#e8f5e9", borderRadius: "8px", padding: "5px" }}>
                    <button onClick={() => updateQuantity(p.id, -1)} style={{ background: "white", border: "none", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}>-</button>
                    <span>{cartItem.quantity} {p.unit || 'kg'}</span>
                    <button onClick={() => updateQuantity(p.id, 1)} style={{ background: "white", border: "none", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-Cart Drawer */}
      <div style={{
        position: "fixed", top: 0, right: isCartOpen ? 0 : "-400px",
        width: "350px", height: "100vh", background: "white", boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
        transition: "0.3s ease", zIndex: 2000, padding: "20px", display: "flex", flexDirection: "column"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          <h2>Basket 🛒</h2>
          <button onClick={() => setIsCartOpen(false)} style={{ border: "none", background: "none", fontSize: "24px", cursor: "pointer" }}>×</button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", marginTop: "20px" }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: "10px", marginBottom: "15px", alignItems: "center" }}>
              <img src={item.image} style={{ width: "50px", height: "50px", borderRadius: "5px" }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{item.quantity} x ₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <span>Total Payable:</span>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#2e7d32" }}>₹{totalPrice}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            style={{ width: "100%", padding: "15px", background: user ? "#1b5e20" : "#666", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
          >
            {user ? "Place Order Now" : "Login to Checkout 🔐"}
          </button>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {cart.length > 0 && !isCartOpen && (
        <div onClick={() => setIsCartOpen(true)} style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#2e7d32", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white", zIndex: 1500, cursor: "pointer" }}>
          <span>{cart.length} Item(s) | ₹{totalPrice}</span>
          <span>View Cart 🛒</span>
        </div>
      )}

    </div>
  );
}
