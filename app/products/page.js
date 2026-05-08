"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set } from "firebase/database";

export default function Products() {
  const [products, setProducts] = useState([]);

  // Firebase se products khinch rahe hain
  useEffect(() => {
    const productsRef = ref(db, 'products');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(list);
      }
    });
  }, []);

  const handleOrder = (product) => {
    const ordersRef = ref(db, 'orders');
    const newOrderRef = push(ordersRef);
    set(newOrderRef, {
      productName: product.name,
      price: product.price,
      status: "Pending",
      orderDate: new Date().toLocaleString(),
      customerName: "Ankur Gupta"
    }).then(() => {
      alert("Order Successful! ✅");
      window.location.href = "/orders";
    });
  };

  return (
    <div style={{ padding: "40px", background: "#f4fff2", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#1b5e20" }}>🌾 All Products</h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "25px", marginTop: "30px" }}>
        {products.map((p) => (
          <div key={p.id} style={{ background: "white", width: "280px", borderRadius: "10px", boxShadow: "0 4px 8px #ddd", overflow: "hidden" }}>
            <img src={p.image} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
            <div style={{ padding: "15px" }}>
              <h3>{p.name}</h3>
              <p style={{ color: "#2e7d32", fontSize: "18px", fontWeight: "bold" }}>₹{p.price}</p>
              <button onClick={() => handleOrder(p)} style={{ width: "100%", padding: "10px", background: "#43a047", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>🛒 Abhi Kharidein</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
