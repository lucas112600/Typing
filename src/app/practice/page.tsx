"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConfig } from "@/context/ConfigContext";
import { appendStat } from "@/lib/statsStore";
import audioManager from "@/lib/audioManager";
import { THEME_PACKS, ThemeText } from "@/lib/themes";
import { ArrowLeft, BookOpen, Terminal, Quote, Feather } from "lucide-react";

export default function PracticePage() {
  const router = useRouter();
  const { fontSize, stopOnError, soundEnabled, soundVolume } = useConfig();
  
  const [gameState, setGameState] = useState<"SETUP" | "STARTING" | "RACING" | "FINISHED">("SETUP");
  const [countdown, setCountdown] = useState(3);
  
  const [targetText, setTargetText] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [composingData, setComposingData] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [language, setLanguage] = useState<"en" | "zh">("en");
  
  // Caret position tracking
  // Timer State
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Final Stats for display
  const [finalResult, setFinalResult] = useState({ wpm: 0, accuracy: 0 });
  const [caretPos, setCaretPos] = useState({ left: 0, top: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Check session data first
    const dataStr = sessionStorage.getItem("typing_practice_data");
    if (dataStr) {
      const load = async () => {
        try {
          const data = JSON.parse(dataStr);
          setTargetText(data.text || "");
          setTitle(data.title || "Custom Session");
          setLanguage(data.language || "en");
          if (data.timeLimit) {
            setTimeLimit(data.timeLimit);
            setTimeLeft(data.timeLimit);
          }
          if (data.text) {
            setGameState("STARTING");
            setCountdown(3);
          }
        } catch (e) {
          console.error("Failed to parse session data", e);
        }
      };
      load();
    }
  }, []);

  useEffect(() => {
    if (gameState === "RACING") {
       setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [gameState]);

  useEffect(() => {
    if (audioManager) {
      audioManager.setVolume(soundVolume);
    }
  }, [soundVolume]);

  const updateCaretPosition = useCallback(() => {
    const index = value.length;
    const charEl = charRefs.current[index];
    if (charEl && textContainerRef.current) {
      const parentRect = textContainerRef.current.getBoundingClientRect();
      const charRect = charEl.getBoundingClientRect();
      setCaretPos({
        left: charRect.left - parentRect.left,
        top: charRect.top - parentRect.top,
      });
    } else if (index === targetText.length && index > 0) {
      // Last position
      const lastCharEl = charRefs.current[index - 1];
      if (lastCharEl && textContainerRef.current) {
        const parentRect = textContainerRef.current.getBoundingClientRect();
        const charRect = lastCharEl.getBoundingClientRect();
        setCaretPos({
          left: charRect.right - parentRect.left,
          top: charRect.top - parentRect.top,
        });
      }
    }
  }, [value, targetText.length]);

  useEffect(() => {
    updateCaretPosition();
    window.addEventListener("resize", updateCaretPosition);
    return () => window.removeEventListener("resize", updateCaretPosition);
  }, [updateCaretPosition]);

  const startWithTheme = (theme: ThemeText) => {
    setTargetText(theme.text);
    setTitle(theme.title);
    setLanguage(theme.language);
    setGameState("STARTING");
    setCountdown(3);
    setValue("");
    setStartTime(null);
    setErrorCount(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") router.push("/");
    if (gameState !== "RACING") return;

    if (!startTime && e.key.length === 1 && !isComposing) {
       setStartTime(Date.now());
    }
    
    if (soundEnabled && gameState === "RACING" && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key === " ") audioManager?.play("space");
      else audioManager?.play("standard");
    }
  };

  const finalizeSession = useCallback((finalValue: string, finalErrors: number) => {
    if (gameState === "FINISHED" || targetText.length === 0) return;
    setGameState("FINISHED");
    
    if (startTime) {
        const timeMs = Date.now() - startTime;
        const durationMinutes = timeLimit > 0 ? (timeLimit / 60) : (timeMs / 60000);
        
        let correctChars = 0;
        for (let i = 0; i < finalValue.length; i++) {
          if (finalValue[i] === targetText[i]) correctChars++;
        }
        
        const accuracy = Math.max(0, 100 - (finalErrors / Math.max(1, finalValue.length)) * 100);
        const wpmDivisor = language === "zh" ? 1 : 5;
        
        // Safety: Minimum 1 second for calculation
        const wpm = timeMs > 1000 ? Math.round((correctChars / wpmDivisor) / durationMinutes) : 0;
        
        setFinalResult({ wpm, accuracy: Math.round(accuracy) });

        appendStat({
          date: new Date().toISOString(),
          wpm,
          accuracy: Math.round(accuracy)
        });

        if (soundEnabled) audioManager?.play("finish");
     }
  }, [gameState, targetText, startTime, timeLimit, language, soundEnabled]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (gameState === "STARTING" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setGameState("RACING");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, countdown]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (gameState === "RACING" && startTime && timeLimit > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            finalizeSession(value, errorCount);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, startTime, timeLimit, value, errorCount, finalizeSession]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "RACING") return;
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
            if (soundEnabled) audioManager?.play("error");
          }
        }
      }
    }

    setValue(val);
    if (val.length >= targetText.length && !isComposing && targetText.length > 0) {
      finalizeSession(val, errorCount);
    }
  };

  const renderText = () => {
    const chars = targetText.split("");
    const confirmedLength = isComposing ? value.length - composingData.length : value.length;
    
    return chars.map((char: string, index: number) => {
      let state: "upcoming" | "correct" | "wrong" | "composing" = "upcoming";
      
      if (index < confirmedLength) {
        state = value[index] === char ? "correct" : "wrong";
      } else if (index >= confirmedLength && index < value.length) {
        state = "composing";
      }

      const color = state === "correct" ? "var(--foreground)" :
                    state === "upcoming" ? "var(--foreground-muted)" :
                    state === "wrong" ? "var(--foreground-danger)" : "#2383E2";
      const opacity = state === "upcoming" ? 0.55 : 1;
      const bg = state === "wrong" ? "rgba(235, 87, 87, 0.2)" : "transparent";

      return (
        <span 
          key={index}
          ref={el => { charRefs.current[index] = el; }}
          className={state === "correct" ? "char-pop" : ""}
          style={{
            position: "relative",
            display: "inline-block",
            color,
            opacity,
            backgroundColor: bg,
            borderBottom: state === "composing" ? "2px solid #2383E2" : "none",
            borderRadius: state === "wrong" ? "3px" : "0",
            transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
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

  if (gameState === "SETUP") {
    return (
      <div className="notion-page animate-fade-in" style={{ maxWidth: "800px" }}>
        <button onClick={() => router.push("/")} className="app-button" style={{ width: "fit-content", marginBottom: "2rem" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="notion-title">Choose a Theme</h1>
        <p className="notion-p" style={{ opacity: 0.6, marginBottom: "3rem" }}>Select a text pack to start your practice session.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {THEME_PACKS.map((theme) => (
            <div key={theme.id} className="app-card" style={{ padding: "1.5rem", cursor: "pointer" }} onClick={() => startWithTheme(theme)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
                {theme.category === "TECH" && <Terminal size={20} color="#2383E2" />}
                {theme.category === "LITERATURE" && <BookOpen size={20} color="#9065B0" />}
                {theme.category === "QUOTES" && <Quote size={20} color="#E2B714" />}
                {theme.category === "POETRY" && <Feather size={20} color="#EB5757" />}
                <span style={{ fontWeight: 600 }}>{theme.title}</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {theme.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="notion-page animate-fade-in"
      style={{ maxWidth: "1000px", padding: "6rem 2rem", margin: "0 auto", minHeight: "100vh", position: "relative" }}
    >
      <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         <span>{title} · {language === "zh" ? "中文" : "English"}</span>
         {timeLimit > 0 && gameState === "RACING" && (
           <div style={{ 
             fontSize: "2rem", 
             fontWeight: 800, 
             color: timeLeft <= 5 ? "var(--foreground-danger)" : "#2383E2",
             transition: "color 0.3s ease",
             fontFamily: "var(--font-mono)"
            }}>
             {timeLeft}s
           </div>
         )}
          <span>ESC to quit</span>
      </div>

      <div style={{ position: "relative", minHeight: "200px" }}>
        {gameState === "STARTING" && (
          <div style={{ 
              position: "absolute", 
              inset: 0, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              zIndex: 10,
              background: "rgba(255,255,255,0.01)",
              backdropFilter: "blur(4px)",
              borderRadius: "12px"
          }}>
            <div style={{ fontSize: "8rem", fontWeight: 800, color: "var(--foreground)" }}>{countdown}</div>
          </div>
        )}

        <div 
          ref={textContainerRef}
          className="mono-text" 
          style={{
            position: "relative",
            fontSize: getFontSizeRem(),
            fontWeight: 500,
            lineHeight: "1.8",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            opacity: gameState === "RACING" ? 1 : 0.2,
            transition: "opacity 0.5s ease"
          }}
          onClick={() => inputRef.current?.focus()}
        >
           <div className="smooth-caret" style={{ left: caretPos.left, top: caretPos.top }} />
           {renderText()}
        </div>
      </div>

      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => {
          setIsComposing(false);
          setComposingData("");
          if (inputRef.current?.value.length === targetText.length) {
            finalizeSession(inputRef.current.value, errorCount);
          }
        }}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none" }}
        autoFocus spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
      />

      {gameState === "FINISHED" && (
        <div className="animate-fade-in" style={{
          marginTop: "6rem",
          padding: "3rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          textAlign: "center"
        }}>
          <h2 className="notion-h2" style={{ marginTop: 0, border: "none" }}>Race Finished!</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "4rem", margin: "2rem 0" }}>
             <div>
               <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>SPEED</div>
               <div style={{ fontSize: "2.5rem", fontWeight: 800 }}>{finalResult.wpm} <span style={{ fontSize: "1rem" }}>WPM</span></div>
             </div>
             <div>
               <div style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>ACCURACY</div>
               <div style={{ fontSize: "2.5rem", fontWeight: 800 }}>{finalResult.accuracy}%</div>
             </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="app-button primary" style={{ width: "fit-content", padding: "0.6rem 2rem" }} onClick={() => setGameState("SETUP")}>
              Try Another Theme
            </button>
            <button className="app-button" style={{ width: "fit-content", padding: "0.6rem 2rem", border: "1px solid var(--border)" }} onClick={() => router.push("/")}>
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
