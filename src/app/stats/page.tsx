"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";

export default function StatsPage() {
  const router = useRouter();

  useEffect(() => {
    SystemLogPubSub.publish("SYS_STATS_READY");
  }, []);

  const dataPoints = [40, 45, 42, 50, 55, 58, 62, 60, 65, 70, 72, 75];
  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints);
  const range = max - min;
  
  const generatePath = () => {
    return dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * 800;
      const y = 300 - (((val - min) / range) * 200 + 50); // padding 50
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  };

  return (
    <div style={{ padding: "4rem", height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="animate-step-in stagger-1" style={{ fontSize: "2rem", fontWeight: 900, borderBottom: "2px solid var(--foreground)", paddingBottom: "1rem", marginBottom: "2rem" }}>
        [ SYSTEM_METRICS ]
      </div>

      <div className="animate-step-in stagger-2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "4rem" }}>
        <div style={{ border: "1px solid var(--foreground)", padding: "2rem" }}>
          <div style={{ fontSize: "0.8rem", letterSpacing: "2px", opacity: 0.8 }}>WPM / CPM</div>
          <div style={{ fontSize: "4rem", fontWeight: 900 }}>75</div>
        </div>
        <div style={{ border: "1px solid var(--foreground)", padding: "2rem" }}>
          <div style={{ fontSize: "0.8rem", letterSpacing: "2px", opacity: 0.8 }}>ACCURACY</div>
          <div style={{ fontSize: "4rem", fontWeight: 900 }}>98%</div>
        </div>
        <div style={{ border: "1px solid var(--foreground)", padding: "2rem" }}>
          <div style={{ fontSize: "0.8rem", letterSpacing: "2px", opacity: 0.8 }}>STABILITY</div>
          <div style={{ fontSize: "4rem", fontWeight: 900 }}>A+</div>
        </div>
      </div>

      <div className="animate-step-in stagger-3" style={{ flex: 1, border: "1px solid var(--foreground)", position: "relative", padding: "1rem" }}>
         <div style={{ position: "absolute", top: "1rem", left: "1rem", fontSize: "0.8rem", letterSpacing: "2px" }}>
            PERFORMANCE_CURVE
         </div>
         <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <svg width="800" height="300" viewBox="0 0 800 300" style={{ overflow: "visible" }}>
             {/* Grid */}
             <line x1="0" y1="50" x2="800" y2="50" stroke="var(--foreground)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="0" y1="150" x2="800" y2="150" stroke="var(--foreground)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
             <line x1="0" y1="250" x2="800" y2="250" stroke="var(--foreground)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="4 4" />
             
             {/* Data Line */}
             <path d={generatePath()} fill="none" stroke="var(--foreground)" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter" />
             
             {/* Points */}
             {dataPoints.map((val, i) => {
                const x = (i / (dataPoints.length - 1)) * 800;
                const y = 300 - (((val - min) / range) * 200 + 50);
                return (
                  <rect key={i} x={x - 4} y={y - 4} width="8" height="8" fill="var(--background)" stroke="var(--foreground)" strokeWidth="2" />
                )
             })}
           </svg>
         </div>
      </div>

      <div className="animate-step-in stagger-4" style={{ marginTop: "2rem", opacity: 0.5 }}>
        <button className="brutal-invert" style={{ padding: "0.5rem 1rem", border: "1px solid var(--foreground)" }} onClick={() => router.push("/")}>
          ← BACK
        </button>
      </div>
    </div>
  );
}
