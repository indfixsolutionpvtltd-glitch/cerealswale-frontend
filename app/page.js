"use client";
import React from "react";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

export default function Home() {
  // Hero Background Image URL
  const heroBackground = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop";

  return (
    <div style={{ background: "transparent", minHeight: "100vh" }}>
      
      {/* --- HERO SECTION --- */}
      <section style={heroSectionStyle}>
        <div style={bgImageContainer}>
          <img 
            src={heroBackground} 
            alt="Cereals Background" 
            style={bgImageStyle} 
          />
          <div style={heroOverlay}></div>
        </div>

        <div style={heroContentWrapper}>
          <div style={containerStyle}>
            <h1 style={heroHeading}>
              Modern Tech for <br/>
              <span style={{ color: "#81c784" }}>Sustainable Agriculture</span>
            </h1>
            <p style={heroSubheading}>
              Building a trusted ecosystem for Farmers, Entrepreneurs, and Institutional Buyers.
            </p>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", position: "relative", zIndex: 10 }}>
              <a href="/products" style={primaryBtn}>
                Explore Products <ArrowRight size={18}/>
              </a>
              <a href="/solutions/farmers" style={secondaryBtn}>
                Digital Solutions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section style={statsSectionStyle}>
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
      <section style={aboutSectionStyle}>
        <div style={containerStyle}>
          <div style={grid2Style}>
            <div style={aboutTextContent}>
              <h2 style={sectionHeading}>Empowering Rural <span style={{ color: "#2e7d32" }}>India</span></h2>
              <p style={aboutDescription}>
                CerealsWale (CATALYST SERVICE PRIVATE LIMITED) is revolutionizing the agricultural landscape through innovation and empathy.
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800" 
                alt="Agri Tech" 
                style={aboutImgStyle} 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- HELPERS ---
function StatCard({ count, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ fontSize: "32px", color: "#1b5e20", margin: "0" }}>{count}</h3>
      <p style={{ color: "#666", fontSize: "14px", fontWeight: "600" }}>{label}</p>
    </div>
  );
}

// --- STYLES (Surgically Cleaned) ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };

const heroSectionStyle = { 
  height: "85vh", 
  width: "100%", 
  position: "relative", 
  display: "flex", 
  alignItems: "center", 
  overflow: "hidden" 
};

const bgImageContainer = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 1
};

const bgImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center 30%"
};

const heroOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)",
  zIndex: 2
};

const heroContentWrapper = {
  position: "relative",
  zIndex: 5,
  width: "100%",
  color: "white"
};

const heroHeading = { 
  fontSize: "clamp(34px, 8vw, 65px)", 
  fontWeight: "800", 
  lineHeight: "1.1", 
  marginBottom: "20px",
  textShadow: "2px 2px 10px rgba(0,0,0,0.5)"
};

const heroSubheading = { 
  fontSize: "clamp(16px, 4vw, 22px)", 
  maxWidth: "600px", 
  marginBottom: "40px", 
  opacity: 0.9, 
  lineHeight: "1.5",
  textShadow: "1px 1px 5px rgba(0,0,0,0.5)"
};

const primaryBtn = { padding: "16px 32px", background: "#2e7d32", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" };
const secondaryBtn = { padding: "16px 32px", border: "2px solid white", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", backdropFilter: "blur(5px)" };

const statsSectionStyle = { padding: "60px 0", borderBottom: "1px solid #eee", background: "#fff" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "25px" };

const aboutSectionStyle = { padding: "100px 0", background: "#fff" };
const aboutTextContent = { paddingRight: "20px" };
const aboutDescription = { color: "#555", lineHeight: "1.8", fontSize: "17px" };

const grid2Style = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "50px", alignItems: "center" };
const sectionHeading = { fontSize: "clamp(28px, 6vw, 40px)", fontWeight: "800", marginBottom: "20px", color: "#333" };
const aboutImgStyle = { width: "100%", borderRadius: "25px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" };
