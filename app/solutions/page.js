"use client";

export default function Solutions() {
  const solutions = [
    { title: "Smart Seed Selection", desc: "Best quality seeds for high yield." },
    { title: "B2B Marketplace", desc: "Connecting local vendors and farmers directly." },
    { title: "Logistics Support", desc: "Faster delivery of agricultural products." },
    { title: "Digital Farming", desc: "App-based monitoring for crop health." }
  ];

  return (
    <div style={{ padding: "60px 20px", background: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center", color: "#1b5e20", marginBottom: "40px" }}>Our Solutions</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", maxWidth: "1200px", margin: "0 auto" }}>
        {solutions.map((s, i) => (
          <div key={i} style={{ background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
            <h3 style={{ color: "#2e7d32" }}>{s.title}</h3>
            <p style={{ color: "#666" }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
