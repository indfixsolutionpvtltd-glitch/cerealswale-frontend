"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    
    // Firebase se live data khinch rahe hain
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sirf Ankur Gupta ke orders dikhane ke liye (Abhi ke liye filter laga rahe hain)
        const myOrders = list.filter(order => order.customerName === "Ankur Gupta");
        setOrders(myOrders.reverse()); // Naye orders pehle dikhenge
      }
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "40px 20px", background: "#f4fff2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#2e7d32", marginBottom: "30px", textAlign: "center" }}>📦 Mere Orders</h1>
        
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading your orders...</p>
        ) : orders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {orders.map((order) => (
              <div key={order.id} style={{ 
                background: "white", padding: "20px", borderRadius: "12px", 
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderLeft: `6px solid ${order.status === 'Pending' ? '#ffa000' : '#2e7d32'}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0" }}>{order.productName}</h3>
                    <p style={{ color: "#666", fontSize: "14px", margin: "0" }}>Order ID: {order.id.substring(1, 10)}...</p>
                    <p style={{ color: "#888", fontSize: "12px" }}>Tareekh: {order.orderDate}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <h2 style={{ margin: "0", color: "#2e7d32" }}>₹{order.price}</h2>
                    <span style={{ 
                      display: "inline-block", marginTop: "10px", padding: "5px 12px", 
                      borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
                      background: order.status === "Pending" ? "#fff3e0" : "#e8f5e9",
                      color: order.status === "Pending" ? "#ef6c00" : "#2e7d32"
                    }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px", background: "white", borderRadius: "15px" }}>
            <p>Aapne abhi tak koi order nahi kiya hai.</p>
            <a href="/products" style={{ color: "#2e7d32", fontWeight: "bold", textDecoration: "none" }}>Abhi Shopping Karein →</a>
          </div>
        )}
      </div>
    </div>
  );
}
