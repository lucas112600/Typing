"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import Logo from "@/components/Logo";
import { mockData, Category1, Category2, Entry } from "@/lib/mockData";
import { generateText } from "@/lib/generator";

export default function ExplorePage() {
  const router = useRouter();
  const [cat1, setCat1] = useState<Category1>("ZH_CHINESE");
  const [cat2, setCat2] = useState<Category2>("NEWS_FEED");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_EXPLORE_READY");
  }, []);

  const handleSelect = (entry: Entry) => {
    sessionStorage.setItem("typing_practice_data", JSON.stringify({
      id: entry.id,
      title: entry.title,
      description: "",
      language: cat1 === "ZH_CHINESE" ? "zh" : "en",
      text: entry.text,
    }));
    router.push("/practice");
  };



  const entries = mockData[cat1][cat2] || [];

  return (
    <div style={{ padding: "4rem", display: "flex", flexDirection: "column", height: "100%", zIndex: 10, position: "relative" }}>
      {/* HEADER / NAVIGATION */}
      <div className="glass-panel animate-step-in stagger-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", marginBottom: "2rem" }}>
        <Logo size={42} />
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            className={`glass-button ${cat1 === "ZH_CHINESE" ? "active" : ""}`}
            style={{ padding: "0.5rem 1.5rem" }}
            onClick={() => setCat1("ZH_CHINESE")}
          >
            中文 ZH
          </button>
          <button 
             className={`glass-button ${cat1 === "EN_ENGLISH" ? "active" : ""}`}
            style={{ padding: "0.5rem 1.5rem" }}
            onClick={() => setCat1("EN_ENGLISH")}
          >
            English EN
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR SUB NAV */}
        <div className="glass-panel animate-step-in stagger-2" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem", width: "250px" }}>
          {["NEWS_FEED", "ARCHIVE", "AI_FORGE"].map((c) => (
            <button
              key={c}
              className={`glass-button ${cat2 === c ? "active" : ""}`}
              style={{
                padding: "1rem",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onClick={() => setCat2(c as Category2)}
            >
              <span>{c.replace("_", " ")}</span>
              {cat2 === c && <span style={{ color: "var(--accent-secondary)" }}>●</span>}
            </button>
          ))}
          
          <div style={{ flex: 1 }} />
          <button className="glass-button" style={{ padding: "1rem", textAlign: "center" }} onClick={() => router.push("/")}>
            ← RETURN HOME
          </button>
        </div>

        {/* LIST OR FORGE */}
        <div className="glass-panel animate-step-in stagger-3" style={{ flex: 1, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <h2 className="text-gradient" style={{ fontSize: "1.5rem", marginBottom: "2rem", letterSpacing: "2px" }}>
             {"// " + cat2.replace("_", " ")}
          </h2>

          {cat2 === "AI_FORGE" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px", margin: "0 auto", width: "100%", flex: 1, justifyContent: "center" }}>
              <div className="text-gradient-primary" style={{ fontSize: "1.2rem", fontWeight: 600 }}>ENTER GENERATION DIRECTIVES:</div>
              <input 
                className="mono-text"
                disabled={generating}
                style={{
                  width: "100%",
                  padding: "1.5rem",
                  fontSize: "1.2rem",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "var(--foreground)",
                  outline: "none",
                  transition: "all 0.3s ease",
                  opacity: generating ? 0.5 : 1
                }}
                placeholder="e.g. Quantum Computing..."
                onFocus={(e) => e.target.style.borderColor = "var(--accent-secondary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = e.currentTarget.value;
                    if (!val.trim()) return;
                    setGenerating(true);
                    SystemLogPubSub.publish("GENERATING_NEURAL_TEXT...");
                    
                    setTimeout(() => {
                       setGenerating(false);
                       e.currentTarget.value = "";
                       SystemLogPubSub.publish("GENERATION_COMPLETE");
                       const genEntry = generateText(cat1 === "ZH_CHINESE" ? "zh" : "en", "HARD", val);
                       handleSelect(genEntry);
                    }, 1200);
                  }
                }}
              />
              <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>{generating ? "Synthesizing text arrays..." : "Press ENTER to initiate synthesis engine."}</div>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
              <h2>NO DATA FOUND IN CLUSTER</h2>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {entries.map((entry) => (
                <div 
                  key={entry.id}
                  className="glass-button"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 100px 150px",
                    padding: "1.5rem",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => handleSelect(entry)}
                >
                  <div style={{ 
                    fontSize: "0.8rem", 
                    padding: "4px 8px", 
                    borderRadius: "4px",
                    background: entry.difficulty === "HARD" ? "rgba(239, 68, 68, 0.2)" : 
                               entry.difficulty === "CORE" ? "rgba(139, 92, 246, 0.2)" : "rgba(6, 182, 212, 0.2)",
                    color: entry.difficulty === "HARD" ? "var(--accent-danger)" : 
                           entry.difficulty === "CORE" ? "var(--accent-primary)" : "var(--accent-secondary)",
                    textAlign: "center",
                    fontWeight: 800
                  }}>
                    {entry.difficulty}
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{entry.title}</div>
                  <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", textAlign: "right" }}>{entry.wordCount} W</div>
                  <div className="mono-text" style={{ color: "var(--foreground-muted)", fontSize: "0.8rem", textAlign: "right" }}>{entry.source}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
