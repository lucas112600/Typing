"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { getStats, StatSession } from "@/lib/statsStore";
import { ArrowLeft, Activity, Target, Hash } from "lucide-react";

export default function StatsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<StatSession[]>([]);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_STATS_READY");
    setTimeout(() => {
      setSessions(getStats());
    }, 0);
  }, []);

  const dataPoints = sessions.length > 0 ? sessions.map(s => s.wpm) : [0];
  const max = Math.max(...dataPoints, 10);
  const min = Math.min(...dataPoints, 0);
  const range = max - min === 0 ? 1 : max - min;
  
  const generatePath = () => {
    if (dataPoints.length === 1) return `M 0 150 L 800 150`;
    return dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * 800;
      const y = 300 - (((val - min) / range) * 200 + 50); // padding 50
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  };

  const generateArea = () => {
     const path = generatePath();
     return `${path} L 800 300 L 0 300 Z`;
  };

  const avgWpm = sessions.length > 0 ? Math.round(sessions.reduce((a,b)=>a+b.wpm, 0) / sessions.length) : 0;
  const avgAcc = sessions.length > 0 ? Math.round(sessions.reduce((a,b)=>a+b.accuracy, 0) / sessions.length) : 0;

  return (
    <div style={{ padding: "4rem 2rem", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      
      <header className="animate-fade-in stagger-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity color="var(--accent-primary)" /> Performance Metrics
          </h1>
          <p style={{ color: "var(--foreground-muted)" }}>Historic typing data and learning curvature.</p>
        </div>
        <button className="app-button" style={{ padding: "0.5rem 1.5rem" }} onClick={() => router.push("/")}>
          <ArrowLeft size={16} /> Dashboard
        </button>
      </header>

      <div className="animate-fade-in stagger-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="app-card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "var(--ring)", borderRadius: "12px", color: "var(--accent-primary)" }}>
            <Activity size={32} />
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>Average WPM</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>{avgWpm}</div>
          </div>
        </div>
        <div className="app-card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", color: "var(--accent-secondary)" }}>
             <Target size={32} />
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>Accuracy Rate</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>{avgAcc}%</div>
          </div>
        </div>
        <div className="app-card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "var(--surface-hover)", borderRadius: "12px", color: "var(--foreground-muted)" }}>
             <Hash size={32} />
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", fontWeight: 500, marginBottom: "0.25rem" }}>Total Sessions</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>{sessions.length}</div>
          </div>
        </div>
      </div>

      <div className="app-card animate-fade-in stagger-3" style={{ flex: 1, position: "relative", padding: "2.5rem", minHeight: "400px" }}>
         <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "2rem" }}>
            Speed Progression Curve
         </h2>
         <div style={{ width: "100%", overflowX: "auto" }}>
           <svg width="800" height="300" viewBox="0 0 800 300" style={{ overflow: "visible", display: "block", margin: "0 auto" }}>
             <defs>
               <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.2" />
                 <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
               </linearGradient>
             </defs>
             {/* Grid */}
             <line x1="0" y1="50" x2="800" y2="50" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="0" y1="150" x2="800" y2="150" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="0" y1="250" x2="800" y2="250" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
             
             {/* Area Fill */}
             <path d={generateArea()} fill="url(#areaGradient)" />
             
             {/* Data Line */}
             <path d={generatePath()} fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
             
             {/* Points */}
             {dataPoints.map((val, i) => {
                const x = dataPoints.length === 1 ? 400 : (i / (dataPoints.length - 1)) * 800;
                const y = 300 - (((val - min) / range) * 200 + 50);
                return (
                  <circle key={i} cx={x} cy={y} r="5" fill="var(--surface)" stroke="var(--accent-primary)" strokeWidth="2" />
                )
             })}
           </svg>
         </div>
      </div>
      
      {/* Spacer */}
      <div style={{ height: "80px" }} />
    </div>
  );
}
