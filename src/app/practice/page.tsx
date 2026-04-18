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

      // Notion Colors
      const color = stateClass === "text-correct" ? "var(--foreground)" :
                    stateClass === "text-upcoming" ? "var(--foreground-muted)" :
                    stateClass === "text-wrong" ? "var(--foreground-danger)" : "#2383E2";
                    
      const opacity = stateClass === "text-upcoming" ? 0.3 : 1;
      const bg = stateClass === "text-wrong" ? "rgba(235, 87, 87, 0.2)" : "transparent";

      return (
        <span 
          key={index} 
          style={{
            position: "relative",
            display: "inline-block",
            color,
            opacity,
            backgroundColor: bg,
            borderBottom: stateClass === "text-composing" ? "2px solid #2383E2" : "none",
            borderRadius: stateClass === "text-wrong" ? "3px" : "0",
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
              backgroundColor: "var(--foreground)",
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
       case "MEDIUM": return "1.25rem";
       case "LARGE": return "1.75rem";
       case "EXTRA_LARGE": return "2.25rem";
       default: return "1.75rem";
     }
  };

  return (
    <div 
      className="notion-page animate-fade-in"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        maxWidth: "900px", padding: "4rem 2rem", margin: "0 auto", minHeight: "100vh", position: "relative"
      }}
    >
      <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", marginBottom: "3rem" }}>
         ESC to quit · Workspace / {title}
      </div>

      <div className="mono-text" style={{
         fontSize: getFontSizeRem(),
         fontWeight: language === "zh" ? 400 : 500,
         lineHeight: "1.8",
         wordBreak: "break-all",
         whiteSpace: "pre-wrap",
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
        style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none" }}
        autoFocus spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
      />

      {isFinished && (
        <div className="animate-fade-in" style={{
          marginTop: "4rem",
          padding: "2rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)"
        }}>
          <h2 className="notion-h2" style={{ marginTop: 0 }}>Session Complete</h2>
          <p className="notion-p">Your performance data has been logged to the database.</p>
          <button className="app-button primary" style={{ width: "fit-content", padding: "0.5rem 1rem" }} onClick={() => router.push("/")}>
            Return to Pages
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}} />
    </div>
  );
}
