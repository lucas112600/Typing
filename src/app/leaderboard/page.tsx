"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PartySocket from "partysocket";
import { Trophy, ArrowLeft, Clock, Zap, Target } from "lucide-react";

interface ScoreRecord {
  name: string;
  wpm: number;
  accuracy: number;
  date: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to a dedicated 'global' room for high scores
    const host = process.env.NEXT_PUBLIC_PARTY_HOST || (window.location.host.includes("localhost") ? "localhost:1999" : window.location.host);
    const socket = new PartySocket({
      host,
      room: "global", // All users share this ranking room
    });

    socket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "LEADERBOARD_UPDATE") {
        setLeaderboard(data.leaderboard);
        setLoading(false);
      }
    });

    // Request leaderboard on connect
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "GET_LEADERBOARD" }));
    });

    return () => socket.close();
  }, []);

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
            fontSize: "0.9rem"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Workspace</span>
        </button>
      </nav>

      <header style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#E2B714", marginBottom: "1rem" }}>
          <Trophy size={24} />
          <span style={{ fontWeight: 600, fontSize: "1rem", letterSpacing: "0.1em" }}>HALL OF FAME</span>
        </div>
        <h1 className="notion-h1" style={{ fontSize: "3.5rem", margin: 0 }}>Global Rankings</h1>
        <p className="notion-p" style={{ opacity: 0.6 }}>The fastest typists in the solar system.</p>
      </header>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--foreground-muted)" }}>
          Synchronizing with central database...
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.8rem", color: "var(--foreground-muted)" }}>RANK</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.8rem", color: "var(--foreground-muted)" }}>NAME</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.8rem", color: "var(--foreground-muted)" }}>SPEED (WPM)</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.8rem", color: "var(--foreground-muted)" }}>ACCURACY</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.8rem", color: "var(--foreground-muted)" }}>DATE</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "4rem", textAlign: "center", color: "var(--foreground-muted)" }}>
                    No records found. Be the first to claim a spot!
                  </td>
                </tr>
              ) : (
                leaderboard.map((record, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }}>
                    <td style={{ padding: "1rem", fontWeight: 800, color: index < 3 ? "#E2B714" : "var(--foreground-muted)" }}>
                      #{index + 1}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 500 }}>{record.name}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Zap size={14} color="#E2B714" />
                        <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>{record.wpm}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground-muted)" }}>
                        <Target size={14} />
                        <span>{record.accuracy}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--foreground-muted)", fontSize: "0.8rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Clock size={12} />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <footer style={{ marginTop: "4rem", textAlign: "center", paddingBottom: "4rem" }}>
        <button 
          className="app-button primary" 
          onClick={() => router.push("/pvp")}
          style={{ padding: "0.75rem 2rem" }}
        >
          Compete Now
        </button>
      </footer>
    </div>
  );
}
