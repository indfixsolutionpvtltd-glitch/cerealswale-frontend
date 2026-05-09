"use client";
import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { CreditCard, Package, Calendar, Hash, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email || "Guest";
    const ordersRef = ref(db, 'orders');

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(o => o.customerEmail === email); // Sirf email match hona kaafi hai
        
        // Sorting: Latest upar
        setOrders(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => off(ordersRef);
  }, []);

  if (loading) return <div style={{textAlign:"center", padding:"100px", color:"#166534"}}>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#166534", marginBottom: "30px", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
        <ShoppingBag /> Mere Orders
      </h2>
      
      {orders.length === 0 ? (
        <div style={emptyBox}>
           <Package size={50} color="#cbd5e1" />
           <p>Abhi tak koi order nahi mila hai.</p>
           <button onClick={() => window.location.href = "/products"} style={btnShop}>Start Shopping</button>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={orderCard}>
            <div style={cardHeader}>
              <div style={{flex:1}}>
                <h3 style={prodName}>{o.productName}</h3>
                <div style={metaGrid}>
                  <span style={metaItem}><Hash size={14}/> ID: {o.orderId || o.id.slice(-6)}</span>
                  <span style={metaItem}><Calendar size={14}/> Date: {o.createdAt || "Processing..."}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <h2 style={priceTag}>₹{o.price}</h2>
                <span style={statusTag}>{o.status || "Pending"}</span>
              </div>
            </div>
            <div style={cardFooter}>
              <span><b>Payment:</b> {o.paymentMethod}</span>
              <span><b>UTR:</b> {o.transactionId || "N/A"}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Styles
const orderCard = { background:"#fff", padding:"25px", borderRadius:"15px", boxShadow:"0 4px 20px rgba(0,0,0,0.05)", marginBottom:"20px", borderLeft:"6px solid #16a34a" };
const cardHeader = { display:"flex", justifyContent:"space-between", alignItems:"flex-start" };
const prodName = { margin:"0 0 10px 0", color:"#334155", fontSize:"18px", fontWeight:"700" };
const metaGrid = { display:"flex", flexDirection:"column", gap:"5px" };
const metaItem = { fontSize:"12px", color:"#64748b", display:"flex", alignItems:"center", gap:"5px" };
const priceTag = { margin:0, color:"#16a34a", fontSize:"22px" };
const statusTag = { fontSize:"11px", background:"#fef3c7", padding:"3px 10px", borderRadius:"20px", fontWeight:"bold", color:"#92400e" };
const cardFooter = { marginTop:"15px", paddingTop:"15px", borderTop:"1px solid #f1f5f9", display:"flex", gap:"20px", fontSize:"12px", color:"#64748b" };
const emptyBox = { textAlign:"center", padding:"60px", background:"#f8fafc", borderRadius:"20px", border:"2px dashed #e2e8f0" };
const btnShop = { background:"#16a34a", color:"white", border:"none", padding:"10px 20px", borderRadius:"8px", cursor:"pointer", marginTop:"15px" };
