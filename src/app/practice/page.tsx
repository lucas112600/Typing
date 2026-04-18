"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { useConfig } from "@/context/ConfigContext";
import { appendStat } from "@/lib/statsStore";
import { ArrowLeft, Flag } from "lucide-react";

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

      // Professional Colors
      const color = stateClass === "text-correct" ? "var(--foreground)" :
                    stateClass === "text-upcoming" ? "var(--foreground-muted)" :
                    stateClass === "text-wrong" ? "var(--accent-danger)" : "var(--accent-secondary)";
                    
      const opacity = stateClass === "text-upcoming" ? 0.4 : 1;

      return (
        <span 
          key={index} 
          style={{
            position: "relative",
            display: "inline-block",
            color,
            opacity,
            borderBottom: stateClass === "text-composing" ? "2px solid var(--accent-secondary)" : "none",
            backgroundColor: stateClass === "text-wrong" ? "rgba(239, 68, 68, 0.15)" : "transparent",
            borderRadius: stateClass === "text-wrong" ? "4px" : "0",
            transition: "color 0.1s"
          }}
        >
          {isCursorHere && (
            <span style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "var(--accent-primary)",
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
       case "LARGE": return "2rem";
       case "EXTRA_LARGE": return "2.5rem";
       default: return "2rem";
     }
  };

  return (
    <div 
      className="animate-fade-in stagger-1"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        display: "flex", flex: 1, flexDirection: "column",
        minHeight: "100vh", padding: "2rem", position: "relative"
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1000px", margin: "0 auto", marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
           <Flag size={20} color="var(--foreground-muted)" />
           <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground-muted)" }}>{title}</span>
        </div>
        <button className="app-button" onClick={() => router.push("/")} style={{ padding: "0.5rem 1rem" }}>
           <ArrowLeft size={16} /> Quit Practice
        </button>
      </header>

      <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
        <div className="mono-text" style={{
          maxWidth: "1000px",
          width: "100%",
          fontSize: getFontSizeRem(),
          fontWeight: language === "zh" ? 400 : 500,
          lineHeight: "1.6",
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
          padding: "0 1rem",
        }}>
          {renderText()}
        </div>
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
        <div className="app-card animate-fade-in stagger-2" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "3rem",
          display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center",
          boxShadow: "var(--shadow)"
        }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-primary)" }}>Session Complete</h2>
          <div style={{ color: "var(--foreground-muted)" }}>Data saved. Press ESC or click the button below to return.</div>
          <button className="app-button primary" style={{ width: "100%", padding: "1rem" }} onClick={() => router.push("/")}>
            <ArrowLeft size={18} /> Return to Dashboard
          </button>
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
