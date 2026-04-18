"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoveRight, Users, Hash, ArrowLeft } from "lucide-react";

export default function PvPLobby() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/pvp/room/${roomId.trim().toLowerCase()}`);
    }
  };

  const handleCreateRandom = () => {
    const randomId = Math.random().toString(36).substring(2, 7);
    router.push(`/pvp/room/${randomId}`);
  };

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
      <nav style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => router.push("/")}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            background: "none", 
            border: "none", 
            color: "var(--foreground-muted)", 
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: "0.5rem 0"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Workspace</span>
        </button>
      </nav>
      <header style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>
          <Users size={16} />
          <span>Multiplayer Arena</span>
        </div>
        <h1 className="notion-h1" style={{ fontSize: "3.5rem", letterSpacing: "-0.04em", margin: "0" }}>PvP Rancing</h1>
        <p className="notion-p" style={{ fontSize: "1.2rem", opacity: 0.6 }}>Race against friends in real-time. Speed is power.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Create Card */}
        <div 
          onClick={handleCreateRandom}
          className="hover-card"
          style={{
            padding: "2rem",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ marginBottom: "2rem", color: "#2383E2" }}>
            <MoveRight size={32} />
          </div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>Create Quick Room</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--foreground-muted)" }}>Start a new room and invite others with a link.</p>
        </div>

        {/* Join Card */}
        <div 
          style={{
            padding: "2rem",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          }}
        >
          <div style={{ marginBottom: "2rem", color: "var(--foreground-muted)" }}>
            <Hash size={32} />
          </div>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>Join by ID</h3>
          <form onSubmit={handleJoin} style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              placeholder="Room Code"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                flex: 1,
                color: "var(--foreground)",
                outline: "none"
              }}
            />
            <button 
              type="submit"
              className="app-button primary"
              style={{ padding: "0.5rem 1.25rem" }}
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .hover-card:hover {
          background: var(--bg-hover);
          transform: translateY(-2px);
          border-color: var(--foreground-muted) !important;
        }
      `}</style>
    </div>
  );
}
