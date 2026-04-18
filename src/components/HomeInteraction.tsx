"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import Logo from "@/components/Logo";
import { generateText, Difficulty } from "@/lib/generator";

export default function HomeInteraction() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_READY");
  }, []);

  const handleStart = (difficulty?: Difficulty) => {
    if (generating) return;
    setGenerating(true);
    SystemLogPubSub.publish("GENERATING_NEURAL_TEXT...");

    setTimeout(() => {
      // If difficulty provided, use it. Otherwise, randomly select one for Quick Play
      const diffLevels: Difficulty[] = ["EASY", "NORMAL", "HARD"];
      const finalDiff = difficulty || diffLevels[Math.floor(Math.random() * diffLevels.length)];
      
      const practiceData = generateText(lang, finalDiff, "每日隨機生成");
      
      sessionStorage.setItem("typing_practice_data", JSON.stringify({
        ...practiceData,
        language: lang
      }));
      SystemLogPubSub.publish("INITIATE_PRACTICE");
      router.push("/practice");
    }, 400); // Small realistic delay
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      padding: "2rem",
      overflowY: "auto",
      position: "relative",
      zIndex: 10
    }}>
      {/* Header section with Logo and Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
         <div className="animate-step-in stagger-1">
           <Logo size={48} />
         </div>
         
         <div className="glass-panel animate-step-in stagger-1" style={{ display: "flex", gap: "0.5rem", padding: "0.5rem", flexWrap: "wrap", zIndex: 10 }}>
           <button className="glass-button" onClick={() => router.push("/explore")} style={{ padding: "0.5rem 1.5rem" }}>Explore</button>
           <button className="glass-button" onClick={() => router.push("/stats")} style={{ padding: "0.5rem 1.5rem" }}>Stats</button>
           <button className="glass-button" onClick={() => router.push("/settings")} style={{ padding: "0.5rem 1.5rem" }}>Settings</button>
         </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3rem", margin: "2rem 0" }}>
        
        {/* Language Toggle */}
        <div className="glass-panel animate-step-in stagger-2" style={{ display: "flex", gap: "0.5rem", padding: "0.5rem" }}>
          <button className={`glass-button ${lang === "zh" ? "active" : ""}`} onClick={() => setLang("zh")} style={{ padding: "0.5rem 2rem" }}>中文 (ZH)</button>
          <button className={`glass-button ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")} style={{ padding: "0.5rem 2rem" }}>English (EN)</button>
        </div>

        {/* Quick Play Action Button */}
        <div className="animate-step-in stagger-3" style={{ zIndex: 10, width: "100%", maxWidth: "600px" }}>
           <button 
             className="glass-panel"
             onClick={() => handleStart()}
             style={{
               width: "100%",
               padding: "2rem",
               background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%)",
               color: "var(--foreground)",
               border: "1px solid rgba(255,255,255,0.2)",
               cursor: "pointer",
               transition: "all 0.3s ease",
               boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               gap: "0.5rem"
             }}
             onMouseOver={(e) => {
               if(generating) return;
               e.currentTarget.style.transform = "translateY(-4px)";
               e.currentTarget.style.boxShadow = "0 12px 40px rgba(6, 182, 212, 0.5)";
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.transform = "translateY(0px)";
               e.currentTarget.style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.3)";
             }}
             onMouseDown={(e) => { if(!generating) e.currentTarget.style.transform = "translateY(2px)" }}
             onMouseUp={(e) => { if(!generating) e.currentTarget.style.transform = "translateY(-4px)" }}
           >
             <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "4px" }}>
               {generating ? "SYNTHESIZING..." : "QUICK START"}
             </span>
             <span style={{ opacity: 0.8, fontWeight: 500 }}>
               One Click {lang === "zh" ? "自動生成隨機文章" : "Auto-Generate Random Practice"}
             </span>
           </button>
        </div>

        {/* Difficulty Selector */}
        <div className="glass-panel animate-step-in stagger-4" style={{ width: "100%", maxWidth: "600px", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div className="text-gradient" style={{ fontSize: "14px", letterSpacing: "3px", fontWeight: 600 }}>CATEGORY TRAINING</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", width: "100%" }}>
            <button className="glass-button" disabled={generating} style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }} onClick={() => handleStart("EASY")}>
              <span style={{ color: "var(--accent-secondary)", fontWeight: 800 }}>EASY</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>~50 words</span>
            </button>
            <button className="glass-button" disabled={generating} style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }} onClick={() => handleStart("NORMAL")}>
              <span style={{ color: "var(--accent-primary)", fontWeight: 800 }}>NORMAL</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>~100 words</span>
            </button>
            <button className="glass-button" disabled={generating} style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }} onClick={() => handleStart("HARD")}>
              <span style={{ color: "var(--accent-danger)", fontWeight: 800 }}>HARD</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>~200 words</span>
            </button>
          </div>
        </div>

      </div>
      
      {/* Footer filler */}
      <div style={{ height: "48px" }} />
    </div>
  );
}
