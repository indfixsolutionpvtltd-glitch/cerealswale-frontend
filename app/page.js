"use client";
import React from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Globe2, 
  Lightbulb, 
  Briefcase, 
  Mail,
  CheckCircle 
} from "lucide-react";

export default function Home() {
  // Aapki uploaded image ka path yahan use kiya hai
  const heroBackground = "/web site stock photo.jpg"; 

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#fff", margin: 0 }}>
      
      {/* Hero Section - Updated with your Image */}
      <section style={{
        padding: "100px 20px",
        textAlign: "left", // Left align for a modern look
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%), url(${heroBackground})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        color: "white",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
            <h1 style={{ 
                fontSize: "clamp(32px, 6vw, 68px)", 
                marginBottom: "24px", 
                fontWeight: "800",
                lineHeight: "1.1",
                maxWidth: "700px" 
            }}>
                Smart Solutions for <span style={{ color: "#81c784" }}>Modern Agriculture</span>
            </h1>
            <p style={{ 
                fontSize: "clamp(18px, 2.5vw, 24px)", 
                maxWidth: "600px", 
                marginBottom: "40px",
                lineHeight: "1.6",
                opacity: "0.9"
            }}>
                Empowering farmers with high-quality seeds, organic pulses, and innovative agricultural technology for a sustainable future.
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <a href="/products" style={{ 
                    padding: "18px 40px", 
                    background: "#2e7d32", 
                    color: "white", 
                    borderRadius: "8px", 
                    textDecoration: "none", 
                    fontWeight: "bold",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                }}>
                    Our Products
                </a>
                <a href="/contact" style={{ 
                    padding: "18px 40px", 
                    border: "2px solid white", 
                    color: "white", 
                    borderRadius: "8px", 
                    textDecoration: "none", 
                    fontWeight: "bold",
                    backdropFilter: "blur(5px)"
                }}>
                    Contact Us
                </a>
            </div>
        </div>
      </section>

      {/* Quick Navigation Grid */}
      <section style={{ padding: "60px 20px", background: "#f1f8e9", marginTop: "-40px", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "25px" }}>
            <NavCard title="Dashboard" icon={<LayoutDashboard size={24}/>} link="/dashboard" color="#1b5e20" />
            <NavCard title="Company" icon={<Building2 size={24}/>} link="/company" color="#2e7d32" />
            <NavCard title="Network" icon={<Globe2 size={24}/>} link="/network" color="#388e3c" />
            <NavCard title="Solutions" icon={<Lightbulb size={24}/>} link="/solutions" color="#43a047" />
            <NavCard title="Careers" icon={<Briefcase size={24}/>} link="/careers" color="#4caf50" />
            <NavCard title="Contact" icon={<Mail size={24}/>} link="/contact" color="#66bb6a" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: "80px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" }}>
          <div>
            <h2 style={{ color: "#2e7d32", fontSize: "40px", marginBottom: "25px", fontWeight: "700" }}>About Cerealswale</h2>
            <p style={{ color: "#444", lineHeight: "1.9", fontSize: "17px", marginBottom: "25px" }}>
              Cerealswale (CATALYST SERVICE PRIVATE LIMITED) is dedicated to revolutionizing the agricultural landscape. 
              We bridge the gap between traditional farming and modern efficiency.
            </p>
            <div style={{ display: "grid", gap: "15px" }}>
              <FeatureItem text="Global Network of 10,000+ Farmers" />
              <FeatureItem text="Innovative & Organic Seed Technology" />
              <FeatureItem text="Sustainable Farming Solutions" />
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800" 
                alt="Agriculture" 
                style={{ width: "100%", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }} 
            />
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section style={{ background: "#f9f9f9", padding: "100px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", color: "#1b5e20", marginBottom: "60px", fontSize: "36px", fontWeight: "700" }}>Our Expertise</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
              <SolutionCard title="Crop Protection" icon="🛡️" desc="Advanced shields to ensure crop safety and health." />
              <SolutionCard title="Seed Enhancement" icon="🧬" desc="Providing seeds with higher resilience and yields." />
              <SolutionCard title="Digital Farming" icon="📱" desc="IoT driven insights for data-backed decisions." />
              <SolutionCard title="Yield Optimization" icon="📈" desc="Scientific methods to maximize your farm output." />
            </div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2e7d32", fontWeight: "600" }}>
      <CheckCircle size={20} />
      <span style={{ color: "#333" }}>{text}</span>
    </div>
  );
}

function NavCard({ title, icon, link, color }) {
  return (
    <a href={link} style={{
      textDecoration: "none",
      background: "white",
      padding: "25px 20px",
      borderRadius: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
      transition: "all 0.3s",
      borderBottom: `5px solid ${color}`
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ color: color }}>{icon}</div>
      <span style={{ fontWeight: "700", color: "#333", fontSize: "15px" }}>{title}</span>
    </a>
  );
}

function SolutionCard({ title, icon, desc }) {
  return (
    <div style={{ background: "white", padding: "40px 30px", borderRadius: "20px", textAlign: "center", boxShadow: "0 8px 25px rgba(0,0,0,0.04)" }}>
      <div style={{ fontSize: "50px", marginBottom: "20px" }}>{icon}</div>
      <h3 style={{ color: "#1b5e20", marginBottom: "15px" }}>{title}</h3>
      <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>{desc}</p>
    </div>
  );
}
