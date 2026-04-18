"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { getStats, StatSession } from "@/lib/statsStore";
import { ArrowLeft } from "lucide-react";

export default function StatsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<StatSession[]>([]);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_STATS_READY");
    setTimeout(() => {
      setSessions(getStats());
    }, 0);
  }, []);

  const dataPoints = sessions.length > 0 ? sessions.map(s => s.wpm) : [];
  const max = dataPoints.length > 0 ? Math.max(...dataPoints, 10) : 10;
  const min = dataPoints.length > 0 ? Math.min(...dataPoints, 0) : 0;
  const range = max - min === 0 ? 1 : max - min;
  
  const generatePath = () => {
    if (dataPoints.length === 0) return "";
    if (dataPoints.length === 1) return `M 0 150 L 800 150`;
    return dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * 800;
      const y = 300 - (((val - min) / range) * 200 + 50); // padding 50
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  };

  const avgWpm = sessions.length > 0 ? Math.round(sessions.reduce((a,b)=>a+b.wpm, 0) / sessions.length) : 0;
  const avgAcc = sessions.length > 0 ? Math.round(sessions.reduce((a,b)=>a+b.accuracy, 0) / sessions.length) : 0;

  return (
    <div className="notion-page animate-fade-in">
      
      <button className="app-button" onClick={() => router.push("/")} style={{ width: "fit-content", marginBottom: "2rem", color: "var(--foreground-muted)" }}>
         <ArrowLeft size={16} /> Back to Hub
      </button>

      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>📈</div>
      <h1 className="notion-title">Performance Stats</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        A detailed look at your historic typing velocity and accuracy over time.
      </p>

      {/* Basic Metric Blocks */}
      <h2 className="notion-h2">Aggregate Data</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
         <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", flex: "1 1 200px" }}>
           <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Average Words Per Minute</div>
           <div style={{ fontSize: "2rem", fontWeight: 700 }}>{avgWpm}</div>
         </div>
         <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", flex: "1 1 200px" }}>
           <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Overall Accuracy</div>
           <div style={{ fontSize: "2rem", fontWeight: 700 }}>{avgAcc}%</div>
         </div>
         <div style={{ padding: "1.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", flex: "1 1 200px" }}>
           <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Sessions Logged</div>
           <div style={{ fontSize: "2rem", fontWeight: 700 }}>{sessions.length}</div>
         </div>
      </div>

      {/* SVG Chart */}
      <h2 className="notion-h2">Chronological Progress</h2>
      <p className="notion-p">WPM plotted against practice instances.</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem", width: "100%", overflowX: "auto" }}>
         <svg width="800" height="300" viewBox="0 0 800 300" style={{ overflow: "visible", display: "block", margin: "0 auto" }}>
             
             {/* Simple Rules */}
             <line x1="0" y1="50" x2="800" y2="50" stroke="var(--border)" strokeWidth="1" />
             <line x1="0" y1="150" x2="800" y2="150" stroke="var(--border)" strokeWidth="1" />
             <line x1="0" y1="250" x2="800" y2="250" stroke="var(--border)" strokeWidth="1" />
             
             {dataPoints.length === 0 ? (
               <text x="400" y="150" textAnchor="middle" fill="var(--foreground-muted)">No practice sessions completed yet.</text>
             ) : (
               <>
                 <path d={generatePath()} fill="none" stroke="var(--foreground)" strokeWidth="2.5" />
                 {dataPoints.map((val, i) => {
                    const x = dataPoints.length === 1 ? 400 : (i / (dataPoints.length - 1)) * 800;
                    const y = 300 - (((val - min) / range) * 200 + 50);
                    return (
                      <circle key={i} cx={x} cy={y} r="4" fill="var(--background)" stroke="var(--foreground)" strokeWidth="2" />
                    )
                 })}
               </>
             )}
           </svg>
      </div>

    </div>
  );
}
