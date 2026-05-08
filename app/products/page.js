"use client";
import { db } from "../lib/firebase"; // Firebase connection import kar rahe hain
import { ref, push, set } from "firebase/database";

export default function Products() {
  const products = [
    { id: 1, name: "Premium Wheat Seeds", price: 500, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b" },
    { id: 2, name: "Organic Rice Seeds", price: 700, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c" },
    { id: 3, name: "Natural Fertilizer", price: 400, image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9" }
  ];

  // Ye hai naya handleOrder function jo Firebase mein data bhejega
  const handleOrder = (product) => {
    try {
      const ordersRef = ref(db, 'orders'); // Database mein 'orders' naam ka folder banega
      const newOrderRef = push(ordersRef); // Har order ko ek unique ID milegi

      const orderData = {
        productName: product.name,
        price: product.price,
        status: "Pending",
        orderDate: new Date().toLocaleString(),
        customerName: "Ankur Gupta", // Abhi ke liye static hai
      };

      set(newOrderRef, orderData)
        .then(() => {
          alert(`Success! Aapka order "${product.name}" Firebase mein save ho gaya hai. ✅`);
          window.location.href = "/orders"; // Order page par bhej rahe hain
        })
        .catch((error) => {
          alert("Firebase Error: " + error.message);
        });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Kuch galat hua. Kya aapne lib/firebase.js check kiya?");
    }
  };

  return (
    <div style={{ background: "#f4fff2", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ color: "#1b5e20", textAlign: "center" }}>🌾 Hamare Utpad (Cerealswale)</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap", marginTop: "40px" }}>
        {products.map((item, index) => (
          <div key={index} style={{ width: "300px", background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0px 0px 10px #ccc" }}>
            <img src={item.image} alt={item.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <div style={{ padding: "20px" }}>
              <h2>{item.name}</h2>
              <h3 style={{ color: "#2e7d32" }}>₹{item.price}</h3>
              <button
                onClick={() => handleOrder(item)} // Ab ye Firebase wala function call karega
                style={{
                  width: "100%", padding: "12px", background: "#43a047", color: "white",
                  border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold"
                }}
              >
                🛒 Abhi Kharidein
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
