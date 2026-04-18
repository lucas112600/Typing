"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { generateText, Difficulty } from "@/lib/generator";
import { Zap, BookOpen, Settings, BarChart2, ChevronRight, FileText } from "lucide-react";

export default function HomeInteraction() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_READY");
  }, []);

  const handleStart = (difficulty?: Difficulty) => {
    if (generating) return;
    setGenerating(true);
    SystemLogPubSub.publish("GENERATING_NEURAL_TEXT...");

    setTimeout(() => {
      const diffLevels: Difficulty[] = ["EASY", "NORMAL", "HARD"];
      const finalDiff = difficulty || diffLevels[Math.floor(Math.random() * diffLevels.length)];
      
      const practiceData = generateText(lang, finalDiff, "每日隨機生成");
      
      sessionStorage.setItem("typing_practice_data", JSON.stringify({
        ...practiceData,
        language: lang
      }));
      SystemLogPubSub.publish("INITIATE_PRACTICE");
      router.push("/practice");
    }, 400);
  };

  return (
    <div className="notion-page animate-fade-in">
      
      {/* Cover Icon / Title */}
      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>⌨️</div>
      <h1 className="notion-title">Typing Practice Hub</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        Focus on improving your typing speed and accuracy through procedurally generated, distraction-free practices.
      </p>

      {/* Pages Navigation */}
      <h2 className="notion-h2">Pages</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%" }}>
        <button className="app-button" onClick={() => router.push("/docs")}>
          <FileText size={18} color="var(--foreground-muted)" />
          <span>Documentation</span>
        </button>
        <button className="app-button" onClick={() => router.push("/explore")}>
          <BookOpen size={18} color="var(--foreground-muted)" />
          <span>Explore Database</span>
        </button>
        <button className="app-button" onClick={() => router.push("/stats")}>
          <BarChart2 size={18} color="var(--foreground-muted)" />
          <span>Performance Stats</span>
        </button>
        <button className="app-button" onClick={() => router.push("/settings")}>
          <Settings size={18} color="var(--foreground-muted)" />
          <span>Settings</span>
        </button>
      </div>

      {/* Quick Play Block */}
      <h2 className="notion-h2">Quick Start</h2>
      <p className="notion-p">Instantly jump into a randomly generated practice session.</p>
      
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.9rem", color: "var(--foreground-muted)" }}>Target Language:</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            className="app-button" 
            style={{ width: "auto", padding: "0.2rem 0.5rem", border: "1px solid", borderColor: lang === "zh" ? "var(--border)" : "transparent", backgroundColor: lang === "zh" ? "var(--surface-hover)" : "transparent" }}
            onClick={() => setLang("zh")}
          >
            中文
          </button>
          <button 
            className="app-button" 
            style={{ width: "auto", padding: "0.2rem 0.5rem", border: "1px solid", borderColor: lang === "en" ? "var(--border)" : "transparent", backgroundColor: lang === "en" ? "var(--surface-hover)" : "transparent" }}
            onClick={() => setLang("en")}
          >
            English
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
         <button 
            className="app-button primary"
            onClick={() => handleStart()}
            disabled={generating}
            style={{ width: "auto", padding: "0.5rem 1.2rem", height: "40px" }}
          >
            {generating ? "Generating..." : <><Zap size={16} /> Auto Start <ChevronRight size={16} /></>}
         </button>
      </div>

      {/* Difficulty Targeting */}
      <h2 className="notion-h2">Category Targeting</h2>
      <p className="notion-p">Select a specific difficulty to constrain the AI string generation length.</p>

      <div className="notion-p" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4px" }}>
        
        <button className="app-button" onClick={() => handleStart("EASY")} disabled={generating} style={{ padding: "0.75rem", border: "1px solid var(--border)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
             <span style={{ fontWeight: 600 }}>🟢 Easy</span>
             <span style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>~50 Words</span>
           </div>
        </button>

        <button className="app-button" onClick={() => handleStart("NORMAL")} disabled={generating} style={{ padding: "0.75rem", border: "1px solid var(--border)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
             <span style={{ fontWeight: 600 }}>🟡 Normal</span>
             <span style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>~100 Words</span>
           </div>
        </button>

        <button className="app-button" onClick={() => handleStart("HARD")} disabled={generating} style={{ padding: "0.75rem", border: "1px solid var(--border)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
             <span style={{ fontWeight: 600 }}>🔴 Hard</span>
             <span style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>~200 Words</span>
           </div>
        </button>

      </div>

    </div>
  );
}
