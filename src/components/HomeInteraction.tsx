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

  // Styles
  const btnStyle = (isActive: boolean) => ({
    padding: "0.75rem 1.5rem",
    border: "2px solid var(--foreground)",
    backgroundColor: isActive ? "var(--foreground)" : "transparent",
    color: isActive ? "var(--background)" : "var(--foreground)",
    fontSize: "1rem",
    fontWeight: 900,
    cursor: "pointer",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    transition: "all 0.1s"
  });

  const navBtnStyle = {
    padding: "0.5rem 1rem",
    border: "2px solid var(--foreground)",
    backgroundColor: "transparent",
    color: "var(--foreground)",
    fontSize: "0.85rem",
    fontWeight: 900,
    cursor: "pointer",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    letterSpacing: "1px",
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      padding: "2rem",
      overflowY: "auto"
    }}>
      {/* Header section with Logo and Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
         <div className="animate-step-in stagger-1">
           <Logo size={48} />
         </div>
         
         <div className="animate-step-in stagger-1" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", zIndex: 10 }}>
           <button onClick={() => router.push("/explore")} style={navBtnStyle}>[ Explore ]</button>
           <button onClick={() => router.push("/stats")} style={navBtnStyle}>[ Stats ]</button>
           <button onClick={() => router.push("/settings")} style={navBtnStyle}>[ Settings ]</button>
         </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3rem", margin: "2rem 0" }}>
        
        {/* Action Button */}
        <div className="animate-step-in stagger-2" style={{ zIndex: 10 }}>
           <button 
             onClick={handleStart}
             style={{
               padding: "1.5rem 4rem",
               border: "4px solid var(--foreground)",
               backgroundColor: "var(--foreground)",
               color: "var(--background)",
               fontSize: "2rem",
               fontWeight: 900,
               cursor: "pointer",
               textTransform: "uppercase",
               letterSpacing: "3px",
               transition: "transform 0.1s",
               boxShadow: "8px 8px 0px 0px rgba(0,0,0,0.5)"
             }}
             onMouseDown={(e) => e.currentTarget.style.transform = "translate(4px, 4px)"}
             onMouseUp={(e) => e.currentTarget.style.transform = "translate(0px, 0px)"}
             onMouseLeave={(e) => e.currentTarget.style.transform = "translate(0px, 0px)"}
           >
             START_PRACTICE
           </button>
        </div>

        {/* Mode Selector */}
        <div className="animate-step-in stagger-3" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", zIndex: 10 }}>
          <button style={btnStyle(mode === "DAILY")} onClick={() => setMode("DAILY")}>Daily Pick</button>
          <button style={btnStyle(mode === "RANDOM")} onClick={() => setMode("RANDOM")}>Random Quote</button>
          <button style={btnStyle(mode === "CUSTOM")} onClick={() => setMode("CUSTOM")}>Custom Text</button>
        </div>

        {/* Mode Settings / Dynamic Area */}
        <div className="animate-step-in stagger-4" style={{ minHeight: "120px", width: "100%", maxWidth: "800px", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", zIndex: 10 }}>
          {mode === "DAILY" && (
             <div>
               <div style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: 900, opacity: 0.6, marginBottom: "0.5rem" }}>[ TODAY&apos;S ARTICLE ]</div>
               {newsItem ? (
                 <>
                   <h2 style={{ fontSize: "1.5rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.5rem" }}>{newsItem.title}</h2>
                   <p style={{ fontSize: "0.9rem", fontWeight: 900, opacity: 0.7 }}>{newsItem.description.substring(0, 100)}...</p>
                 </>
               ) : (
                 <h2 style={{ fontSize: "1.5rem", fontWeight: 900, textTransform: "uppercase" }}>NO_DATA - FALLBACK ACTIVE</h2>
               )}
             </div>
          )}

          {mode === "RANDOM" && (
             <div>
               <div style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: 900, opacity: 0.6, marginBottom: "0.5rem" }}>[ RANDOM QUOTE MODE ]</div>
               <p style={{ fontSize: "1rem", fontWeight: 900 }}>A surprisingly profound sequence of English words awaits you.</p>
             </div>
          )}

          {mode === "CUSTOM" && (
             <div style={{ width: "100%", maxWidth: "600px" }}>
               <div style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: 900, opacity: 0.6, marginBottom: "0.5rem" }}>[ CUSTOM INPUT ]</div>
               <textarea 
                 value={customText}
                 onChange={(e) => setCustomText(e.target.value)}
                 placeholder="Type or paste your own text here..."
                 style={{
                   width: "100%",
                   height: "80px",
                   backgroundColor: "transparent",
                   border: "2px solid var(--foreground)",
                   color: "var(--foreground)",
                   padding: "1rem",
                   fontSize: "0.9rem",
                   fontWeight: 900,
                   resize: "none",
                   fontFamily: "var(--font-inter), var(--font-noto-sans-tc), sans-serif",
                   outline: "none"
                 }}
                 onFocus={(e) => e.target.style.boxShadow = "4px 4px 0px 0px var(--foreground)"}
                 onBlur={(e) => e.target.style.boxShadow = "none"}
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
