"use client";

export default function Products() {
  const products = [
    { name: "Premium Wheat Seeds", price: 500, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b" },
    { name: "Organic Rice Seeds", price: 700, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c" },
    { name: "Natural Fertilizer", price: 400, image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9" }
  ];

  // Ye function ab Order place karega
  const buyProduct = (product) => {
    if (typeof window !== "undefined") {
      // Pehle se maujood orders uthayein
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      
      // Naya order details add karein
      const newOrder = {
        ...product,
        orderDate: new Date().toLocaleString(),
        status: "Pending"
      };

      existingOrders.push(newOrder);
      
      // Wapas localStorage mein save karein (Isse Admin Dashboard mein dikhega)
      localStorage.setItem("orders", JSON.stringify(existingOrders));
      
      alert(`Success! Aapka order "${product.name}" ke liye mil gaya hai. ✅`);
      window.location.href = "/orders"; // User ko orders page par bhej dein
    }
  };

  return (
    <div style={{ background: "#f4fff2", minHeight: "100vh", padding: "40px" }}>
      <h1 style={{ color: "#1b5e20", textAlign: "center" }}>🌾 Hamare Utpad</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap", marginTop: "40px" }}>
        {products.map((item, index) => (
          <div key={index} style={{ width: "300px", background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0px 0px 10px #ccc" }}>
            <img src={item.image} alt={item.name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <div style={{ padding: "20px" }}>
              <h2>{item.name}</h2>
              <h3 style={{ color: "#2e7d32" }}>₹{item.price}</h3>
              <button
                onClick={() => buyProduct(item)} // Button par click karne par order hoga
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
