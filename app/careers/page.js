"use client";
export default function Careers() {
  return (
    <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ color: "#2e7d32", textAlign: "center" }}>Join Our Mission</h1>
      <p style={{ textAlign: "center", color: "#666" }}>Work with CATALYST SERVICE PRIVATE LIMITED to grow the future of farming.</p>
      
      <div style={{ marginTop: "40px" }}>
        <div style={{ border: "1px solid #eee", padding: "20px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <h3>Agricultural Expert</h3>
            <p>Location: Navi Mumbai / Remote</p>
          </div>
          <button style={{ background: "#2e7d32", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Apply Now</button>
        </div>
        <div style={{ border: "1px solid #eee", padding: "20px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <h3>Sales Manager</h3>
            <p>Location: Field Work</p>
          </div>
          <button style={{ background: "#2e7d32", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Apply Now</button>
        </div>
      </div>
    </div>
  );
}
