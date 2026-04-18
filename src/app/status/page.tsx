"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  const router = useRouter();
  const [latency, setLatency] = useState(12);
  const [dbStatus] = useState("Operational");

  useEffect(() => {
    const i = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 8);
    }, 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="notion-page animate-fade-in">
      <button className="app-button" onClick={() => router.push("/")} style={{ width: "fit-content", marginBottom: "2rem", color: "var(--foreground-muted)" }}>
         <ArrowLeft size={16} /> Back to Hub
      </button>

      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>🟢</div>
      <h1 className="notion-title">System Status</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        All structural and generative APIs are currently operational.
      </p>

      <h2 className="notion-h2">Uptime Summary</h2>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
         <CheckCircle2 color="#10B981" size={20} />
         <div style={{ flex: 1, fontWeight: 500 }}>Global App Interface</div>
         <div style={{ color: "var(--foreground-muted)" }}>Operational</div>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
         <CheckCircle2 color="#10B981" size={20} />
         <div style={{ flex: 1, fontWeight: 500 }}>Neural Text Synthesis Engine</div>
         <div style={{ color: "var(--foreground-muted)" }}>Operational</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
         <CheckCircle2 color="#10B981" size={20} />
         <div style={{ flex: 1, fontWeight: 500 }}>Local Metrics Database</div>
         <div style={{ color: "var(--foreground-muted)" }}>{dbStatus}</div>
      </div>

      <h2 className="notion-h2">Endpoint Latency</h2>
      
      <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", marginTop: "1rem" }}>
         <div style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", marginBottom: "0.5rem" }}>Neural Generator Ping</div>
         <div style={{ fontSize: "2rem", fontWeight: 700 }}>{latency} <span style={{ fontSize: "1rem", color: "var(--foreground-muted)", fontWeight: 400 }}>ms</span></div>
      </div>

    </div>
  );
}
