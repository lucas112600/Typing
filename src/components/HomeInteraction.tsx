"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import Logo from "@/components/Logo";
import { generateText, Difficulty } from "@/lib/generator";
import { Zap, BookOpen, Settings, BarChart2, ChevronRight, Layers } from "lucide-react";

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
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      padding: "2rem",
      margin: "0 auto",
      maxWidth: "1100px",
      width: "100%",
    }}>
      {/* Header section */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }} className="animate-fade-in stagger-1">
         <Logo size={40} />
         
         <div style={{ display: "flex", gap: "0.5rem" }}>
           <button className="app-button" onClick={() => router.push("/explore")} style={{ padding: "0.5rem 1rem" }}>
             <BookOpen size={16} /> Explore
           </button>
           <button className="app-button" onClick={() => router.push("/stats")} style={{ padding: "0.5rem 1rem" }}>
             <BarChart2 size={16} /> Stats
           </button>
           <button className="app-button" onClick={() => router.push("/settings")} style={{ padding: "0.5rem 1rem" }}>
             <Settings size={16} /> Settings
           </button>
         </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3rem" }}>
        
        {/* Hero Section */}
        <div className="animate-fade-in stagger-2" style={{ textAlign: "center", maxWidth: "600px" }}>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-1px" }}>
            The Modern Typing Trainer
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--foreground-muted)", marginBottom: "2rem" }}>
            Improve your typing speed and accuracy through procedurally generated practices tailored to your skill level.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <button className={`app-button ${lang === "zh" ? "active" : ""}`} onClick={() => setLang("zh")} style={{ padding: "0.5rem 1.5rem" }}>中文 (ZH)</button>
            <button className={`app-button ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")} style={{ padding: "0.5rem 1.5rem" }}>English (EN)</button>
          </div>

          <button 
             className="app-button primary"
             onClick={() => handleStart()}
             style={{ padding: "1.25rem 3rem", fontSize: "1.2rem", width: "100%" }}
             disabled={generating}
           >
             {generating ? (
               "Generating Practice..."
             ) : (
               <>
                 <Zap size={20} fill="currentColor" />
                 Quick Start
                 <ChevronRight size={20} />
               </>
             )}
           </button>
        </div>

        {/* Categories Section */}
        <div className="app-card animate-fade-in stagger-3" style={{ width: "100%", maxWidth: "800px", padding: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Layers className="text-muted" size={24} style={{ color: "var(--foreground-muted)" }} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Category Training</h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {/* EASY */}
            <div className="app-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "none" }}>
               <div>
                 <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent-secondary)" }}>EASY</div>
                 <div style={{ fontSize: "0.9rem", color: "var(--foreground-muted)" }}>~50 Words. Basic vocabulary and simple sentences.</div>
               </div>
               <button className="app-button" disabled={generating} style={{ marginTop: "auto", width: "100%", padding: "0.75rem" }} onClick={() => handleStart("EASY")}>
                 Select Level
               </button>
            </div>

            {/* NORMAL */}
            <div className="app-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", borderColor: "var(--accent-primary)", boxShadow: "var(--shadow-sm)" }}>
               <div>
                 <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent-primary)" }}>NORMAL</div>
                 <div style={{ fontSize: "0.9rem", color: "var(--foreground-muted)" }}>~100 Words. Standard paragraphs and average complexity.</div>
               </div>
               <button className="app-button primary" disabled={generating} style={{ marginTop: "auto", width: "100%", padding: "0.75rem" }} onClick={() => handleStart("NORMAL")}>
                 Select Level
               </button>
            </div>

            {/* HARD */}
            <div className="app-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "none" }}>
               <div>
                 <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent-danger)" }}>HARD</div>
                 <div style={{ fontSize: "0.9rem", color: "var(--foreground-muted)" }}>~200 Words. Advanced vocabulary and structural layouts.</div>
               </div>
               <button className="app-button" disabled={generating} style={{ marginTop: "auto", width: "100%", padding: "0.75rem" }} onClick={() => handleStart("HARD")}>
                 Select Level
               </button>
            </div>
          </div>
        </div>

      </div>
      
      {/* Spacer to keep footer clear */}
      <div style={{ height: "100px" }} />
    </div>
  );
}
