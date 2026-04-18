"use client";

import { useRouter } from "next/navigation";

export default function SystemStatus() {
  const router = useRouter();

  return (
    <div style={{
      position: "fixed",
      bottom: "1rem",
      right: "1.5rem",
      zIndex: 999
    }}>
      <button 
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "0.4rem 0.75rem",
          borderRadius: "var(--radius)",
          fontSize: "0.85rem",
          color: "var(--foreground-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
        onClick={() => router.push("/status")}
      >
         <div style={{ width: "6px", height: "6px", backgroundColor: "#10B981", borderRadius: "50%" }} />
         System Operational
      </button>
    </div>
  );
}
