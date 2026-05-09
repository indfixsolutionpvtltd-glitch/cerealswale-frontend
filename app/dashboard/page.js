"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, set, update } from "firebase/database";
import { 
  User, MapPin, CreditCard, ShoppingBag, 
  CheckCircle, ChevronRight, Home, Phone 
} from "lucide-react";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null); // Yahan login user ki ID aayegi
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    houseNo: "",
    area: "",
    pincode: "",
    city: "Navi Mumbai"
  });
  const [orders, setOrders] = useState([]);
  const [activeSection, setActiveSection] = useState("profile");

  // Mock User ID (Jab login integrate hoga toh ye dynamic ho jayega)
  const userId = "User_Ankur_123"; 

  useEffect(() => {
    // Fetch Saved Address
    onValue(ref(db, `users/${userId}/address`), (snapshot) => {
      if (snapshot.exists()) setAddress(snapshot.val());
    });

    // Fetch User Orders
    onValue(ref(db, 'orders'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userOrders = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(order => order.userId === userId);
        setOrders(userOrders.reverse());
      }
    });
  }, []);

  const saveAddress = (e) => {
    e.preventDefault();
    set(ref(db, `users/${userId}/address`), address)
      .then(() => alert("Address Saved Successfully! 📍"))
      .catch(() => alert("Error saving address"));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fdfdfd", fontFamily: "sans-serif" }}>
      {/* Sidebar Navigation */}
      <div style={sidebarStyle}>
        <div style={{ padding: "30px 20px", borderBottom: "1px solid #eee", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", color: "#16a34a" }}>My Account</h2>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "0 10px" }}>
          <NavBtn active={activeSection === 'profile'} icon={<User size={18}/>} label="Profile" onClick={()=>setActiveSection('profile')} />
          <NavBtn active={activeSection === 'address'} icon={<MapPin size={18}/>} label="Saved Address" onClick={()=>setActiveSection('address')} />
          <NavBtn active={activeSection === 'orders'} icon={<ShoppingBag size={18}/>} label="My Orders" onClick={()=>setActiveSection('orders')} />
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", maxWidth: "900px" }}>
        
        {activeSection === 'profile' && (
          <section>
            <h1 style={titleStyle}>Welcome, Ankur!</h1>
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={avatarStyle}>A</div>
                <div>
                  <h3 style={{ margin: 0 }}>Ankur Gupta</h3>
                  <p style={{ color: "#666", fontSize: "14px" }}>ankur@example.com</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'address' && (
          <section>
            <h1 style={titleStyle}>Manage Address</h1>
            <div style={cardStyle}>
              <form onSubmit={saveAddress} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <input placeholder="Full Name" style={inputStyle} value={address.fullName} onChange={(e)=>setAddress({...address, fullName: e.target.value})} required />
                <input placeholder="Phone Number" style={inputStyle} value={address.phone} onChange={(e)=>setAddress({...address, phone: e.target.value})} required />
                <input placeholder="House No / Flat" style={inputStyle} value={address.houseNo} onChange={(e)=>setAddress({...address, houseNo: e.target.value})} required />
                <input placeholder="Area / Colony" style={inputStyle} value={address.area} onChange={(e)=>setAddress({...address, area: e.target.value})} required />
                <input placeholder="Pincode" style={inputStyle} value={address.pincode} onChange={(e)=>setAddress({...address, pincode: e.target.value})} required />
                <input placeholder="City" style={inputStyle} value={address.city} readOnly />
                <button type="submit" style={btnStyle}>Update Address</button>
              </form>
            </div>
          </section>
        )}

        {activeSection === 'orders' && (
          <section>
            <h1 style={titleStyle}>My Orders</h1>
            {orders.length === 0 ? (
              <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>No orders found yet.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ ...cardStyle, marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: "0 0 5px 0" }}>{order.productName}</h4>
                    <span style={{ fontSize: "12px", color: "#888" }}>ID: #{order.id.slice(-6)} | {order.orderDate}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", color: "#16a34a" }}>₹{order.price}</div>
                    <span style={{ fontSize: "12px", background: "#f0fdf4", padding: "2px 8px", borderRadius: "10px", color: "#166534" }}>{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}

// Sub-components
function NavBtn({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "12px", padding: "12px 15px", border: "none",
      background: active ? "#f0fdf4" : "transparent", color: active ? "#16a34a" : "#444",
      borderRadius: "8px", cursor: "pointer", textAlign: "left", fontWeight: active ? "600" : "400"
    }}>
      {icon} {label}
    </button>
  );
}

// Payment Integration Tip (Cart Page ke liye)
/* Jab Checkout page banayenge, wahan Payment Option aise dikhayenge:
  - Radio Button: [ ] Cash on Delivery (COD)
  - Radio Button: [ ] UPI Payment (Scan & Pay)
*/

// Styles
const sidebarStyle = { width: "260px", borderRight: "1px solid #eee", background: "white" };
const titleStyle = { fontSize: "24px", marginBottom: "25px", fontWeight: "700" };
const cardStyle = { background: "white", padding: "25px", borderRadius: "12px", border: "1px solid #efefef", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" };
const inputStyle = { padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", outline: "none" };
const btnStyle = { gridColumn: "span 2", padding: "14px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" };
const avatarStyle = { width: "50px", height: "50px", background: "#16a34a", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold" };
