"use client";
export default function Network() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Banner */}
      <section style={{ background: "#1b5e20", color: "white", padding: "60px 20px", textAlign: "center" }}>
        <h1>Our Vast Network</h1>
        <p>Connecting thousands of farmers with quality technology across the nation.</p>
      </section>

      {/* Stats Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", padding: "40px 10%", textAlign: "center" }}>
        <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "10px" }}>
          <h2 style={{ color: "#2e7d32" }}>15+</h2>
          <p>Indian States</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "10px" }}>
          <h2 style={{ color: "#2e7d32" }}>500+</h2>
          <p>Distributors</p>
        </div>
        <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "10px" }}>
          <h2 style={{ color: "#2e7d32" }}>10,000+</h2>
          <p>Happy Farmers</p>
        </div>
      </div>

      {/* Network Image/Map Placeholder */}
      <div style={{ textAlign: "center", padding: "40px" }}>
        <img src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800" alt="Farming Network" style={{ width: "100%", maxWidth: "800px", borderRadius: "20px" }} />
      </div>
    </div>
  );
}
