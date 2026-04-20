"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { useConfig } from "@/context/ConfigContext";
import { translations } from "@/lib/i18n";
import { generateText, getDailyChallenge, Difficulty } from "@/lib/generator";
import { useAuth } from "@/context/AuthContext";
import { Zap, BookOpen, Settings, BarChart2, ChevronRight, FileText, Users, Trophy, Calendar, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { fetchUserAchievements, ACHIEVEMENTS } from "@/lib/achievementStore";

export default function HomeInteraction() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const { uiLang, setUiLang } = useConfig();
  const t = translations[uiLang];
  
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [generating, setGenerating] = useState(false);
  const [customWordCount, setCustomWordCount] = useState(300);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_READY");
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (user) {
        const data = await fetchUserAchievements(user.id);
        if (active) setUnlockedBadges(data);
      } else {
        if (active) setUnlockedBadges([]);
      }
    };
    load();
    return () => { active = false; };
  }, [user]);

  // Sync UI language with target language for "Adaptive" feel
  const handleLangChange = (newLang: "en" | "zh") => {
    setLang(newLang);
    setUiLang(newLang);
  };

  const handleStart = (difficulty?: Difficulty, timeLimit?: number, isDaily: boolean = false) => {
    if (generating) return;
    setGenerating(true);
    SystemLogPubSub.publish("GENERATING_NEURAL_TEXT...");

    setTimeout(() => {
      let practiceData;
      
      if (isDaily) {
        practiceData = getDailyChallenge(lang);
      } else {
        let finalDiff: Difficulty = difficulty || "EASY";
        
        // Timer Scaling Logic
        if (difficulty === "TIMED" && timeLimit) {
          finalDiff = timeLimit * 3;
        } else if (!difficulty) {
           const diffLevels: ("EASY" | "NORMAL" | "HARD")[] = ["EASY", "NORMAL", "HARD"];
           finalDiff = diffLevels[Math.floor(Math.random() * diffLevels.length)];
        }
        
        practiceData = generateText(lang, finalDiff);
      }
      
      sessionStorage.setItem("typing_practice_data", JSON.stringify({
        ...practiceData,
        language: lang,
        timeLimit: timeLimit || 0,
        mode: isDaily ? "daily" : "practice"
      }));
      SystemLogPubSub.publish("INITIATE_PRACTICE");
      router.push("/practice");
    }, 400);
  };

  const handleStartDaily = () => handleStart(undefined, undefined, true);

  return (
    <div className="notion-page animate-fade-in">
      
      {/* Auth Status / Identity Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "3rem",
        padding: "1rem",
        background: "var(--surface-hover)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "50%", 
            background: "var(--surface-active)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "#2383E2"
          }}>
            <UserIcon size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)", fontWeight: 600 }}>IDENTITY</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                {user ? (profile?.nickname || user.email) : "Guest Explorer"}
              </div>
              
              {/* Badges Display */}
              <div style={{ display: "flex", gap: "0.2rem" }}>
                {unlockedBadges.map(id => (
                  <span 
                    key={id} 
                    title={ACHIEVEMENTS[id]?.title} 
                    style={{ 
                      fontSize: "1rem", 
                      cursor: "help",
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      transform: "translateY(-1px)"
                    }}
                  >
                    {ACHIEVEMENTS[id]?.icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {user ? (
          <button onClick={() => signOut()} className="app-button" style={{ width: "auto", color: "var(--foreground-danger)" }}>
            <LogOut size={16} /> Logout
          </button>
        ) : (
          <button onClick={() => router.push("/auth/login")} className="app-button primary" style={{ width: "auto", padding: "0.5rem 1.2rem" }}>
            <LogIn size={16} /> Login
          </button>
        )}
      </div>

      {/* Cover Icon / Title */}
      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>⌨️</div>
      <h1 className="notion-title">{t.hub_title}</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        {t.hub_desc}
      </p>

      {/* Pages Navigation */}
      <h2 className="notion-h2">{t.pages_title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%" }}>
        <button className="app-button" onClick={() => router.push("/docs")}>
          <FileText size={18} color="var(--foreground-muted)" />
          <span>{t.doc_btn}</span>
        </button>
        <button className="app-button" onClick={() => router.push("/explore")}>
          <BookOpen size={18} color="var(--foreground-muted)" />
          <span>{t.explore_btn}</span>
        </button>
        <button className="app-button" onClick={() => router.push("/pvp")} style={{ border: "1px solid #2383E2", background: "rgba(35, 131, 226, 0.05)" }}>
          <Users size={18} color="#2383E2" />
          <span style={{ color: "#2383E2", fontWeight: 600 }}>{t.pvp_btn}</span>
        </button>
        <button className="app-button" onClick={() => router.push("/leaderboard")} style={{ border: "1px solid #E2B714", background: "rgba(226, 183, 20, 0.05)" }}>
          <Trophy size={18} color="#E2B714" />
          <span style={{ color: "#E2B714", fontWeight: 600 }}>{t.fame_btn}</span>
        </button>
        <button className="app-button" onClick={() => router.push("/stats")}>
          <BarChart2 size={18} color="var(--foreground-muted)" />
          <span>{t.stats_btn}</span>
        </button>
        <button className="app-button" onClick={() => router.push("/settings")}>
          <Settings size={18} color="var(--foreground-muted)" />
          <span>{t.settings_btn}</span>
        </button>
      </div>

      {/* Quick Play Block */}
      <h2 className="notion-h2">{t.quick_start}</h2>
      <p className="notion-p">{t.quick_start_desc}</p>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.9rem", color: "var(--foreground-muted)" }}>{t.target_lang}</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            className="app-button" 
            style={{ width: "auto", padding: "0.2rem 0.5rem", border: "1px solid", borderColor: lang === "zh" ? "var(--border)" : "transparent", backgroundColor: lang === "zh" ? "var(--surface-hover)" : "transparent" }}
            onClick={() => handleLangChange("zh")}
          >
            中文
          </button>
          <button 
            className="app-button" 
            style={{ width: "auto", padding: "0.2rem 0.5rem", border: "1px solid", borderColor: lang === "en" ? "var(--border)" : "transparent", backgroundColor: lang === "en" ? "var(--surface-hover)" : "transparent" }}
            onClick={() => handleLangChange("en")}
          >
            English
          </button>
        </div>
      </div>

      {/* Daily Challenge Block */}
      <div style={{ 
        marginTop: "2rem",
        padding: "1.5rem", 
        background: "rgba(35, 131, 226, 0.04)", 
        border: "1px solid rgba(35, 131, 226, 0.2)", 
        borderRadius: "var(--radius)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
               <Calendar size={20} color="#2383E2" />
               <h2 className="notion-h2" style={{ margin: 0, border: "none", fontSize: "1.2rem" }}>{t.daily_challenge}</h2>
               <span style={{ 
                 fontSize: "0.6rem", 
                 background: "#2383E2", 
                 color: "#fff", 
                 padding: "1px 6px", 
                 borderRadius: "10px",
                 fontWeight: 800
               }}>{t.daily_badge}</span>
            </div>
            <button className="app-button" onClick={() => router.push("/leaderboard")} style={{ width: "auto", fontSize: "0.8rem", color: "var(--foreground-muted)" }}>
               {t.daily_ranking}
            </button>
         </div>
         <p className="notion-p" style={{ fontSize: "0.95rem", opacity: 0.8, margin: 0 }}>{t.daily_challenge_desc}</p>
         <button 
            className="app-button primary"
            onClick={handleStartDaily}
            disabled={generating}
            style={{ width: "100%", padding: "0.75rem", justifyContent: "center" }}
          >
            {generating ? t.generating : <><Zap size={16} /> {t.take_challenge}</>}
         </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
         <button 
            className="app-button primary"
            onClick={() => handleStart()}
            disabled={generating}
            style={{ width: "auto", padding: "0.5rem 1.2rem", height: "40px" }}
          >
            {generating ? t.generating : <><Zap size={16} /> {t.auto_start} <ChevronRight size={16} /></>}
         </button>
      </div>

      {/* Difficulty Targeting */}
      <h2 className="notion-h2">{t.category_title}</h2>
      <p className="notion-p">{t.category_desc}</p>

      <div className="notion-p" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4px" }}>
        
        <button className="app-button" onClick={() => handleStart("EASY")} disabled={generating} style={{ padding: "0.75rem", border: "1px solid var(--border)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
             <span style={{ fontWeight: 600 }}>🟢 {t.easy}</span>
             <span style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>~50 {t.words}</span>
           </div>
        </button>

        <button className="app-button" onClick={() => handleStart("NORMAL")} disabled={generating} style={{ padding: "0.75rem", border: "1px solid var(--border)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
             <span style={{ fontWeight: 600 }}>🟡 {t.normal}</span>
             <span style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>~100 {t.words}</span>
           </div>
        </button>

        <button className="app-button" onClick={() => handleStart("HARD")} disabled={generating} style={{ padding: "0.75rem", border: "1px solid var(--border)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
             <span style={{ fontWeight: 600 }}>🔴 {t.hard}</span>
             <span style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>~200 {t.words}</span>
           </div>
        </button>

      </div>

      {/* Timed Challenge */}
      <h2 className="notion-h2">{t.timed_title}</h2>
      <p className="notion-p">{t.timed_desc}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
        <button className="app-button" onClick={() => handleStart("TIMED", 15)} disabled={generating} style={{ padding: "1rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
           <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>15</span>
           <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>{t.seconds}</span>
        </button>

        <button className="app-button" onClick={() => handleStart("TIMED", 30)} disabled={generating} style={{ padding: "1rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
           <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>30</span>
           <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>{t.seconds}</span>
        </button>

        <button className="app-button" onClick={() => handleStart("TIMED", 60)} disabled={generating} style={{ padding: "1rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
           <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>60</span>
           <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>{t.seconds}</span>
        </button>
      </div>

      {/* Target Length Settings */}
      <h2 className="notion-h2">{t.custom_title}</h2>
      <p className="notion-p">{t.custom_desc}</p>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
         <input 
            type="number" 
            className="app-input" 
            style={{ width: "100px" }} 
            value={customWordCount} 
            onChange={e => setCustomWordCount(Number(e.target.value))} 
            min={10} 
            max={5000} 
         />
         <span style={{ color: "var(--foreground-muted)" }}>{t.words_per_session}</span>
         <button className="app-button primary" style={{ width: "fit-content", padding: "0.5rem 1rem" }} onClick={() => handleStart(customWordCount)}>
            {t.start_custom}
         </button>
      </div>

    </div>
  );
}
