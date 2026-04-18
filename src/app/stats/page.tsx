"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { getStats, StatSession } from "@/lib/statsStore";

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
    <div style={{ padding: "4rem", height: "100%", display: "flex", flexDirection: "column", zIndex: 10, position: "relative" }}>
      <div className="glass-panel animate-step-in stagger-1" style={{ padding: "1rem 2rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="text-gradient-primary" style={{ fontSize: "1.8rem", fontWeight: 800 }}>
          SYSTEM_METRICS
        </div>
        <button className="glass-button" style={{ padding: "0.5rem 1.5rem" }} onClick={() => router.push("/")}>
          ← RETURN HOME
        </button>
      </div>

      <div className="animate-step-in stagger-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
          <div className="text-gradient" style={{ fontSize: "0.9rem", letterSpacing: "2px", opacity: 0.8, marginBottom: "0.5rem" }}>AVG_WPM / CPM</div>
          <div className="text-gradient-primary" style={{ fontSize: "4rem", fontWeight: 800 }}>{avgWpm}</div>
        </div>
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
          <div className="text-gradient" style={{ fontSize: "0.9rem", letterSpacing: "2px", opacity: 0.8, marginBottom: "0.5rem" }}>AVG_ACCURACY</div>
          <div style={{ fontSize: "4rem", fontWeight: 800, color: "var(--accent-secondary)" }}>{avgAcc}%</div>
        </div>
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
          <div className="text-gradient" style={{ fontSize: "0.9rem", letterSpacing: "2px", opacity: 0.8, marginBottom: "0.5rem" }}>SESSION_COUNT</div>
          <div style={{ fontSize: "4rem", fontWeight: 800, color: "var(--foreground)" }}>{sessions.length}</div>
        </div>
      </div>

      <div className="glass-panel animate-step-in stagger-3" style={{ flex: 1, position: "relative", padding: "1rem" }}>
         <div className="text-gradient" style={{ position: "absolute", top: "1.5rem", left: "2rem", fontSize: "0.9rem", letterSpacing: "2px" }}>
            PERFORMANCE_CURVE (WPM)
         </div>
         <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1rem" }}>
           <svg width="800" height="300" viewBox="0 0 800 300" style={{ overflow: "visible" }}>
             <defs>
               <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
                 <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
               </linearGradient>
               <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                     <feMergeNode in="coloredBlur"/>
                     <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
             </defs>
             {/* Grid */}
             <line x1="0" y1="50" x2="800" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="0" y1="250" x2="800" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
             
             {/* Area Fill */}
             <path d={generateArea()} fill="url(#areaGradient)" />
             
             {/* Data Line */}
             <path d={generatePath()} fill="none" stroke="var(--accent-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
             
             {/* Points */}
             {dataPoints.map((val, i) => {
                const x = dataPoints.length === 1 ? 400 : (i / (dataPoints.length - 1)) * 800;
                const y = 300 - (((val - min) / range) * 200 + 50);
                return (
                  <circle key={i} cx={x} cy={y} r="6" fill="var(--background-start)" stroke="var(--accent-secondary)" strokeWidth="3" filter="url(#glow)" />
                )
             })}
           </svg>
         </div>
      </div>
    </div>
  );
}
