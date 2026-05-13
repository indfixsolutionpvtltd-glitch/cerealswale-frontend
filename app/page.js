"use client";
import React, { useState } from "react";
import { CheckCircle, ArrowRight, Package, Menu, X } from "lucide-react";

// ==================== RESPONSIVE STYLES ====================
// Mobile-first approach: base styles for mobile, enhance for larger screens

const containerStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 16px",
  boxSizing: "border-box",
};

// Navigation
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 0",
  position: "relative",
};

const logoStyle = {
  fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
  fontWeight: "800",
  color: "#333",
  textDecoration: "none",
};

const mobileMenuBtn = {
  display: "block",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  zIndex: "1001",
};

const navLinksContainer = {
  display: "none",
  flexDirection: "column",
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(255,255,255,0.98)",
  zIndex: "1000",
  justifyContent: "center",
  alignItems: "center",
  gap: "32px",
  transition: "all 0.3s ease",
};

const navLinksContainerOpen = {
  ...navLinksContainer,
  display: "flex",
};

const navLinkStyle = {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#333",
  textDecoration: "none",
  padding: "12px 24px",
  transition: "color 0.3s",
};

// Hero Section
const heroSectionStyle = {
  width: "100%",
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  padding: "60px 0",
};

const bgImageContainer = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
};

const bgImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.15,
};

const heroOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)",
  zIndex: 1,
};

const heroContentWrapper = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  maxWidth: "800px",
  padding: "0 20px",
  width: "100%",
};

const heroHeading = {
  fontSize: "clamp(2rem, 8vw, 4rem)",
  fontWeight: "900",
  lineHeight: "1.1",
  marginBottom: "20px",
  color: "#1a1a2e",
  letterSpacing: "-0.02em",
};

const heroSubheading = {
  fontSize: "clamp(1rem, 3vw, 1.25rem)",
  color: "#555",
  lineHeight: "1.6",
  marginBottom: "32px",
  maxWidth: "600px",
  margin: "0 auto 32px",
};

const heroButtons = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

const primaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#fff",
  padding: "14px 32px",
  borderRadius: "50px",
  fontSize: "1rem",
  fontWeight: "600",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.3s, box-shadow 0.3s",
  width: "100%",
  maxWidth: "280px",
  justifyContent: "center",
  minHeight: "48px",
};

const secondaryBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "transparent",
  color: "#6366f1",
  padding: "14px 32px",
  borderRadius: "50px",
  fontSize: "1rem",
  fontWeight: "600",
  textDecoration: "none",
  border: "2px solid #6366f1",
  cursor: "pointer",
  transition: "all 0.3s",
  width: "100%",
  maxWidth: "280px",
  justifyContent: "center",
  minHeight: "48px",
};

// Stats Section
const statsSectionStyle = {
  padding: "60px 0",
  background: "#f8fafc",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "24px",
  textAlign: "center",
};

const statCard = {
  padding: "24px 16px",
  background: "#fff",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const statNumber = {
  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
  fontWeight: "800",
  color: "#6366f1",
  marginBottom: "8px",
};

const statLabel = {
  fontSize: "0.9rem",
  color: "#666",
  fontWeight: "500",
};

// Features Section
const featuresSectionStyle = {
  padding: "80px 0",
};

const sectionHeader = {
  textAlign: "center",
  marginBottom: "48px",
};

const sectionTitle = {
  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
  fontWeight: "800",
  color: "#1a1a2e",
  marginBottom: "16px",
};

const sectionSubtitle = {
  fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
  color: "#666",
  maxWidth: "600px",
  margin: "0 auto",
  lineHeight: "1.6",
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px",
};

const featureCard = {
  padding: "32px 24px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  border: "1px solid #f1f5f9",
  transition: "transform 0.3s, box-shadow 0.3s",
};

const featureIcon = {
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
  color: "#fff",
};

const featureTitle = {
  fontSize: "1.25rem",
  fontWeight: "700",
  color: "#1a1a2e",
  marginBottom: "12px",
};

const featureDesc = {
  fontSize: "0.95rem",
  color: "#666",
  lineHeight: "1.6",
};

// About Section
const aboutSectionStyle = {
  padding: "80px 0",
  background: "#f8fafc",
};

const aboutGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "40px",
  alignItems: "center",
};

const aboutTextContent = {
  order: 2,
};

const aboutHeading = {
  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
  fontWeight: "800",
  marginBottom: "20px",
  color: "#1a1a2e",
  lineHeight: "1.2",
};

const aboutDescription = {
  color: "#555",
  lineHeight: "1.8",
  fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
  marginBottom: "24px",
};

const aboutImageContainer = {
  order: 1,
  width: "100%",
};

const aboutImgStyle = {
  width: "100%",
  borderRadius: "20px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
  height: "auto",
  objectFit: "cover",
};

// CTA Section
const ctaSectionStyle = {
  padding: "80px 0",
  textAlign: "center",
  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  color: "#fff",
};

const ctaHeading = {
  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
  fontWeight: "800",
  marginBottom: "20px",
  lineHeight: "1.2",
};

const ctaDescription = {
  fontSize: "clamp(1rem, 2.5vw, 1.125rem)",
  opacity: "0.9",
  maxWidth: "600px",
  margin: "0 auto 32px",
  lineHeight: "1.6",
};

const ctaButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "#fff",
  color: "#6366f1",
  padding: "16px 40px",
  borderRadius: "50px",
  fontSize: "1.1rem",
  fontWeight: "700",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.3s",
  minHeight: "48px",
};

// Footer
const footerStyle = {
  padding: "48px 0 24px",
  background: "#1a1a2e",
  color: "#fff",
};

const footerGrid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "32px",
  marginBottom: "32px",
};

const footerColumn = {
  textAlign: "center",
};

const footerTitle = {
  fontSize: "1.1rem",
  fontWeight: "700",
  marginBottom: "16px",
  color: "#fff",
};

const footerLink = {
  display: "block",
  color: "#94a3b8",
  textDecoration: "none",
  marginBottom: "10px",
  fontSize: "0.9rem",
  transition: "color 0.3s",
};

const footerBottom = {
  borderTop: "1px solid #334155",
  paddingTop: "24px",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: "0.85rem",
};

// ==================== COMPONENT ====================

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const features = [
    {
      icon: <Package size={28} />,
      title: "Fast Delivery",
      description: "Get your products delivered within 24 hours with our express shipping service.",
    },
    {
      icon: <CheckCircle size={28} />,
      title: "Quality Guaranteed",
      description: "Every product goes through rigorous quality checks before reaching you.",
    },
    {
      icon: <ArrowRight size={28} />,
      title: "Easy Returns",
      description: "Not satisfied? Return within 30 days for a full refund, no questions asked.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Products" },
    { number: "99%", label: "Satisfaction" },
    { number: "24h", label: "Delivery" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Navigation */}
      <nav style={containerStyle}>
        <div style={navStyle}>
          <a href="/" style={logoStyle}>
            BrandLogo
          </a>

          <button 
            style={mobileMenuBtn} 
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={28} color="#333" /> : <Menu size={28} color="#333" />}
          </button>

          <div style={menuOpen ? navLinksContainerOpen : navLinksContainer}>
            <a href="#features" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#about" style={navLinkStyle} onClick={() => setMenuOpen(false)}>About</a>
            <a href="#stats" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Stats</a>
            <a href="#contact" style={navLinkStyle} onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={bgImageContainer}>
          <img 
            src="/api/placeholder/1200/800" 
            alt="Hero background" 
            style={bgImageStyle}
          />
        </div>
        <div style={heroOverlay} />

        <div style={heroContentWrapper}>
          <h1 style={heroHeading}>
            Welcome to the Future of Shopping
          </h1>
          <p style={heroSubheading}>
            Discover amazing products with unbeatable prices. 
            Quality meets convenience in every purchase.
          </p>
          <div style={heroButtons}>
            <button style={primaryBtn}>
              Get Started <ArrowRight size={20} />
            </button>
            <button style={secondaryBtn}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" style={statsSectionStyle}>
        <div style={containerStyle}>
          <div style={statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} style={statCard}>
                <div style={statNumber}>{stat.number}</div>
                <div style={statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={featuresSectionStyle}>
        <div style={containerStyle}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Why Choose Us</h2>
            <p style={sectionSubtitle}>
              We provide the best shopping experience with premium features designed for you.
            </p>
          </div>

          <div style={featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} style={featureCard}>
                <div style={featureIcon}>{feature.icon}</div>
                <h3 style={featureTitle}>{feature.title}</h3>
                <p style={featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={aboutSectionStyle}>
        <div style={{ ...containerStyle, ...aboutGrid }}>
          <div style={aboutImageContainer}>
            <img 
              src="/api/placeholder/600/400" 
              alt="About us" 
              style={aboutImgStyle}
            />
          </div>
          <div style={aboutTextContent}>
            <h2 style={aboutHeading}>About Our Company</h2>
            <p style={aboutDescription}>
              We are dedicated to providing the best products and services to our customers. 
              With years of experience in the industry, we understand what you need and deliver 
              beyond expectations. Our team works tirelessly to ensure every customer gets 
              a seamless shopping experience.
            </p>
            <p style={aboutDescription}>
              From fast shipping to quality guarantees, we have got you covered. 
              Join thousands of satisfied customers who trust us for their daily needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSectionStyle}>
        <div style={containerStyle}>
          <h2 style={ctaHeading}>Ready to Get Started?</h2>
          <p style={ctaDescription}>
            Join thousands of happy customers and experience the difference today.
          </p>
          <button style={ctaButton}>
            Start Shopping <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={footerStyle}>
        <div style={containerStyle}>
          <div style={footerGrid}>
            <div style={footerColumn}>
              <h4 style={footerTitle}>Company</h4>
              <a href="#" style={footerLink}>About Us</a>
              <a href="#" style={footerLink}>Careers</a>
              <a href="#" style={footerLink}>Press</a>
            </div>
            <div style={footerColumn}>
              <h4 style={footerTitle}>Support</h4>
              <a href="#" style={footerLink}>Help Center</a>
              <a href="#" style={footerLink}>Contact Us</a>
              <a href="#" style={footerLink}>Privacy Policy</a>
            </div>
            <div style={footerColumn}>
              <h4 style={footerTitle}>Connect</h4>
              <a href="#" style={footerLink}>Twitter</a>
              <a href="#" style={footerLink}>Instagram</a>
              <a href="#" style={footerLink}>LinkedIn</a>
            </div>
          </div>
          <div style={footerBottom}>
            © 2026 BrandLogo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
