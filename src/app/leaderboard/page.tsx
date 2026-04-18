"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Trophy, Medal, Clock, Zap } from "lucide-react";

interface ScoreRecord {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  created_at: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("leaderboards")
      .select("*")
      .order("wpm", { ascending: false })
      .limit(50);
    
    if (data) {
      setLeaderboard(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to real-time updates when new scores are inserted
    const channel = supabase
      .channel("leaderboard_updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leaderboards" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 2rem" }}>
      <nav style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => router.push("/")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", color: "var(--foreground-muted)", cursor: "pointer", fontSize: "0.9rem" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Workspace</span>
        </button>
      </nav>

      <header style={{ marginBottom: "4rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "100px", background: "rgba(226, 183, 20, 0.1)", color: "#E2B714", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          <Trophy size={14} />
          <span>GLOBAL RANKINGS</span>
        </div>
        <h1 className="notion-h1" style={{ fontSize: "4rem", letterSpacing: "-0.04em", margin: "0" }}>Hall of Fame</h1>
        <p className="notion-p" style={{ fontSize: "1.2rem", opacity: 0.6 }}>The fastest typists in the digital realm.</p>
      </header>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--foreground-muted)" }}>Loading records...</div>
      ) : (
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
                <th style={{ padding: "1.2rem", textAlign: "left", width: "80px", color: "var(--foreground-muted)" }}>RANK</th>
                <th style={{ padding: "1.2rem", textAlign: "left" }}>USER</th>
                <th style={{ padding: "1.2rem", textAlign: "center" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}><Zap size={14} /> WPM</div></th>
                <th style={{ padding: "1.2rem", textAlign: "center" }}>ACCURACY</th>
                <th style={{ padding: "1.2rem", textAlign: "right", color: "var(--foreground-muted)" }}><Clock size={14} style={{ display: "inline", marginRight: "4px" }} /> DATE</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((record, index) => (
                <tr key={record.id} className="leaderboard-row" style={{ borderBottom: index === leaderboard.length - 1 ? "none" : "1px solid var(--border)", transition: "background 0.2s ease" }}>
                  <td style={{ padding: "1.2rem", fontWeight: 700 }}>
                    {index === 0 && <Medal size={20} color="#E2B714" />}
                    {index === 1 && <Medal size={20} color="#909090" />}
                    {index === 2 && <Medal size={20} color="#AD8A56" />}
                    {index > 2 && index + 1}
                  </td>
                  <td style={{ padding: "1.2rem", fontWeight: 600 }}>{record.name}</td>
                  <td style={{ padding: "1.2rem", textAlign: "center", color: "#E2B714", fontWeight: 800, fontSize: "1.1rem" }}>{record.wpm}</td>
                  <td style={{ padding: "1.2rem", textAlign: "center" }}>{record.accuracy}%</td>
                  <td style={{ padding: "1.2rem", textAlign: "right", color: "var(--foreground-muted)", fontSize: "0.85rem" }}>
                    {new Date(record.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "4rem", textAlign: "center", color: "var(--foreground-muted)" }}>No records yet. Be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx global>{`
        .leaderboard-row:hover {
          background: rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
}
