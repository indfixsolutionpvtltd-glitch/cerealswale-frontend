"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { ref, onValue, off } from "firebase/database";
import { ShoppingBag, CreditCard, Calendar, Hash } from "lucide-react";

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
          .filter(o => 
            o.customerEmail === email && 
            o.orderId && // Sirf wahi dikhao jisme numerical ID ho
            o.createdAt && // Sirf wahi jisme Date ho
            o.createdAt !== "Processing..." // Kachra data filter karein
          );
        
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
        <div style={{textAlign:"center", padding:"50px", background:"#f8fafc", borderRadius:"20px", border:"2px dashed #e2e8f0"}}>
           <p style={{color:"#64748b"}}>Abhi tak koi valid order nahi mila hai.</p>
           <button onClick={() => window.location.href = "/products"} style={{background:"#16a34a", color:"white", border:"none", padding:"10px 20px", borderRadius:"8px", cursor:"pointer", marginTop:"15px"}}>Start Shopping</button>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={{ background:"#fff", padding:"25px", borderRadius:"15px", boxShadow:"0 4px 20px rgba(0,0,0,0.05)", marginBottom:"20px", borderLeft:"6px solid #16a34a" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{flex:1}}>
                <h3 style={{ margin:"0 0 10px 0", color:"#334155", fontSize:"18px", fontWeight:"700" }}>{o.productName}</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:"5px", fontSize:"12px", color:"#64748b" }}>
                  <span><Hash size={14} style={{verticalAlign:"middle"}}/> <b>ID:</b> {o.orderId}</span>
                  <span><Calendar size={14} style={{verticalAlign:"middle"}}/> <b>Date:</b> {o.createdAt}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <h2 style={{ margin:0, color:"#16a34a", fontSize:"22px" }}>₹{o.price}</h2>
                <span style={{ fontSize:"11px", background:"#fef3c7", padding:"3px 10px", borderRadius:"20px", fontWeight:"bold", color:"#92400e" }}>{o.status}</span>
              </div>
            </div>
            <div style={{ marginTop:"15px", paddingTop:"15px", borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"12px", color:"#64748b" }}>
              <span><b>Payment:</b> {o.paymentMethod} | <b>UTR:</b> {o.transactionId}</span>
              <button onClick={() => window.location.href = "/checkout"} style={{ background:"#166534", color:"white", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer" }}>Pay Now</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
