"use client";

export default function Company() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <section style={{ background: "#f4fff2", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ color: "#1b5e20", fontSize: "36px" }}>About Cerealswale</h1>
        <p style={{ color: "#555", fontSize: "18px" }}>Unit of CATALYST SERVICE PRIVATE LIMITED</p>
      </section>

      {/* Content */}
      <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", lineHeight: "1.8" }}>
        <h2 style={{ color: "#2e7d32" }}>Our Vision</h2>
        <p>
          Humara maqsad hai har kisan tak high-quality seeds aur modern technology pahunchana. 
          Cerealswale (CATALYST) agriculture sector mein ek kranti lana chahta hai jahan kisan ko sahi price aur sahi quality mile.
        </p>
        
        <div style={{ marginTop: "40px", padding: "30px", background: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: "15px" }}>
          <h3 style={{ color: "#1b5e20" }}>Company Details</h3>
          <p><strong>Name:</strong> CATALYST SERVICE PRIVATE LIMITED</p>
          <p><strong>Location:</strong> Kharghar, Navi Mumbai</p>
          <p><strong>Expertise:</strong> B2B E-commerce & Agricultural Solutions</p>
        </div>
      </div>
    </div>
  );
}
