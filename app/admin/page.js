"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);

  const verifyAdmin = () => {
    if (pass === "Ankur@123") setIsAuthorized(true);
    else alert("Wrong Password! ❌");
  };

  useEffect(() => {
    if (isAuthorized) {
      const ordersRef = ref(db, 'orders');
      onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setOrders(list.reverse()); // Naye orders upar dikhenge
        } else {
          setOrders([]);
        }
      });
    }
  }, [isAuthorized]);

  const updateStatus = (id, newStatus) => {
    const orderRef = ref(db, `orders/${id}`);
    update(orderRef, { status: newStatus });
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <div style={{ padding: "40px", background: "white", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "350px" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "60px", marginBottom: "20px" }} />
          <h2>Admin Login</h2>
          <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: "12px", margin: "20px 0", borderRadius: "8px", border: "1px solid #ddd" }} />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#1b5e20", color: "white", padding: "30px 20px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "30px" }}>CATALYST ADMIN</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <p style={{ background: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: "5px" }}>📦 Orders ({orders.length})</p>
          <p style={{ padding: "10px", cursor: "pointer" }}>🛒 Products</p>
          <p style={{ padding: "10px", cursor: "pointer" }}>👥 Customers</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <h1>Live Orders</h1>
          <button onClick={() => window.location.reload()} style={{ padding: "8px 15px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer" }}>Refresh Data</button>
        </header>

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Date</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Customer</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Product</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Price</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Status</th>
                <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px", fontSize: "14px" }}>{order.orderDate}</td>
                  <td style={{ padding: "15px", fontWeight: "bold" }}>{order.customerName}</td>
                  <td style={{ padding: "15px" }}>{order.productName}</td>
                  <td style={{ padding: "15px" }}>₹{order.price}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ 
                      padding: "5px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
                      background: order.status === "Pending" ? "#fff3e0" : "#e8f5e9",
                      color: order.status === "Pending" ? "#ef6c00" : "#2e7d32"
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <select 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ddd" }}
                    >
                      <option value="Pending">Set Pending</option>
                      <option value="Confirmed">Confirm Order</option>
                      <option value="Shipped">Ship Order</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p style={{ textAlign: "center", padding: "40px", color: "#999" }}>No orders found yet.</p>}
        </div>
      </div>
    </div>
  );
}
