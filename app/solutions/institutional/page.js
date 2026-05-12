"use client";
import React from "react";
import { Cpu, BarChart, LineChart, Globe, ClipboardList, Zap, ArrowRight } from "lucide-react";

export default function InstitutionalSolution() {
  return (
    <div style={{ background: "#fff", fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      {/* --- HERO --- */}
      <section style={heroInstStyle}>
        <div style={containerStyle}>
          <div style={{ maxWidth: "800px", color: "white" }}>
            <h1 style={{ fontSize: "50px", fontWeight: "900" }}>Solution For Institutional Buyers</h1>
            <p style={{ fontSize: "20px", opacity: 0.9, lineHeight: "1.7", margin: "20px 0" }}>
              AI-Powered predictive analytics, data science, and commodity management for large food production companies.
            </p>
            <button style={greenBtn}>Request Demo</button>
          </div>
        </div>
      </section>

      {/* --- AI ENGINE SECTION --- */}
      <section style={{ padding: "100px 0" }}>
        <div style={containerStyle}>
          <div style={aiFlex}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "38px", color: "#1b5e20" }}>AI & Machine Learning Engine</h2>
              <p style={{ color: "#555", fontSize: "18px", lineHeight: "1.8" }}>
                Our Artificial Intelligence engine correlates parameters like weather, soil health, and mandi trends 
                to provide <b>Predictive Analytics</b> and <b>Early Warnings</b>. 
                Manage quantity, quality, and availability with precision.
              </p>
            </div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <InstCard icon={<Cpu/>} title="Predictive AI" />
              <InstCard icon={<LineChart/>} title="Early Warnings" />
              <InstCard icon={<BarChart/>} title="Crop Forecasting" />
              <InstCard icon={<Globe/>} title="Commodity Pipeline" />
            </div>
          </div>
        </div>
      </section>

      {/* --- MARKETPLACE --- */}
      <section style={marketplaceSection}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "50px" }}>Institutional Online Portal</h2>
          <div style={portalGrid}>
            <PortalItem text="Track Transactions in Real-time" />
            <PortalItem text="View Procurement Pipeline" />
            <PortalItem text="Bulk Corporate Ordering" />
            <PortalItem text="Live Commodity Auction (Soon)" />
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button style={whiteBtnSmall}>Explore Marketplace <ArrowRight size={18}/></button>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- HELPERS ---
function InstCard({ icon, title }) {
  return (
    <div style={{ padding: "30px", border: "1px solid #eee", borderRadius: "15px", textAlign: "center" }}>
      <div style={{ color: "#2e7d32", marginBottom: "15px" }}>{icon}</div>
      <h4 style={{ margin: 0 }}>{title}</h4>
    </div>
  );
}

function PortalItem({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "white", background: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px" }}>
      <Zap size={20} color="#81c784" /> <span>{text}</span>
    </div>
  );
}

// --- STYLES ---
const heroInstStyle = { 
  minHeight: "80vh", 
  backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1454165833767-027eeef1593e?w=1600')", 
  backgroundSize: "cover", 
  display: "flex", 
  alignItems: "center" 
};
const aiFlex = { display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" };
const marketplaceSection = { background: "#1b5e20", padding: "100px 0" };
const portalGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" };
const greenBtn = { padding: "18px 45px", background: "#2e7d32", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const whiteBtnSmall = { padding: "15px 35px", background: "white", color: "#1b5e20", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", margin: "0 auto" };
