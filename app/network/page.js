"use client";
export default function Network() {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center", background: "#f9f9f9" }}>
      <h1 style={{ color: "#2e7d32" }}>Our Global & Local Network</h1>
      <p style={{ maxWidth: "800px", margin: "0 auto", color: "#555" }}>
        Cerealswale (CATALYST) connects over 10,000+ farmers across India with modern markets.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "40px", maxWidth: "1200px", margin: "40px auto" }}>
        <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px #ddd" }}>
          <h2>🚜 10K+</h2>
          <p>Active Farmers</p>
        </div>
        <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px #ddd" }}>
          <h2>📍 15+</h2>
          <p>States Covered</p>
        </div>
        <div style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px #ddd" }}>
          <h2>🏢 50+</h2>
          <p>Distributor Centers</p>
        </div>
      </div>
    </div>
  );
}
