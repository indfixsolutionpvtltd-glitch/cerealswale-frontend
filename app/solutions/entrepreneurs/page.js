"use client";
import React from "react";
import { 
  Briefcase, BarChart3, Tablet, Database, GraduationCap, 
  Store, Users, CheckCircle, ArrowUpRight 
} from "lucide-react";

export default function EntrepreneurSolution() {
  const cards = [
    { title: "Inventory Planning", icon: <Briefcase size={30}/>, text: "Supervise assets and stock with automated ordering systems." },
    { title: "Balance Sheet", icon: <BarChart3 size={30}/>, text: "Simplified bookkeeping with automatic financial statement generation." },
    { title: "Digitized Operations", icon: <Tablet size={30}/>, text: "One-click ordering and doorstep service via our smart app." },
    { title: "Data Management", icon: <Database size={30}/>, text: "Centralized storage for real-time farmer and operational data." },
    { title: "Knowledge Hub", icon: <GraduationCap size={30}/>, text: "Scientific crop methods and business learning tools in your hand." },
  ];

  return (
    <div style={{ background: "#fff", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* --- HERO SECTION --- */}
      <section style={heroEntrepreneurStyle}>
        <div style={containerStyle}>
          <div style={{ maxWidth: "700px", color: "white" }}>
            <h1 style={{ fontSize: "55px", fontWeight: "900" }}>Solution For Micro-Entrepreneur</h1>
            <h3 style={{ color: "#ffb74d", fontSize: "24px", marginBottom: "20px" }}>Agri Solution Franchise</h3>
            <p style={{ fontSize: "20px", opacity: 0.9, lineHeight: "1.6" }}>
              Transform rural business through our one-stop agri service centers. 
              Sustainable economic change at the grassroots level.
            </p>
            <div style={{ marginTop: "40px", display: "flex", gap: "15px" }}>
              <button style={orangeBtn}>Join Now</button>
              <button style={whiteBtn}>Become a Partner</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRAINING SECTION --- */}
      <section style={{ padding: "100px 0", background: "#fdf7f2" }}>
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "42px", color: "#e65100" }}>Training and Business Development</h2>
            <p style={{ color: "#777" }}>Empowering local entrepreneurs with modern technology and business systems.</p>
          </div>

          <div style={featureGrid}>
            {cards.map((c, i) => (
              <div key={i} style={featureCard}>
                <div style={iconBox}>{c.icon}</div>
                <h3 style={{ color: "#333", margin: "15px 0" }}>{c.title}</h3>
                <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATISTICS --- */}
      <section style={{ padding: "60px 0", borderTop: "1px solid #eee" }}>
        <div style={containerStyle}>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
            <StatBox icon={<Users />} num="500+" text="Entrepreneurs" />
            <StatBox icon={<Store />} num="250+" text="Franchise Centers" />
            <StatBox icon={<CheckCircle />} num="1M+" text="Farmers Served" />
          </div>
        </div>
      </section>
    </div>
  );
}

// --- HELPERS ---
function StatBox({ icon, num, text }) {
  return (
    <div style={{ textAlign: "center", padding: "20px", minWidth: "180px" }}>
      <div style={{ color: "#e65100", marginBottom: "10px" }}>{icon}</div>
      <h2 style={{ fontSize: "35px", margin: "0", color: "#333" }}>{num}</h2>
      <p style={{ color: "#888", fontWeight: "600" }}>{text}</p>
    </div>
  );
}

// --- STYLES (FIXED: Added containerStyle) ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };
const heroEntrepreneurStyle = { 
  minHeight: "80vh", 
  backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=1600')", 
  backgroundSize: "cover", 
  backgroundPosition: "center",
  display: "flex", 
  alignItems: "center" 
};
const orangeBtn = { padding: "15px 40px", background: "#e65100", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const whiteBtn = { padding: "15px 40px", background: "white", color: "#e65100", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const featureGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px" };
const featureCard = { background: "white", padding: "35px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #eee", textAlign: "center" };
const iconBox = { background: "#fff3e0", color: "#e65100", width: "70px", height: "70px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" };
