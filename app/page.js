"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Yahan apni puri Base64 string paste karein (Jo maine pichle message mein di thi)
  const heroBackground = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QAqRXhpZgAASUkqAAgAAAABADEBAgAHAAAAGgAAAAAAAABQaWNhc2EAAP/iAdhJQ0NfUFJ... (Paste Full String Here)"; 

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      
      {/* --- HERO SECTION --- */}
      <section style={{
        ...heroSectionStyle,
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%), url(${heroBackground})`,
      }}>
        <div style={containerStyle}>
          <div style={heroTextWrapper}>
            <h1 style={heroHeading}>
              Modern Tech for <br/>
              <span style={{ color: "#81c784" }}>Sustainable Agriculture</span>
            </h1>
            <p style={heroSubheading}>
              Building a trusted ecosystem for Farmers, Entrepreneurs, and Institutional Buyers through innovation.
            </p>
            <div style={btnGroup}>
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
                CerealsWale (CATALYST SERVICE PRIVATE LIMITED) is revolutionizing the agricultural landscape through innovation, empathy, and data-driven solutions.
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

// --- COMPONENTS ---
function StatCard({ count, label }) {
  return (
    <div style={statCardStyle}>
      <h3 style={statCount}>{count}</h3>
      <p style={statLabel}>{label}</p>
    </div>
  );
}

// --- UPDATED STYLES ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };

const heroSectionStyle = { 
  minHeight: "85vh", 
  backgroundSize: "cover", 
  backgroundPosition: "center", 
  backgroundRepeat: "no-repeat",
  display: "flex", 
  alignItems: "center", 
  color: "white",
  width: "100%",
  marginTop: "-2px", // Layout gaps fix karne ke liye
};

const heroTextWrapper = {
  padding: "40px 0",
  animation: "fadeIn 1s ease-in"
};

const heroHeading = { 
  fontSize: "clamp(34px, 7vw, 64px)", 
  fontWeight: "800", 
  lineHeight: "1.1",
  marginBottom: "20px",
  textShadow: "2px 2px 10px rgba(0,0,0,0.3)"
};

const heroSubheading = { 
  fontSize: "clamp(18px, 2.5vw, 24px)", 
  maxWidth: "600px", 
  margin: "0 0 40px 0", 
  opacity: 0.95,
  lineHeight: "1.5"
};

const btnGroup = { display: "flex", gap: "15px", flexWrap: "wrap" };

const primaryBtn = { 
  padding: "16px 32px", 
  background: "#2e7d32", 
  color: "white", 
  borderRadius: "8px", 
  textDecoration: "none", 
  fontWeight: "bold", 
  display: "flex", 
  alignItems: "center", 
  gap: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
};

const secondaryBtn = { 
  padding: "16px 32px", 
  border: "2px solid white", 
  color: "white", 
  borderRadius: "8px", 
  textDecoration: "none", 
  fontWeight: "bold", 
  backdropFilter: "blur(5px)" 
};

const statsSectionStyle = { padding: "60px 0", background: "#fff", borderBottom: "1px solid #eee" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "30px" };
const statCardStyle = { textAlign: "center" };
const statCount = { fontSize: "36px", color: "#1b5e20", margin: "0", fontWeight: "800" };
const statLabel = { color: "#666", fontSize: "14px", fontWeight: "600", marginTop: "5px" };

const aboutSectionStyle = { padding: "100px 0", background: "#fcfcfc" };
const aboutTextContent = { paddingRight: "20px" };
const aboutDescription = { color: "#555", lineHeight:
