"use client";
export default function Careers() {
  const jobs = [
    { title: "Agricultural Research Analyst", type: "Full-time", loc: "Navi Mumbai" },
    { title: "Sales & Marketing Head", type: "Field", loc: "Maharashtra" },
    { title: "Customer Success (Agri-Support)", type: "Remote", loc: "India" }
  ];

  return (
    <div style={{ padding: "40px 10%", background: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center", color: "#1b5e20" }}>Grow Your Career With Us</h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "40px" }}>Be a part of CATALYST SERVICE PRIVATE LIMITED and change the future of farming.</p>

      <div style={{ display: "grid", gap: "20px" }}>
        {jobs.map((job, i) => (
          <div key={i} style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: "0", color: "#333" }}>{job.title}</h3>
              <p style={{ margin: "5px 0", color: "#888" }}>{job.loc} | {job.type}</p>
            </div>
            <button style={{ padding: "10px 25px", background: "#2e7d32", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer" }}>Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}
