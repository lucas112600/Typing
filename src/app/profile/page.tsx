"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useConfig } from "@/context/ConfigContext";
import { fetchRealStats, StatSession } from "@/lib/statsStore";
import { fetchUserAchievements, ACHIEVEMENTS } from "@/lib/achievementStore";
import { translations } from "@/lib/i18n";
import { ArrowLeft, Calendar, Trophy, Zap, Target, History, Settings, LogOut, ChevronRight, User as UserIcon, Award } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { uiLang } = useConfig();
  const t = translations[uiLang];

  const [stats, setStats] = useState<StatSession[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      const [statsData, achData] = await Promise.all([
        fetchRealStats(user.id),
        fetchUserAchievements(user.id)
      ]);
      setStats(statsData);
      setUnlockedIds(achData);
      setLoading(false);
    };

    loadData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="notion-page" style={{ textAlign: "center", padding: "10rem" }}>Loading profile...</div>;
  }

  // Calculated Stats
  const totalSessions = stats.length;
  const bestWpm = stats.length > 0 ? Math.max(...stats.map(s => s.wpm)) : 0;
  const avgWpm = stats.length > 0 ? Math.round(stats.reduce((a, b) => a + b.wpm, 0) / stats.length) : 0;
  const avgAcc = stats.length > 0 ? Math.round(stats.reduce((a, b) => a + b.accuracy, 0) / stats.length) : 0;

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem" }}>
      
      {/* Header Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
        <button onClick={() => router.push("/")} className="app-button" style={{ width: "fit-content" }}>
          <ArrowLeft size={16} /> {t.back}
        </button>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => router.push("/settings")} className="app-button" style={{ width: "fit-content" }}>
            <Settings size={16} />
          </button>
          <button onClick={() => signOut()} className="app-button" style={{ width: "fit-content", color: "var(--foreground-danger)" }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Profile Identity Card */}
      <div style={{ 
        display: "flex", 
        gap: "2.5rem", 
        marginBottom: "4rem", 
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>
        <div style={{ 
          width: "120px", 
          height: "120px", 
          borderRadius: "24px", 
          background: "var(--surface-active)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "#2383E2",
          border: "1px solid var(--border)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
        }}>
          <UserIcon size={60} />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ color: "#2383E2", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>CHALLENGER PROFILE</div>
          <h1 className="notion-title" style={{ margin: "0 0 1rem 0" }}>{profile?.nickname || user?.email}</h1>
          <div style={{ display: "flex", gap: "2rem", color: "var(--foreground-muted)", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={16} /> Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
        <div className="app-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground-muted)", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.8rem" }}>
            <History size={14} /> SESSIONS
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{totalSessions}</div>
        </div>
        <div className="app-card" style={{ padding: "1.5rem", background: "rgba(226, 183, 20, 0.05)", border: "1px solid rgba(226, 183, 20, 0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#E2B714", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.8rem" }}>
            <Trophy size={14} /> BEST SPEED
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#E2B714" }}>{bestWpm} <span style={{ fontSize: "1rem" }}>WPM</span></div>
        </div>
        <div className="app-card" style={{ padding: "1.5rem", background: "rgba(35, 131, 226, 0.05)", border: "1px solid rgba(35, 131, 226, 0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#2383E2", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.8rem" }}>
            <Zap size={14} /> AVG SPEED
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#2383E2" }}>{avgWpm} <span style={{ fontSize: "1rem" }}>WPM</span></div>
        </div>
        <div className="app-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground-muted)", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.8rem" }}>
            <Target size={14} /> ACCURACY
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{avgAcc}%</div>
        </div>
      </div>

      {/* Achievements Gallery */}
      <h2 className="notion-h2">Achievements Gallery</h2>
      <p className="notion-p" style={{ marginBottom: "2rem" }}>Milestones and badges earned through your typing journey.</p>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
        gap: "1.5rem", 
        marginBottom: "4rem" 
      }}>
        {Object.values(ACHIEVEMENTS).map(ach => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div 
              key={ach.id} 
              style={{
                padding: "2rem 1.5rem",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                background: isUnlocked ? "linear-gradient(145deg, var(--background), var(--surface-hover))" : "transparent",
                opacity: isUnlocked ? 1 : 0.4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "1rem",
                position: "relative",
                filter: isUnlocked ? "none" : "grayscale(1)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ fontSize: "3rem" }}>{ach.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{ach.title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", lineHeight: 1.4 }}>{ach.description}</div>
              {isUnlocked && (
                <div style={{ 
                  position: "absolute", 
                  top: "10px", 
                  right: "10px", 
                  color: "#2383E2" 
                }}>
                  <Award size={18} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent History Prompt */}
      <div style={{ 
        padding: "2rem", 
        background: "var(--surface-hover)", 
        borderRadius: "16px", 
        border: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Check Detailed Progress?</h3>
          <p style={{ margin: 0, color: "var(--foreground-muted)", fontSize: "0.9rem" }}>View your chronological WPM graph and session details.</p>
        </div>
        <Link href="/stats" className="app-button primary" style={{ width: "auto" }}>
          Full Statistics <ChevronRight size={16} />
        </Link>
      </div>

    </div>
  );
}
