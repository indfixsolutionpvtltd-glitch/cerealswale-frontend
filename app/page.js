"use client";
import React from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Globe2, 
  Lightbulb, 
  Briefcase, 
  Mail, 
  ArrowRight 
} from "lucide-react";

export default function Home() {
  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#fff", margin: 0 }}>
      
      {/* Hero Section */}
      <section style={{
        padding: "80px 20px",
        textAlign: "center",
        background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000') center/cover",
        color: "white",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 60px)", marginBottom: "20px" }}>Smart Solutions for Modern Agriculture</h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 22px)", maxWidth: "800px", margin: "0 auto 30px" }}>
          Empowering farmers with high-quality seeds and innovative agricultural solutions.
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/products" style={{ padding: "15px 30px", background: "#43a047", color: "white", borderRadius: "30px", textDecoration: "none", fontWeight: "bold" }}>Our Products</a>
          <a href="/contact" style={{ padding: "15px 30px", border: "2px solid white", color: "white", borderRadius: "30px", textDecoration: "none", fontWeight: "bold" }}>Contact Us</a>
        </div>
      </section>

      {/* --- STEP 4: QUICK NAVIGATION GRID (Surgically Added) --- */}
      <section style={{ padding: "40px 20px", background: "#f0fdf4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
            <NavCard title="Dashboard" icon={<LayoutDashboard size={24}/>} link="/dashboard" color="#1b5e20" />
            <NavCard title="Company" icon={<Building2 size={24}/>} link="/company" color="#2e7d32" />
            <NavCard title="Network" icon={<Globe2 size={24}/>} link="/network" color="#388e3c" />
            <NavCard title="Solutions" icon={<Lightbulb size={24}/>} link="/solutions" color="#43a047" />
            <NavCard title="Careers" icon={<Briefcase size={24}/>} link="/careers" color="#4caf50" />
            <NavCard title="Contact" icon={<Mail size={24}/>} link="/contact" color="#66bb6a" />
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "center" }}>
          <div>
            <h2 style={{ color: "#2e7d32", fontSize: "32px" }}>About Cerealswale</h2>
            <p style={{ color: "#555", lineHeight: "1.8" }}>
              Cerealswale (CATALYST SERVICE PRIVATE LIMITED) is dedicated to revolutionizing the agricultural landscape. 
              We provide end-to-end solutions from quality seeds to expert farming advice.
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}>✅ Global Network of Farmers</li>
              <li style={{ marginBottom: "10px" }}>✅ Innovative Seed Technology</li>
              <li style={{ marginBottom: "10px" }}>✅ Sustainable Farming Solutions</li>
            </ul>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600" alt="Agriculture" style={{ width: "100%", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section style={{ background: "#f9f9f9", padding: "60px 20px" }}>
        <h2 style={{ textAlign: "center", color: "#1b5e20", marginBottom: "40px" }}>Our Solutions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", maxWidth: "1200px", margin: "0 auto" }}>
          <SolutionCard title="Crop Protection" icon="🛡️" />
          <SolutionCard title="Seed Enhancement" icon="🧬" />
          <SolutionCard title="Digital Farming" icon="📱" />
          <SolutionCard title="Yield Optimization" icon="📈" />
        </div>
      </section>
    </div>
  );
}

// --- Navigation Card Component ---
function NavCard({ title, icon, link, color }) {
  return (
    <a href={link} style={{
      textDecoration: "none",
      background: "white",
      padding: "20px",
      borderRadius: "15px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      transition: "transform 0.2s",
      borderBottom: `4px solid ${color}`
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ color: color }}>{icon}</div>
      <span style={{ fontWeight: "bold", color: "#333", fontSize: "14px" }}>{title}</span>
    </a>
  );
}

function SolutionCard({ title, icon }) {
  return (
    <div style={{ background: "white", padding: "30px", borderRadius: "10px", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: "40px", marginBottom: "15px" }}>{icon}</div>
      <h3 style={{ color: "#333" }}>{title}</h3>
      <p style={{ color: "#777", fontSize: "14px" }}>Innovative technology for better crop results.</p>
    </div>
  );
}
