"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { mockData, Category1, Category2, Entry } from "@/lib/mockData";
import { generateText } from "@/lib/generator";
import { ArrowLeft, BookOpen, FileText, Bot, Search } from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const [cat1, setCat1] = useState<Category1>("ZH_CHINESE");
  const [cat2, setCat2] = useState<Category2>("NEWS_FEED");
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");

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

  const entries = (mockData[cat1][cat2] || []).filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notion-page animate-fade-in">
      
      <button className="app-button" onClick={() => router.push("/")} style={{ width: "fit-content", marginBottom: "2rem", color: "var(--foreground-muted)" }}>
         <ArrowLeft size={16} /> Back to Hub
      </button>

      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>📚</div>
      <h1 className="notion-title">Database Explorer</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        Browse through curated articles or use the AI Forge to synthesize new custom typing tasks.
      </p>

      {/* Language Tabs */}
      <h2 className="notion-h2">Locale</h2>
      <div style={{ display: "flex", gap: "0.5rem" }}>
         <button 
           className={`app-button ${cat1 === "ZH_CHINESE" ? "primary" : ""}`}
           style={{ width: "fit-content", padding: "0.5rem 1rem", border: cat1 !== "ZH_CHINESE" ? "1px solid var(--border)" : "none" }}
           onClick={() => setCat1("ZH_CHINESE")}
         >
           Traditional Chinese (ZH)
         </button>
         <button 
            className={`app-button ${cat1 === "EN_ENGLISH" ? "primary" : ""}`}
           style={{ width: "fit-content", padding: "0.5rem 1rem", border: cat1 !== "EN_ENGLISH" ? "1px solid var(--border)" : "none" }}
           onClick={() => setCat1("EN_ENGLISH")}
         >
           English (US)
         </button>
      </div>

      {/* Category Tabs */}
      <h2 className="notion-h2">Views</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%", marginBottom: "1rem" }}>
         <button
            className="app-button"
            style={{ backgroundColor: cat2 === "NEWS_FEED" ? "var(--surface-active)" : "transparent" }}
            onClick={() => setCat2("NEWS_FEED")}
          >
            <FileText size={18} color="var(--foreground-muted)" />
            <span>Articles & News</span>
          </button>
          
          <button
            className="app-button"
            style={{ backgroundColor: cat2 === "ARCHIVE" ? "var(--surface-active)" : "transparent" }}
            onClick={() => setCat2("ARCHIVE")}
          >
            <BookOpen size={18} color="var(--foreground-muted)" />
            <span>Classic Literature</span>
          </button>

          <button
            className="app-button"
            style={{ backgroundColor: cat2 === "AI_FORGE" ? "var(--surface-active)" : "transparent" }}
            onClick={() => setCat2("AI_FORGE")}
          >
            <Bot size={18} color="var(--foreground-muted)" />
            <span>Neural AI Forge</span>
          </button>
      </div>

      {/* Main Content Area */}
      <h2 className="notion-h2">
        {cat2 === "NEWS_FEED" ? "Table: Articles" : cat2 === "ARCHIVE" ? "Table: Classics" : "Action: AI Generation"}
      </h2>

      {cat2 === "AI_FORGE" ? (
        <div style={{ padding: "1rem 0" }}>
          <p className="notion-p">Provide a topical prompt to generate a custom practice text natively.</p>
          <input 
            className="app-input"
            disabled={generating}
            placeholder="Type a topic (e.g. History of Computing) and press Enter..."
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
          {generating && <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Synthesizing text...</div>}
        </div>
      ) : (
        <div>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
             <Search size={16} color="var(--foreground-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
             <input 
               className="app-input" 
               placeholder="Search database..." 
               style={{ paddingLeft: "36px" }}
               value={search}
               onChange={e => setSearch(e.target.value)}
             />
          </div>
          
          {entries.length === 0 ? (
             <p className="notion-p" style={{ color: "var(--foreground-muted)" }}>No matching results found.</p>
          ) : (
             <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                {entries.map((entry, idx) => (
                  <div 
                    key={entry.id}
                    className="app-button"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      padding: "0.75rem 1rem",
                      borderBottom: idx !== entries.length - 1 ? "1px solid var(--border)" : "none",
                      borderRadius: 0,
                      gap: "1rem",
                      width: "100%"
                    }}
                    onClick={() => handleSelect(entry)}
                  >
                    <div style={{ 
                      fontSize: "0.75rem", 
                      padding: "2px 6px", 
                      borderRadius: "4px",
                      border: "1px solid var(--border)",
                      color: "var(--foreground-muted)",
                      backgroundColor: "var(--surface)",
                      minWidth: "60px",
                      textAlign: "center"
                    }}>
                      {entry.difficulty}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, marginBottom: "2px" }}>{entry.title}</div>
                      <div style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Source: {entry.source} • {entry.wordCount} words</div>
                    </div>
                  </div>
                ))}
             </div>
          )}
        </div>
      )}

    </div>
  );
}
