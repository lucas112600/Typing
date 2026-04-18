"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import Logo from "@/components/Logo";
import { mockData, Category1, Category2, Entry } from "@/lib/mockData";
import { generateText } from "@/lib/generator";
import { ArrowLeft, BrainCircuit, Library, FileText, Bot } from "lucide-react";

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
    <div style={{ padding: "4rem 2rem", display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      {/* HEADER / NAVIGATION */}
      <header className="animate-fade-in stagger-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <Logo size={36} />
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            className={`app-button ${cat1 === "ZH_CHINESE" ? "active" : ""}`}
            style={{ padding: "0.5rem 1.5rem" }}
            onClick={() => setCat1("ZH_CHINESE")}
          >
            中文 ZH
          </button>
          <button 
             className={`app-button ${cat1 === "EN_ENGLISH" ? "active" : ""}`}
            style={{ padding: "0.5rem 1.5rem" }}
            onClick={() => setCat1("EN_ENGLISH")}
          >
            English EN
          </button>
        </div>
      </header>

      <div style={{ display: "flex", gap: "2.5rem", flex: 1, alignItems: "flex-start" }}>
        {/* SIDEBAR SUB NAV */}
        <aside className="app-card animate-fade-in stagger-2" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1.5rem", width: "260px" }}>
          
          <button
            className={`app-button ${cat2 === "NEWS_FEED" ? "primary" : ""}`}
            style={{ padding: "1rem", textAlign: "left", justifyContent: "flex-start" }}
            onClick={() => setCat2("NEWS_FEED")}
          >
            <FileText size={18} /> News Feed
          </button>
          
          <button
            className={`app-button ${cat2 === "ARCHIVE" ? "primary" : ""}`}
            style={{ padding: "1rem", textAlign: "left", justifyContent: "flex-start" }}
            onClick={() => setCat2("ARCHIVE")}
          >
            <Library size={18} /> Archive Classics
          </button>

          <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "1rem 0" }} />

          <button
            className={`app-button ${cat2 === "AI_FORGE" ? "primary" : ""}`}
            style={{ padding: "1rem", textAlign: "left", justifyContent: "flex-start" }}
            onClick={() => setCat2("AI_FORGE")}
          >
            <Bot size={18} /> AI Generate (Forge)
          </button>
          
          <div style={{ flex: 1, minHeight: "4rem" }} />
          <button className="app-button" style={{ padding: "1rem", justifyContent: "center" }} onClick={() => router.push("/")}>
            <ArrowLeft size={16} /> Dashboard
          </button>
        </aside>

        {/* MAIN LIST OR FORGE */}
        <div className="animate-fade-in stagger-3" style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "transparent" }}>
          
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
             {cat2 === "NEWS_FEED" && <FileText />}
             {cat2 === "ARCHIVE" && <Library />}
             {cat2 === "AI_FORGE" && <Bot />}
             {cat2.replace("_", " ")}
          </h2>

          {cat2 === "AI_FORGE" ? (
            <div className="app-card" style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>Enter Topic Prompt</div>
              <input 
                className="app-input"
                disabled={generating}
                style={{
                  width: "100%",
                  padding: "1.25rem",
                  fontSize: "1.1rem"
                }}
                placeholder="e.g. History of Computing..."
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
              <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {generating ? <BrainCircuit className="animate-pulse" size={16} /> : <BrainCircuit size={16} />}
                {generating ? "Synthesizing document..." : "Press ENTER to generate custom practice material."}
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="app-card" style={{ padding: "4rem", textAlign: "center", color: "var(--foreground-muted)" }}>
              No documents available in this category.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {entries.map((entry) => (
                <div 
                  key={entry.id}
                  className="app-card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 80px 120px",
                    padding: "1.25rem 1.5rem",
                    alignItems: "center",
                    gap: "1.5rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelect(entry)}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent-primary)"}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <div style={{ 
                    fontSize: "0.75rem", 
                    padding: "4px 8px", 
                    borderRadius: "4px",
                    background: entry.difficulty === "HARD" ? "rgba(239, 68, 68, 0.1)" : 
                               entry.difficulty === "CORE" ? "rgba(37, 99, 235, 0.1)" : "rgba(16, 185, 129, 0.1)",
                    color: entry.difficulty === "HARD" ? "var(--accent-danger)" : 
                           entry.difficulty === "CORE" ? "var(--accent-primary)" : "var(--accent-secondary)",
                    textAlign: "center",
                    fontWeight: 600
                  }}>
                    {entry.difficulty}
                  </div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 500 }}>{entry.title}</div>
                  <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", textAlign: "right" }}>{entry.wordCount} W</div>
                  <div style={{ color: "var(--foreground-muted)", fontSize: "0.8rem", textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.source}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer */}
      <div style={{ height: "80px" }} />
    </div>
  );
}
