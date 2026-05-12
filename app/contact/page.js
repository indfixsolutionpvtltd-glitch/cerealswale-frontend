"use client";
export default function Contact() {
  return (
    <div style={{ padding: "60px 20px", background: "#f4fff2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", background: "white", borderRadius: "15px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <div style={{ padding: "40px", background: "#1b5e20", color: "white" }}>
          <h2>Get In Touch</h2>
          <p>📧 Email: support@cerealswale.com</p>
          <p>📞 Phone: +91-2231430562</p>
          <p>📍 Office: Juhi Niharika Mirage, Kharghar Sector 10, Navi Mumbai 410210</p>
          <hr style={{ margin: "30px 0" }} />
          <h3>CATALYST SERVICE PRIVATE LIMITED</h3>
        </div>
        <div style={{ padding: "40px" }}>
          <input type="text" placeholder="Your Name" style={{ width: "100%", padding: "12px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "5px" }} />
          <input type="email" placeholder="Your Email" style={{ width: "100%", padding: "12px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "5px" }} />
          <textarea placeholder="Message" rows="5" style={{ width: "100%", padding: "12px", marginBottom: "20px", border: "1px solid #ddd", borderRadius: "5px" }}></textarea>
          <button style={{ width: "100%", padding: "15px", background: "#43a047", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>Send Message</button>
        </div>
      </div>
    </div>
  );
}
