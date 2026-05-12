"use client";
import React, { useState } from "react";
import { 
  Sprout, CloudSun, MapPin, TestTube, ShoppingCart, 
  UserCheck, ShieldCheck, TrendingUp, ChevronDown, ChevronUp, ArrowRight 
} from "lucide-react";

export default function FarmersSolution() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    { id: 1, title: "Soil Testing", icon: <TestTube />, desc: "Scientific analysis of your soil for better fertilizer planning." },
    { id: 2, title: "Farm Tagging", icon: <MapPin />, desc: "Digital mapping of your land for precise monitoring." },
    { id: 3, title: "Crop Planner", icon: <Sprout />, desc: "Seasonal planning to maximize your yield and profit." },
    { id: 4, title: "Weather Alerts", icon: <CloudSun />, desc: "Real-time updates to protect crops from natural changes." },
    { id: 5, title: "Quality Input", icon: <ShoppingCart />, desc: "Access to certified seeds and fertilizers at best prices." },
    { id: 6, title: "Expert Connect", icon: <UserCheck />, desc: "Direct consultation with top Indian agronomists." },
    { id: 7, title: "Crop Insurance", icon: <ShieldCheck />, desc: "Satellite-based parametric insurance for total peace of mind." },
    { id: 8, title: "Mandi Rates", icon: <TrendingUp />, desc: "Live market prices to help you sell at the right time." },
  ];

  return (
    <div style={{ background: "#fff", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* --- HERO SECTION --- */}
      <section style={heroStyle}>
        <div style={overlayStyle}>
          <div style={containerStyle}>
            <h1 style={mainHeading}>Digital Solution For Farmers</h1>
            <p style={subHeading}>Empowering Indian Farmers with Smart Technology and Data-Driven Growth.</p>
            
            {/* Interactive Accordion Menu */}
            <div style={accordionContainer}>
              {features.map((f) => (
                <div key={f.id} style={accordionItem}>
                  <button 
                    onClick={() => setActiveFeature(activeFeature === f.id ? null : f.id)}
                    style={accordionBtn}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {f.icon} {f.title}
                    </span>
                    {activeFeature === f.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                  </button>
                  {activeFeature === f.id && <div style={accordionDesc}>{f.desc}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- INTRO SECTION (5 A's) --- */}
      <section style={{ padding: "80px 0", background: "#f8fdf9", textAlign: "center" }}>
        <div style={containerStyle}>
          <h2 style={sectionTitle}>5 A’s We Offer to Empower Farmers</h2>
          <p style={{ maxWidth: "800px", margin: "0 auto 40px", color: "#666" }}>
            Our mission is to improve productivity, reduce farming risks, and increase profitability through 5 core pillars.
          </p>
          <div style={statsGrid}>
            <StatItem num="10K+" label="Farmers Served" />
            <StatItem num="500+" label="Mandi Links" />
            <StatItem num="98%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* --- SERVICE SECTIONS (Alternating) --- */}
      <ServiceSection 
        title="Access to Quality Input" 
        text="Fast delivery of certified seeds and fertilizers directly to your field. Save time and money with our recommendation engine."
        img="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600"
        reverse={false}
      />
      <ServiceSection 
        title="Access to Affordable Insurance" 
        text="Satellite-based parametric weather insurance protects you from crop loss due to natural calamities with quick claim processing."
        img="https://images.unsplash.com/photo-1560340155-900366479017?w=600"
        reverse={true}
      />
      <ServiceSection 
        title="Access to Actionable Advisory" 
        text="Expert guidance on crop health and modern techniques to tackle farming problems in real-time."
        img="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=600"
        reverse={false}
      />

      {/* --- CTA SECTION --- */}
      <section style={ctaSection}>
        <h2>Ready to transform your farm?</h2>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px" }}>
          <button style={primaryBtn}>Get Started</button>
          <button style={secondaryBtn}>Contact Experts</button>
        </div>
      </section>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function ServiceSection({ title, text, img, reverse }) {
  return (
    <div style={{ padding: "80px 0" }}>
      <div style={{ ...containerStyle, display: "flex", flexDirection: reverse ? "row-reverse" : "row", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3 style={{ fontSize: "32px", color: "#1b5e20", marginBottom: "20px" }}>{title}</h3>
          <p style={{ fontSize: "18px", color: "#555", lineHeight: "1.8" }}>{text}</p>
          <button style={{ background: "none", border: "none", color: "#2e7d32", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px", marginTop: "20px", cursor: "pointer" }}>
            Learn More <ArrowRight size={18}/>
          </button>
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <img src={img} alt={title} style={{ width: "100%", borderRadius: "20px", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" }} />
        </div>
      </div>
    </div>
  );
}

function StatItem({ num, label }) {
  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ fontSize: "40px", color: "#2e7d32", margin: "0" }}>{num}</h3>
      <p style={{ color: "#666", fontWeight: "600" }}>{label}</p>
    </div>
  );
}

// --- STYLES ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };
const heroStyle = { 
  minHeight: "90vh", 
  backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600')", 
  backgroundSize: "cover", 
  backgroundPosition: "center", 
  position: "relative" 
};
const overlayStyle = { background: "rgba(0,0,0,0.6)", minHeight: "90vh", display: "flex", alignItems: "center", padding: "60px 0" };
const mainHeading = { color: "#fff", fontSize: "clamp(32px, 6vw, 60px)", fontWeight: "800", marginBottom: "20px" };
const subHeading = { color: "#81c784", fontSize: "20px", marginBottom: "40px", fontWeight: "600" };
const accordionContainer = { maxWidth: "600px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", borderRadius: "15px", overflow: "hidden" };
const accordionItem = { borderBottom: "1px solid rgba(255,255,255,0.1)" };
const accordionBtn = { width: "100%", padding: "15px 20px", background: "none", border: "none", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontWeight: "600" };
const accordionDesc = { padding: "15px 20px", background: "rgba(0,0,0,0.3)", color: "#eee", fontSize: "14px" };
const sectionTitle = { fontSize: "40px", fontWeight: "800", color: "#1b5e20", marginBottom: "20px" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" };
const ctaSection = { padding: "100px 20px", background: "#1b5e20", color: "#fff", textAlign: "center" };
const primaryBtn = { padding: "15px 35px", background: "#fff", color: "#1b5e20", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const secondaryBtn = { padding: "15px 35px", background: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
