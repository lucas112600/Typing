"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import { useConfig } from "@/context/ConfigContext";
import { appendStat } from "@/lib/statsStore";

export default function PracticePage() {
  const router = useRouter();
  const { stopOnError } = useConfig();
  const [targetText, setTargetText] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [composingData, setComposingData] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    SystemLogPubSub.publish("SYS_PRACTICE_INIT");
    const dataStr = sessionStorage.getItem("typing_practice_data");
// ... skipped unmodified parts ...
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr);
        setTargetText(data.text || "Hello World");
        setTitle(data.title || "Unknown");
      } catch (e) {
        setTargetText("Error loading text.");
      }
    } else {
      setTargetText("The quick brown fox jumps over the lazy dog.");
      setTitle("Fallback Text");
    }

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
      const wpm = (correctChars / 5) / minutes;
      
      appendStat({
        date: new Date().toISOString(),
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy)
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    let val = e.target.value;

    if (!isComposing) {
      if (stopOnError) {
        // In strict mode, reject the exact stroke if it fails equality at its length
        if (val.length > value.length && targetText.substring(0, val.length) !== val) {
          setErrorCount((prev: number) => prev + 1);
          return; // reject completely
        }
      } else {
        // Count mistake if we advanced and it was wrong
        if (val.length > value.length) {
          const charIndex = val.length - 1;
          if (val[charIndex] !== targetText[charIndex]) {
            setErrorCount((prev: number) => prev + 1);
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
  const handleCompEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    setComposingData("");
    
    // Evaluate if strict mode needs to slice off the composed block
    let finalVal = value;
    if (stopOnError) {
      if (targetText.substring(0, value.length) !== value) {
         // The composition produced an error block, strip back to last known good
         for (let i=0; i <= value.length; i++) {
            if (value.substring(0, i) !== targetText.substring(0, i)) {
               finalVal = value.substring(0, i - 1);
               setErrorCount((prev: number) => prev + 1);
               break;
            }
         }
         setValue(finalVal);
      }
    }
    
    if (finalVal.length >= targetText.length && targetText.length > 0) {
      finalizeSession(finalVal, errorCount);
    }
  };

  // Rendering logic
  const renderText = () => {
    const chars = targetText.split("");
    const confirmedLength = isComposing ? value.length - composingData.length : value.length;
    
    return chars.map((char: string, index: number) => {
      let stateClass = "text-upcoming";
      
      if (index < confirmedLength) {
        stateClass = value[index] === char ? "text-correct" : "text-wrong";
      } else if (index >= confirmedLength && index < value.length) {
        // This character is currently being composed over
        stateClass = "text-composing";
      }

      const isCursorHere = index === value.length && !isFinished;

      return (
        <span 
          key={index} 
          className={stateClass}
          style={{
            position: "relative",
            display: "inline-block",
            color: stateClass === "text-correct" ? "var(--foreground)" : 
                   stateClass === "text-upcoming" ? "rgba(255, 255, 255, 0.3)" : 
                   stateClass === "text-wrong" ? "var(--background)" : "rgba(255, 255, 255, 0.6)",
            backgroundColor: stateClass === "text-wrong" ? "var(--accent)" : "transparent",
            borderBottom: stateClass === "text-composing" ? "2px solid var(--foreground)" : "none",
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

  return (
    <div 
      className="animate-step-in stagger-1"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "4rem",
        cursor: "none",
        position: "relative"
      }}
    >
      <div style={{ position: "absolute", top: "2rem", left: "2rem", fontSize: "14px", fontWeight: 900, letterSpacing: "2px" }}>
        [ {title} ]
      </div>

      <div style={{ position: "absolute", top: "2rem", right: "2rem", fontSize: "14px", fontWeight: 900 }}>
        [ ESC TO ABORT ]
      </div>

      <div style={{
        maxWidth: "900px",
        fontSize: "2.5rem",
        fontWeight: 900,
        lineHeight: "1.5",
        fontFamily: "var(--font-inter), var(--font-noto-sans-tc), sans-serif",
        wordBreak: "break-all",
        whiteSpace: "pre-wrap"
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
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          opacity: 0,
          pointerEvents: "none"
        }}
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {isFinished && (
        <div className="animate-step-in stagger-2" style={{
          marginTop: "4rem",
          padding: "1rem 2rem",
          border: "2px solid var(--foreground)",
          fontSize: "1.5rem",
          fontWeight: 900
        }}>
          PRACTICE_FINISHED [ PRESS ESC TO RETURN ]
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
