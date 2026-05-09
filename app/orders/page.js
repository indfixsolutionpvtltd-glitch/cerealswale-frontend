// ... OrdersPage ke footer section mein ye button code replace karein:
<div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <div style={{ fontSize: "12px", color: "#64748b" }}>
    <b>Payment:</b> {o.paymentMethod || "N/A"} | <b>UTR:</b> {o.transactionId || "N/A"}
  </div>
  
  {/* Yahan fix kiya hai: Pay Now button hamesha dikhega agar status Pending hai */}
  {o.status === "Pending" && (
    <button 
      onClick={() => {
        localStorage.setItem("cart", JSON.stringify([{ id: o.id, name: o.productName, price: o.price, quantity: 1 }]));
        window.location.href = "/checkout";
      }}
      style={{ background: "#166534", color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
    >
      Pay Now
    </button>
  )}
</div>
