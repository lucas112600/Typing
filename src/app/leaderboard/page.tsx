"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useConfig } from "@/context/ConfigContext";
import { translations } from "@/lib/i18n";
import { ArrowLeft, Trophy, Medal, Clock, Zap, Calendar, Users } from "lucide-react";

export const dynamic = "force-dynamic";

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
  const [activeTab, setActiveTab] = useState<"ALL" | "DAILY">("ALL");
  const router = useRouter();
  const { uiLang } = useConfig();
  const t = translations[uiLang];

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("leaderboards")
      .select("*")
      .order("wpm", { ascending: false })
      .limit(50);
    
    if (activeTab === "DAILY") {
      // Filter for entries that start with [DAILY]
      query = query.like("name", "[DAILY]%");
      
      // Also strictly filter for today's date if possible
      const today = new Date().toISOString().split("T")[0];
      query = query.gte("created_at", today);
    }

    const { data } = await query;
    
    if (data) {
      setLeaderboard(data);
    } else {
      setLeaderboard([]);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    const loadData = async () => {
      await fetchLeaderboard();
    };
    loadData();

    // Subscribe to real-time updates
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
  }, [fetchLeaderboard]);

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem" }}>
      <nav style={{ marginBottom: "2rem" }}>
        <button 
          onClick={() => router.push("/")}
          className="app-button"
          style={{ width: "fit-content", color: "var(--foreground-muted)" }}
        >
          <ArrowLeft size={16} />
          <span>{t.back_to_hub}</span>
        </button>
      </nav>

      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "100px", background: "rgba(226, 183, 20, 0.1)", color: "#E2B714", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1.5rem" }}>
          <Trophy size={14} />
          <span>{t.fame_btn.toUpperCase()}</span>
        </div>
        <h1 className="notion-h1" style={{ fontSize: "3.5rem", letterSpacing: "-0.04em", margin: "0" }}>
          {activeTab === "ALL" ? t.fame_btn : t.daily_ranking}
        </h1>
      </header>

      {/* Tab Switcher */}
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "2rem", 
        padding: "4px", 
        background: "var(--surface-hover)", 
        borderRadius: "12px",
        width: "fit-content",
        margin: "0 auto 3rem auto"
      }}>
         <button 
            onClick={() => setActiveTab("ALL")}
            style={{ 
              padding: "0.6rem 1.5rem", 
              borderRadius: "10px", 
              border: "none", 
              background: activeTab === "ALL" ? "var(--bg-secondary)" : "transparent",
              color: activeTab === "ALL" ? "var(--foreground)" : "var(--foreground-muted)",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: activeTab === "ALL" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
         >
            <Users size={16} />
            {t.fame_btn}
         </button>
         <button 
            onClick={() => setActiveTab("DAILY")}
            style={{ 
              padding: "0.6rem 1.5rem", 
              borderRadius: "10px", 
              border: "none", 
              background: activeTab === "DAILY" ? "var(--bg-secondary)" : "transparent",
              color: activeTab === "DAILY" ? "var(--foreground)" : "var(--foreground-muted)",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: activeTab === "DAILY" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
         >
            <Calendar size={16} />
            {t.daily_challenge}
         </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--foreground-muted)" }}>{t.generating}</div>
      ) : (
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
                <th style={{ padding: "1.2rem", textAlign: "left", width: "80px", color: "var(--foreground-muted)" }}>RANK</th>
                <th style={{ padding: "1.2rem", textAlign: "left" }}>USER</th>
                <th style={{ padding: "1.2rem", textAlign: "center" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}><Zap size={14} /> WPM</div></th>
                <th style={{ padding: "1.2rem", textAlign: "center" }}>{t.accuracy.split(" ")[0]}</th>
                <th style={{ padding: "1.2rem", textAlign: "right", color: "var(--foreground-muted)" }}><Clock size={14} style={{ display: "inline", marginRight: "4px" }} /> DATE</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((record, index) => {
                const displayName = record.name.startsWith("[DAILY] ") ? record.name.replace("[DAILY] ", "") : record.name;
                return (
                  <tr key={record.id} className="leaderboard-row" style={{ borderBottom: index === leaderboard.length - 1 ? "none" : "1px solid var(--border)", transition: "background 0.2s ease" }}>
                    <td style={{ padding: "1.2rem", fontWeight: 700 }}>
                      {index === 0 && <Medal size={20} color="#E2B714" />}
                      {index === 1 && <Medal size={20} color="#909090" />}
                      {index === 2 && <Medal size={20} color="#AD8A56" />}
                      {index > 2 && index + 1}
                    </td>
                    <td style={{ padding: "1.2rem", fontWeight: 600 }}>
                       <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {displayName}
                          {record.name.startsWith("[DAILY] ") && (
                             <span style={{ fontSize: "0.6rem", background: "rgba(35, 131, 226, 0.1)", color: "#2383E2", padding: "1px 6px", borderRadius: "4px" }}>{t.daily_badge}</span>
                          )}
                       </div>
                    </td>
                    <td style={{ padding: "1.2rem", textAlign: "center", color: "#E2B714", fontWeight: 800, fontSize: "1.1rem" }}>{record.wpm}</td>
                    <td style={{ padding: "1.2rem", textAlign: "center" }}>{record.accuracy}%</td>
                    <td style={{ padding: "1.2rem", textAlign: "right", color: "var(--foreground-muted)", fontSize: "0.85rem" }}>
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
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
