"use client";
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, push, set, update } from "firebase/database";

export default function AdminDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pass, setPass] = useState("");
  const [orders, setOrders] = useState([]);
  
  // Product States
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pImage, setPImage] = useState("");

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
          const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setOrders(list.reverse());
        }
      });
    }
  }, [isAuthorized]);

  const addProduct = (e) => {
    e.preventDefault();
    const productsRef = ref(db, 'products');
    const newProductRef = push(productsRef);

    set(newProductRef, {
      name: pName,
      price: pPrice,
      image: pImage || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
    }).then(() => {
      alert("Product Added! ✅");
      setPName(""); setPPrice(""); setPImage("");
    });
  };

  const updateStatus = (id, status) => {
    const orderRef = ref(db, `orders/${id}`);
    update(orderRef, { status: status });
  };

  if (!isAuthorized) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" }}>
        <div style={{ padding: "40px", background: "white", borderRadius: "15px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <h2>🔐 CATALYST Admin</h2>
          <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} style={{ width: "100%", padding: "12px", margin: "20px 0", borderRadius: "8px", border: "1px solid #ddd" }} />
          <button onClick={verifyAdmin} style={{ width: "100%", padding: "12px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6" }}>
      <div style={{ width: "260px", background: "#1b5e20", color: "white", padding: "30px 20px" }}>
        <h2>ADMIN PANEL</h2>
        <p>📦 Total Orders: {orders.length}</p>
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <section style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3>Add New Product</h3>
          <form onSubmit={addProduct} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input type="text" placeholder="Product Name" value={pName} onChange={(e)=>setPName(e.target.value)} required style={{ padding: "10px", flex: 1 }} />
            <input type="number" placeholder="Price" value={pPrice} onChange={(e)=>setPPrice(e.target.value)} required style={{ padding: "10px", width: "100px" }} />
            <button type="submit" style={{ padding: "10px 20px", background: "#2e7d32", color: "white", border: "none", borderRadius: "5px" }}>Add</button>
          </form>
        </section>

        <h1>Live Orders</h1>
        <div style={{ background: "white", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                <th style={{ padding: "15px" }}>Customer</th>
                <th style={{ padding: "15px" }}>Product</th>
                <th style={{ padding: "15px" }}>Price</th>
                <th style={{ padding: "15px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px", fontWeight: "bold" }}>{order.customerName}</td>
                  <td style={{ padding: "15px" }}>{order.productName}</td>
                  <td style={{ padding: "15px" }}>₹{order.price}</td>
                  <td style={{ padding: "15px" }}>
                    <select onChange={(e) => updateStatus(order.id, e.target.value)} value={order.status} style={{ padding: "5px" }}>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
