"use client";
import React, { useState } from "react";
import { 
  LayoutDashboard, Building2, Globe2, Lightbulb, Briefcase, Mail, 
  ChevronDown, User, LogIn, CheckCircle, ArrowRight, TrendingUp, Package
} from "lucide-react";

export default function Home() {
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

  // Background Image Path
  const heroBackground = "/web%20site%20stock%20photo.jpg"; 

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif", background: "#fff", margin: 0 }}>
      
      {/* --- TOP HEADER (Column 1) - FIXED: No Repetition --- */}
      <nav style={topHeaderStyle}>
        <div style={containerStyle}>
          <div style={headerContent}>
            <div style={logoArea}>
              <img src="/logo.png" alt="Catalyst CerealsWale" style={{ height: "40px" }} />
              <span style={brandName}>CEREALSWALE</span>
            </div>
            <div style={topNavLinks}>
              <a href="/" style={topLink}>Home</a>
              <a href="/login" style={topLink}><LogIn size={16} /> Login</a>
              <a href="/register" style={topLink}><User size={16} /> Register</a>
              <a href="/admin" style={adminBtnStyle}>Admin</a>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN NAVIGATION (Column 2) --- */}
      <nav style={mainNavStyle}>
        <div style={containerStyle}>
          <div style={mainLinks}>
            <a href="/dashboard" style={mainLink}>Dashboard</a>
            <a href="/company" style={mainLink}>Company</a>
            
            {/* Solutions Dropdown */}
            <div 
              style={{ position: "relative" }} 
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button style={mainLink}>
                Solutions <ChevronDown size={14} style={{ marginLeft: "4px" }} />
              </button>
              {isSolutionsOpen && (
                <div style={dropdownStyle}>
                  <a href="/solutions/farmers" style={dropdownItem}>Solution For Farmers</a>
                  <a href="/solutions/entrepreneurs" style={dropdownItem}>Solution For Micro-Entrepreneur</a>
                  <a href="/solutions/institutional" style={dropdownItem}>Solution For Institutional-Buyers</a>
                </div>
              )}
            </div>

            <a href="/network" style={mainLink}>Network</a>
            <a href="/careers" style={mainLink}>Careers</a>
            <a href="/contact" style={mainLink}>Contact Us</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{
        ...heroSectionStyle,
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.2) 100%), url(${heroBackground})`,
      }}>
        <div style={containerStyle}>
          <h1 style={heroHeading}>Modern Tech for <br/><span style={{ color: "#81c784" }}>Sustainable Agriculture</span></h1>
          <p style={heroSubheading}>
            Building a trusted ecosystem for Farmers, Entrepreneurs, and Institutional Buyers through innovation and data science.
          </p>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <a href="/products" style={primaryBtn}>Explore Products <ArrowRight size={18}/></a>
            <a href="/solutions/farmers" style={secondaryBtn}>Digital Solutions</a>
          </div>
        </div>
      </section>

      {/* --- QUICK STATS --- */}
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
      <section style={{ padding: "80px 0" }}>
        <div style={containerStyle}>
          <div style={grid2Style}>
            <div>
              <h2 style={sectionHeading}>Empowering Rural <span style={{ color: "#2e7d32" }}>India</span></h2>
              <p style={textStyle}>
                CerealsWale (CATALYST SERVICE PRIVATE LIMITED) is more than just an agri-tech company. 
                We are a movement dedicated to revolutionizing the agricultural landscape of India through the 5 A’s: 
                <b> Access, Affordable Insurance, Affordable Credit, Actionable Advisory, and Profitable Markets.</b>
              </p>
              <div style={{ marginTop: "20px" }}>
                <FeatureItem text="Trustworthy Enterprise-Grade Interface" />
                <FeatureItem text="Indian Agriculture-Focused Solutions" />
                <FeatureItem text="Seamless Supply Chain Management" />
              </div>
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

      {/* --- FOOTER --- */}
      <footer style={footerStyle}>
        <div style={containerStyle}>
          <div style={grid4Style}>
            <div>
              <h4 style={{ color: "#81c784" }}>CerealsWale</h4>
              <p style={{ fontSize: "14px", opacity: 0.8 }}>Revolutionizing Indian Agriculture through technology and empathy.</p>
            </div>
            <div>
              <h4 style={footerTitle}>Solutions</h4>
              <a href="/solutions/farmers" style={footerLink}>For Farmers</a><br/>
              <a href="/solutions/entrepreneurs" style={footerLink}>For Entrepreneurs</a><br/>
              <a href="/solutions/institutional" style={footerLink}>For Buyers</a>
            </div>
            <div>
              <h4 style={footerTitle}>Quick Links</h4>
              <a href="/dashboard" style={footerLink}>Dashboard</a><br/>
              <a href="/careers" style={footerLink}>Careers</a><br/>
              <a href="/contact" style={footerLink}>Franchise Inquiry</a>
            </div>
            <div>
              <h4 style={footerTitle}>Contact</h4>
              <p style={{ fontSize: "14px", opacity: 0.8 }}>Navi Mumbai, India</p>
              <p style={{ fontSize: "14px", opacity: 0.8 }}>Email: support@cerealswale.com</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "40px", paddingTop: "20px", textAlign: "center", fontSize: "12px", opacity: 0.6 }}>
            © 2026 CATALYST SERVICE PRIVATE LIMITED. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- COMPONENTS ---
function FeatureItem({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#2e7d32", fontWeight: "600" }}>
      <CheckCircle size={20} />
      <span style={{ color: "#444" }}>{text}</span>
    </div>
  );
}

function StatCard({ count, label }) {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3 style={{ fontSize: "32px", color: "#1b5e20", margin: "0" }}>{count}</h3>
      <p style={{ margin: "5px 0 0", color: "#666", fontSize: "14px", fontWeight: "600" }}>{label}</p>
    </div>
  );
}

// --- STYLES ---
const containerStyle = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };
const headerContent = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const topHeaderStyle = { background: "#fff", borderBottom: "1px solid #eee", padding: "12px 0" };
const logoArea = { display: "flex", alignItems: "center", gap: "10px" };
const brandName = { fontWeight: "900", fontSize: "22px", color: "#1b5e20", letterSpacing: "1px" };
const topNavLinks = { display: "flex", alignItems: "center", gap: "25px" };
const topLink = { textDecoration: "none", color: "#444", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" };
const adminBtnStyle = { textDecoration: "none", color: "#d32f2f", border: "1px solid #d32f2f", padding: "5px 15px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold" };

const mainNavStyle = { background: "#f8fdf9", borderBottom: "2px solid #e8f5e9", padding: "18px 0" };
const mainLinks = { display: "flex", gap: "35px", alignItems: "center" };
const mainLink = { background: "none", border: "none", textDecoration: "none", color: "#333", fontWeight: "700", fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center" };

const dropdownStyle = { position: "absolute", top: "100%", left: 0, background: "white", boxShadow: "0 10px 40px rgba(0,0,0,0.12)", borderRadius: "12px", width: "280px", padding: "12px", zIndex: 1000, marginTop: "10px", border: "1px solid #eee" };
const dropdownItem = { display: "block", padding: "12px 15px", textDecoration: "none", color: "#333", fontSize: "14px", fontWeight: "600", borderRadius: "8px", transition: "0.2s" };

const heroSectionStyle = { minHeight: "80vh", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", color: "white" };
const heroHeading = { fontSize: "clamp(36px, 6vw, 65px)", fontWeight: "800", lineHeight: "1.1", marginBottom: "20px" };
const heroSubheading = { fontSize: "clamp(18px, 2vw, 22px)", maxWidth: "700px", marginBottom: "40px", opacity: 0.9, lineHeight: "1.6" };

const primaryBtn = { padding: "18px 35px", background: "#2e7d32", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" };
const secondaryBtn = { padding: "18px 35px", border: "2px solid white", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", backdropFilter: "blur(5px)" };

const statsSectionStyle = { background: "#fff", padding: "50px 0", borderBottom: "1px solid #eee" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "25px" };

const grid2Style = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" };
const grid4Style = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" };
const sectionHeading = { fontSize: "42px", fontWeight: "800", marginBottom: "25px", color: "#333" };
const textStyle = { color: "#555", lineHeight: "1.8", fontSize: "17px" };
const aboutImgStyle = { width: "100%", borderRadius: "30px", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" };

const footerStyle = { background: "#1b5e20", color: "white", padding: "80px 0 30px" };
const footerTitle = { fontSize: "18px", fontWeight: "700", marginBottom: "20px" };
const footerLink = { color: "white", opacity: 0.8, textDecoration: "none", fontSize: "14px", lineHeight: "2.8", fontWeight: "500" };
