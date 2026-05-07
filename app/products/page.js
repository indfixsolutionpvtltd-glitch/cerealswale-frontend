"use client";

export default function Products() {
  const products = [
    {
      name: "Premium Wheat Seeds",
      price: 500,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"
    },
    {
      name: "Organic Rice Seeds",
      price: 700,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c"
    },
    {
      name: "Natural Fertilizer",
      price: 400,
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9"
    }
  ];

  const addToCart = (product) => {
    // Check karein ki hum browser mein hain ya nahi
    if (typeof window !== "undefined") {
      const oldCart = JSON.parse(localStorage.getItem("cart")) || [];
      oldCart.push(product);
      localStorage.setItem("cart", JSON.stringify(oldCart));
      alert("Product Added To Cart ✅");
    }
  };

  return (
    <div style={{ background: "#f4fff2", minHeight: "100vh", padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#1b5e20" }}>🌾 Our Products</h1>
        
        {/* Next.js mein navigation ke liye <a> use kar sakte hain ya window.location */}
        <button 
          onClick={() => window.location.href = '/cart'}
          style={{
            padding: "10px 20px",
            background: "#1b5e20",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          🛒 Go To Cart
        </button>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
        marginTop: "40px"
      }}>
        {products.map((item, index) => (
          <div key={index} style={{
            width: "300px",
            background: "white",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0px 0px 10px #ccc"
          }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "20px", margin: "10px 0" }}>{item.name}</h2>
              <h3 style={{ color: "#2e7d32", marginBottom: "15px" }}>₹{item.price}</h3>
              <button
                onClick={() => addToCart(item)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#43a047",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                🛒 Add To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
