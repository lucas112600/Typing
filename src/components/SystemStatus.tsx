"use client";

import { useEffect, useState } from "react";
import { SystemLogPubSub } from "@/lib/systemLog";

export default function SystemStatus() {
  const [log, setLog] = useState("");
  const [latency, setLatency] = useState(12);

  useEffect(() => {
    // Fake latency fluctuation for cool effect
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 20) + 5);
    }, 5000);

    const unsubscribe = SystemLogPubSub.subscribe(setLog);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "8px 24px",
        backgroundColor: "rgba(11, 15, 25, 0.8)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "var(--foreground-muted)",
        fontSize: "0.75rem",
        fontFamily: "var(--font-mono), monospace",
        textTransform: "uppercase",
        letterSpacing: "2px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          backgroundColor: "#10B981",
          boxShadow: "0 0 10px #10B981",
          animation: "pulse 2s infinite"
        }} />
        <span>SYSTEM_ONLINE</span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>LATENCY: {latency}ms</span>
      </div>
      
      <div style={{ opacity: 0.5 }}>
        LATEST_EVENT: {log || "AWAITING_INPUT"}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.5; box-shadow: 0 0 5px #10B981; }
          50% { opacity: 1; box-shadow: 0 0 15px #10B981; }
          100% { opacity: 0.5; box-shadow: 0 0 5px #10B981; }
        }
      `}} />
    </div>
  );
}
