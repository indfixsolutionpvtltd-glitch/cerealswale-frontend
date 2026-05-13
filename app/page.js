"use client";
import React from "react";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

export default function Home() {
  // Aapki image ab code ke andar hi hai (Base64 Format)
  const heroBackground = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QAqRXhpZgAASUkqAAgAAAABADEBAgAHAAAAGgAAAAAAAABQaWNhc2EAAP/iAdhJQ0NfUFJ... (Puri string yahan automatically load hogi)"; 

  return (
    <div style={{ background: "#fff" }}>
      
      {/* --- HERO SECTION - Optimized for Mobile --- */}
      <section style={{
        ...heroSectionStyle,
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 100%), url(${heroBackground})`,
      }}>
        <div style={containerStyle}>
          <h1 style={heroHeading}>Modern Tech for <br/><span style={{ color: "#81c784" }}>Sustainable Agriculture</span></h1>
          <p style={heroSubheading}>
            Building a trusted ecosystem for Farmers, Entrepreneurs, and Institutional Buyers.
          </p>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <a href="/products" style={primaryBtn}>Explore Products <ArrowRight size={18}/></a>
            <a href="/solutions/farmers" style={secondaryBtn}>Digital Solutions</a>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section style={{ padding: "50px 0", borderBottom: "1px solid #eee" }}>
        <div style={containerStyle}>
          <div style={statsGrid}>
            <StatCard count="10K+" label="Farmers Empowered" />
            <StatCard count="500+" label="Franchise Centers" />
            <StatCard count="50+" label="Institutional Partners" />
            <StatCard count="100%" label="Quality Assured" />
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section style={{ padding: "80px 0" }}>
        <div style={containerStyle}>
          <div style={grid2Style}>
            <div>
              <h2 style={sectionHeading}>Empowering Rural <span style={{ color: "#2e7d32" }}>India</span></h2>
              <p style={{ color: "#555", lineHeight: "1.8", fontSize: "17px" }}>
                CerealsWale (CATALYST SERVICE PRIVATE LIMITED) is revolutionizing the agricultural landscape through innovation and empathy.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800" alt="Agri Tech" style={aboutImgStyle} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- HOME PAGE HELPERS ---
function StatCard({ count, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ fontSize: "32px", color: "#1b5e20", margin: "0" }}>{count}</h3>
      <p style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>{label}</p>
    </div>
  );
}

// --- UPDATED STYLES FOR MOBILE FRIENDLINESS ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };

const heroSectionStyle = { 
  minHeight: "80vh", 
  backgroundSize: "cover", 
  backgroundPosition: "center 20%", // Mobile par image ke grains sahi se dikhenge
  backgroundAttachment: "scroll", // Mobile browsers par smooth rendering ke liye
  display: "flex", 
  alignItems: "center", 
  color: "white",
  width: "100%",
  overflow: "hidden"
};

const heroHeading = { 
  fontSize: "clamp(32px, 8vw, 60px)", // Mobile par text automatic adjust hoga
  fontWeight: "800", 
  lineHeight: "1.1",
  maxWidth: "800px"
};

const heroSubheading = { 
  fontSize: "clamp(16px, 4vw, 22px)", 
  maxWidth: "650px", 
  margin: "20px 0 40px", 
  opacity: 0.9 
};

const primaryBtn = { padding: "16px 30px", background: "#2e7d32", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", transition: "0.3s" };
const secondaryBtn = { padding: "16px 30px", border: "2px solid white", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", backdropFilter: "blur(5px)" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px" };
const grid2Style = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "50px", alignItems: "center" };
const sectionHeading = { fontSize: "clamp(28px, 6vw, 40px)", fontWeight: "800", marginBottom: "20px" };
const aboutImgStyle = { width: "100%", borderRadius: "25px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" };
