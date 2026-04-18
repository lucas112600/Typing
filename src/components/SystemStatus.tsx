"use client";

import { useEffect, useState } from "react";
import { SystemLogPubSub } from "@/lib/systemLog";

export default function SystemStatus() {
  const [log, setLog] = useState("");
  const [latency, setLatency] = useState(12);

  useEffect(() => {
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
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "12px 24px",
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "var(--foreground-muted)",
        fontSize: "0.85rem",
        fontFamily: "var(--font-outfit), sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          backgroundColor: "#10B981"
        }} />
        <span style={{ fontWeight: 500 }}>System Online</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>Latency: {latency}ms</span>
      </div>
      
      <div style={{ fontStyle: "italic", opacity: 0.8 }}>
        {log ? `Latest Action: ${log}` : "Awaiting user input..."}
      </div>
    </footer>
  );
}
