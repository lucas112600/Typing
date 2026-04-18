"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { useConfig } from "@/context/ConfigContext";
import { appendStat } from "@/lib/statsStore";

export default function PracticePage() {
  const router = useRouter();
  const { fontSize, stopOnError } = useConfig();
  const [targetText, setTargetText] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [composingData, setComposingData] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [language, setLanguage] = useState<"en" | "zh">("en");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_PRACTICE_INIT");
    const dataStr = sessionStorage.getItem("typing_practice_data");
    setTimeout(() => {
      if (dataStr) {
        try {
          const data = JSON.parse(dataStr);
          setTargetText(data.text || "Hello World");
          setTitle(data.title || "Unknown");
          setLanguage(data.language || "en");
        } catch {
          setTargetText("Error loading text.");
        }
      } else {
         setTargetText("The quick brown fox jumps over the lazy dog.");
         setTitle("Fallback Text");
      }
    }, 0);

    const t = setTimeout(() => {
       inputRef.current?.focus();
       SystemLogPubSub.publish("IME_READY");
    }, 100);

    return () => clearTimeout(t);
  }, []);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
       router.push("/");
    }
    if (!startTime && e.key.length === 1 && !isComposing) {
       setStartTime(Date.now());
    }
  };

  const finalizeSession = (finalValue: string, finalErrors: number) => {
    if (isFinished || targetText.length === 0) return;
    setIsFinished(true);
    SystemLogPubSub.publish("PRACTICE_FINISHED");
    
    if (startTime) {
       const timeMs = Date.now() - startTime;
       const minutes = timeMs / 60000;
       
       let correctChars = 0;
       for (let i = 0; i < targetText.length; i++) {
         if (finalValue[i] === targetText[i]) correctChars++;
       }
       
       const accuracy = Math.max(0, 100 - (finalErrors / targetText.length) * 100);
       
       // Standard English uses 5 chars per word. Chinese uses 1 char per word.
       const wpmDivisor = language === "zh" ? 1 : 5;
       const wpm = (correctChars / wpmDivisor) / minutes;
       
       appendStat({
         date: new Date().toISOString(),
         wpm: Math.round(wpm),
         accuracy: Math.round(accuracy)
       });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;

    if (!isComposing) {
      if (stopOnError) {
        if (val.length > value.length && targetText.substring(0, val.length) !== val) {
          setErrorCount((prev) => prev + 1);
          return;
        }
      } else {
        if (val.length > value.length) {
          const charIndex = val.length - 1;
          if (val[charIndex] !== targetText[charIndex]) {
            setErrorCount((prev) => prev + 1);
          }
        }
      }
    }

    setValue(val);
    if (val.length >= targetText.length && !isComposing && targetText.length > 0) {
      finalizeSession(val, errorCount);
    }
  };

  const handleCompStart = () => setIsComposing(true);
  const handleCompUpdate = (e: React.CompositionEvent<HTMLInputElement>) => {
    setComposingData(e.data);
  };
  const handleCompEnd = () => {
    setIsComposing(false);
    setComposingData("");
    
    // In React 18, safe reference to current exact input value after IME
    const currentVal = inputRef.current?.value || value;
    let finalVal = currentVal;
    
    if (stopOnError) {
      if (targetText.substring(0, currentVal.length) !== currentVal) {
         for (let i=0; i <= currentVal.length; i++) {
            if (currentVal.substring(0, i) !== targetText.substring(0, i)) {
               finalVal = currentVal.substring(0, i - 1);
               setErrorCount((prev) => prev + 1);
               break;
            }
         }
         setValue(finalVal);
      } else {
         setValue(currentVal);
      }
    } else {
       setValue(currentVal);
    }
    
    if (finalVal.length >= targetText.length && targetText.length > 0) {
       finalizeSession(finalVal, errorCount);
    }
  };

  const renderText = () => {
    const chars = targetText.split("");
    const confirmedLength = isComposing ? value.length - composingData.length : value.length;
    
    return chars.map((char: string, index: number) => {
      let stateClass = "text-upcoming";
      
      if (index < confirmedLength) {
        stateClass = value[index] === char ? "text-correct" : "text-wrong";
      } else if (index >= confirmedLength && index < value.length) {
        stateClass = "text-composing";
      }

      const isCursorHere = index === value.length && !isFinished;

      // Premium Glass Colors
      const color = stateClass === "text-correct" ? "var(--foreground)" :
                    stateClass === "text-upcoming" ? "var(--foreground-muted)" :
                    stateClass === "text-wrong" ? "var(--accent-danger)" : "var(--accent-secondary)";
                    
      const opacity = stateClass === "text-upcoming" ? 0.3 : 1;
      const textShadow = (stateClass === "text-correct" || stateClass === "text-composing") 
                          ? "0 0 10px rgba(255,255,255,0.3)" : 
                         stateClass === "text-wrong" ? "0 0 12px rgba(239, 68, 68, 0.6)" : "none";

      return (
        <span 
          key={index} 
          style={{
            position: "relative",
            display: "inline-block",
            color,
            opacity,
            textShadow,
            borderBottom: stateClass === "text-composing" ? "2px solid var(--accent-secondary)" : "none",
            backgroundColor: stateClass === "text-wrong" ? "rgba(239, 68, 68, 0.15)" : "transparent",
            borderRadius: stateClass === "text-wrong" ? "2px" : "0",
            transition: "all 0.1s"
          }}
        >
          {isCursorHere && (
            <span style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "var(--accent-secondary)",
              boxShadow: "0 0 8px var(--accent-secondary)",
              animation: "blink 1s step-end infinite"
            }} />
          )}
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  const getFontSizeRem = () => {
     switch (fontSize) {
       case "MEDIUM": return "1.5rem";
       case "LARGE": return "2.5rem";
       case "EXTRA_LARGE": return "3.5rem";
       default: return "2.5rem";
     }
  };

  return (
    <div 
      className="animate-step-in stagger-1"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center",
        height: "100%", padding: "4rem", position: "relative", zIndex: 10
      }}
    >
      <div className="glass-panel" style={{ position: "absolute", top: "2rem", left: "2rem", padding: "0.5rem 1.5rem" }}>
        <span className="text-gradient" style={{ fontSize: "0.9rem", fontWeight: 600, letterSpacing: "2px" }}>{title}</span>
      </div>

      <div className="glass-panel" style={{ position: "absolute", top: "2rem", right: "2rem", padding: "0.5rem 1.5rem" }}>
         <span className="text-gradient" style={{ fontSize: "0.9rem", fontWeight: 600 }}>ESC TO ABORT</span>
      </div>

      <div className="mono-text" style={{
        maxWidth: "900px",
        fontSize: getFontSizeRem(),
        fontWeight: language === "zh" ? 400 : 600,
        lineHeight: "1.6",
        wordBreak: "break-all",
        whiteSpace: "pre-wrap",
        padding: "2rem",
        borderRadius: "24px",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "inset 0 4px 20px rgba(0,0,0,0.5)"
      }}>
        {renderText()}
      </div>

      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompStart}
        onCompositionUpdate={handleCompUpdate}
        onCompositionEnd={handleCompEnd}
        style={{ position: "absolute", top: "50%", left: "50%", opacity: 0, pointerEvents: "none" }}
        autoFocus spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
      />

      {isFinished && (
        <div className="glass-panel animate-step-in stagger-2" style={{
          marginTop: "4rem", padding: "1.5rem 3rem",
          display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center",
          border: "1px solid var(--accent-primary)",
          boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)"
        }}>
          <h2 className="text-gradient-primary" style={{ fontSize: "2rem", fontWeight: 800 }}>PRACTICE FINISHED</h2>
          <div style={{ color: "var(--foreground-muted)" }}>PRESS ESC TO RETURN TO HUB</div>
        </div>
      )}

      {/* Adding a global blink animation for cursor */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}} />
    </div>
  );
}
