"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import type { NewsItem } from "@/lib/newsApi";
import Logo from "@/components/Logo";

type Mode = "DAILY" | "RANDOM" | "CUSTOM";

export default function HomeInteraction({ newsItem }: { newsItem: NewsItem | null }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("DAILY");
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    SystemLogPubSub.publish("SYS_READY");
  }, []);

  const handleStart = () => {
    let practiceData = null;

    if (mode === "DAILY" && newsItem) {
      practiceData = newsItem;
    } else if (mode === "RANDOM") {
      const quotes = [
        "The quick brown fox jumps over the lazy dog.",
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "Code is poems written for machines to read."
      ];
      const randomQ = quotes[Math.floor(Math.random() * quotes.length)];
      practiceData = { title: "Random Quote", description: randomQ, text: randomQ };
    } else if (mode === "CUSTOM") {
      if (!customText || customText.trim() === "") {
        SystemLogPubSub.publish("ERR_CUSTOM_TEXT_EMPTY");
        return;
      }
      practiceData = { title: "Custom Text", description: "User inputted text", text: customText.trim() };
    } else if (mode === "DAILY" && !newsItem) {
       practiceData = { title: "Fallback Pick", description: "No daily pick available.", text: "The quick brown fox jumps over the lazy dog." };
    }

    if (practiceData) {
      sessionStorage.setItem("typing_practice_data", JSON.stringify(practiceData));
      SystemLogPubSub.publish("INITIATE_PRACTICE");
      router.push("/practice");
    }
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
        
        {/* Action Button */}
        <div className="animate-step-in stagger-2" style={{ zIndex: 10 }}>
           <button 
             className="glass-panel"
             onClick={handleStart}
             style={{
               padding: "1.5rem 5rem",
               background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%)",
               color: "var(--foreground)",
               fontSize: "2rem",
               fontWeight: 800,
               letterSpacing: "4px",
               border: "1px solid rgba(255,255,255,0.2)",
               cursor: "pointer",
               transition: "all 0.3s ease",
               boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)"
             }}
             onMouseOver={(e) => {
               e.currentTarget.style.transform = "translateY(-4px)";
               e.currentTarget.style.boxShadow = "0 12px 40px rgba(6, 182, 212, 0.5)";
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.transform = "translateY(0px)";
               e.currentTarget.style.boxShadow = "0 8px 32px rgba(139, 92, 246, 0.3)";
             }}
             onMouseDown={(e) => e.currentTarget.style.transform = "translateY(2px)"}
             onMouseUp={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
           >
             START
           </button>
        </div>

        {/* Mode Selector */}
        <div className="glass-panel animate-step-in stagger-3" style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", zIndex: 10, padding: "0.5rem" }}>
          <button className={`glass-button ${mode === "DAILY" ? "active" : ""}`} style={{ padding: "0.75rem 2rem" }} onClick={() => setMode("DAILY")}>Daily Pick</button>
          <button className={`glass-button ${mode === "RANDOM" ? "active" : ""}`} style={{ padding: "0.75rem 2rem" }} onClick={() => setMode("RANDOM")}>Random Quote</button>
          <button className={`glass-button ${mode === "CUSTOM" ? "active" : ""}`} style={{ padding: "0.75rem 2rem" }} onClick={() => setMode("CUSTOM")}>Custom Text</button>
        </div>

        {/* Mode Settings / Dynamic Area */}
        <div className="glass-panel animate-step-in stagger-4" style={{ minHeight: "160px", width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", zIndex: 10, padding: "2rem" }}>
          {mode === "DAILY" && (
             <div style={{ animation: "fade-slide-up 0.4s ease" }}>
               <div className="text-gradient" style={{ fontSize: "14px", letterSpacing: "3px", fontWeight: 600, marginBottom: "1rem" }}>TODAY&apos;S ARTICLE</div>
               {newsItem ? (
                 <>
                   <h2 className="text-gradient-primary" style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.2 }}>{newsItem.title}</h2>
                   <p style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.8, color: "var(--foreground-muted)", maxWidth: "600px" }}>{newsItem.description.substring(0, 120)}...</p>
                 </>
               ) : (
                 <h2 className="text-gradient-primary" style={{ fontSize: "1.8rem", fontWeight: 800 }}>FALLBACK ACTIVE</h2>
               )}
             </div>
          )}

          {mode === "RANDOM" && (
             <div style={{ animation: "fade-slide-up 0.4s ease" }}>
               <div className="text-gradient" style={{ fontSize: "14px", letterSpacing: "3px", fontWeight: 600, marginBottom: "1rem" }}>RANDOM QUOTE MODE</div>
               <p style={{ fontSize: "1.2rem", fontWeight: 400, color: "var(--foreground-muted)" }}>A surprisingly profound sequence of English words awaits you.</p>
             </div>
          )}

          {mode === "CUSTOM" && (
             <div style={{ width: "100%", maxWidth: "600px", animation: "fade-slide-up 0.4s ease" }}>
               <div className="text-gradient" style={{ fontSize: "14px", letterSpacing: "3px", fontWeight: 600, marginBottom: "1rem" }}>CUSTOM INPUT</div>
               <textarea 
                 value={customText}
                 onChange={(e) => setCustomText(e.target.value)}
                 placeholder="Type or paste your own text here..."
                 className="mono-text"
                 style={{
                   width: "100%",
                   height: "100px",
                   backgroundColor: "rgba(0,0,0,0.2)",
                   border: "1px solid rgba(255,255,255,0.1)",
                   borderRadius: "12px",
                   color: "var(--foreground)",
                   padding: "1rem",
                   fontSize: "1rem",
                   resize: "none",
                   outline: "none",
                   transition: "border-color 0.2s"
                 }}
                 onFocus={(e) => e.target.style.borderColor = "var(--accent-primary)"}
                 onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
               />
             </div>
          )}
        </div>
      </div>
      
      {/* Footer filler */}
      <div style={{ height: "48px" }} />
    </div>
  );
}
