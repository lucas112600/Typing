"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import PartySocket from "partysocket";
import { useConfig } from "@/context/ConfigContext";
import { ArrowLeft } from "lucide-react";
import audioManager from "@/lib/audioManager";

interface Player {
  id: string;
  name: string;
  ready: boolean;
  progress: number;
  wpm: number;
  finished: boolean;
}

export default function PvPRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const router = useRouter();
  const { fontSize, stopOnError, soundEnabled, soundVolume } = useConfig();
  
  // Game State
  const [socket, setSocket] = useState<PartySocket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [targetText, setTargetText] = useState("");
  const [title, setTitle] = useState("Loading...");
  const [gameState, setGameState] = useState<"LOADING" | "LOBBY" | "STARTING" | "RACING">("LOADING");
  const [countdown, setCountdown] = useState(0);
  
  // Typing State
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const host = process.env.NEXT_PUBLIC_PARTY_HOST || (window.location.host.includes("localhost") ? "localhost:1999" : window.location.host);
    const ws = new PartySocket({
      host,
      room: roomId,
    });

    ws.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "SYNC_ROOM":
          setPlayers(data.players);
          setTargetText(data.text);
          setTitle(data.title);
          setGameState(data.state);
          break;
        case "UPDATE_PLAYERS":
          setPlayers(data.players);
          break;
        case "START_COUNTDOWN":
          setGameState("STARTING");
          setCountdown(5);
          const interval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          break;
        case "START_RACE":
          setGameState("RACING");
          setStartTime(Date.now());
          inputRef.current?.focus();
          break;
        case "TEXT_UPDATED":
          setTargetText(data.text);
          setTitle(data.title);
          break;
      }
    });
    
    ws.addEventListener("open", () => {
      console.log("PartySocket connected to room:", roomId);
      ws.send(JSON.stringify({ type: "REQUEST_SYNC" }));
    });

    setSocket(ws);
    return () => ws.close();
  }, [roomId]);

  useEffect(() => {
    if (audioManager) {
      audioManager.setVolume(soundVolume);
    }
  }, [soundVolume]);

  const toggleReady = () => {
    const me = players.find(p => p.id === socket?.id);
    socket?.send(JSON.stringify({
      type: "SET_READY",
      ready: !me?.ready
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") router.push("/pvp");

    // Play sounds on KeyDown for immediate feedback
    if (soundEnabled && !isFinished && gameState === "RACING" && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key === " ") {
        audioManager?.play("space");
      } else {
        audioManager?.play("standard");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "RACING" || isFinished) return;
    const val = e.target.value;

    // Basic error checking (matching practice logic)
    if (!isComposing) {
        if (stopOnError) {
            if (val.length > value.length && targetText.substring(0, val.length) !== val) {
                setErrorCount(prev => prev + 1);
                return;
            }
        } else if (val.length > value.length) {
            if (val[val.length - 1] !== targetText[val.length - 1]) {
                setErrorCount(prev => prev + 1);
                if (soundEnabled) audioManager?.play("error");
            }
        }
    }

    setValue(val);

    // Sync progress to server
    const progress = (val.length / targetText.length) * 100;
    const timeMs = Date.now() - (startTime || 0);
    const wpm = (val.length / 5) / (timeMs / 60000);
    
    socket?.send(JSON.stringify({
      type: "UPDATE_PROGRESS",
      progress: Math.min(100, Math.round(progress)),
      wpm: Math.round(wpm)
    }));

    if (val.length >= targetText.length && !isComposing) {
      setIsFinished(true);
      socket?.send(JSON.stringify({ type: "FINISH" }));

      // Submit to global leaderboard
      const finalWpm = Math.round(wpm);
      const finalAccuracy = Math.max(0, 100 - Math.round((errorCount / targetText.length) * 100));
      
      const host = process.env.NEXT_PUBLIC_PARTY_HOST || (window.location.host.includes("localhost") ? "localhost:1999" : window.location.host);
      const globalSocket = new PartySocket({
        host,
        room: "global",
      });
      
      globalSocket.addEventListener("open", () => {
        globalSocket.send(JSON.stringify({
          type: "SUBMIT_SCORE",
          name: localStorage.getItem("TYPING_NICKNAME") || `Player ${socket?.id.slice(0, 4)}`,
          wpm: finalWpm,
          accuracy: finalAccuracy
        }));
        // Close after submission
        setTimeout(() => globalSocket.close(), 1000);
      });
      
      if (soundEnabled) {
        audioManager?.play("finish");
      }
    }
  };

  const renderText = () => {
    return targetText.split("").map((char, index) => {
      let color = "var(--foreground-muted)";
      let opacity = 0.3;
      let bg = "transparent";

      if (index < value.length) {
        const isCorrect = value[index] === char;
        color = isCorrect ? "var(--foreground)" : "var(--foreground-danger)";
        opacity = 1;
        bg = isCorrect ? "transparent" : "rgba(235, 87, 87, 0.2)";
      }

      const isCursor = index === value.length && gameState === "RACING" && !isFinished;

      return (
        <span key={index} style={{ color, opacity, backgroundColor: bg, position: "relative" }}>
          {isCursor && <span className="cursor-block" />}
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
      default: return "1.5rem";
    }
  };

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <div style={{ color: "var(--foreground-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            PvP Room / {roomId}
          </div>
          <h2 className="notion-h2" style={{ margin: "0.5rem 0" }}>{title}</h2>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           {gameState === "LOBBY" && (
             <button 
               onClick={toggleReady}
               className={`app-button ${players.find(p => p.id === socket?.id)?.ready ? "secondary" : "primary"}`}
               style={{ padding: "0.5rem 1.5rem" }}
             >
               {players.find(p => p.id === socket?.id)?.ready ? "Unready" : "Ready Up"}
             </button>
           )}
           <button 
             onClick={() => router.push("/")} 
             style={{ 
               display: "flex", 
               alignItems: "center", 
               gap: "0.4rem", 
               color: "var(--foreground-muted)", 
               fontSize: "0.9rem",
               background: "none",
               border: "none",
               cursor: "pointer"
             }}
           >
             <ArrowLeft size={16} />
             <span>Exit to Home</span>
           </button>
           <button onClick={() => router.push("/pvp")} style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }}>Quit to Lobby</button>
        </div>
      </div>

      {/* Progress Bars (Separated) */}
      <div style={{ marginBottom: "4rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {players.map(player => (
          <div key={player.id} style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.5rem", color: player.id === socket?.id ? "var(--foreground)" : "var(--foreground-muted)" }}>
              <span>{player.name} {player.id === socket?.id && "(You)"} {player.finished && "🏁"}</span>
              <span>{player.wpm} WPM · {player.progress}%</span>
            </div>
            <div style={{ height: "4px", background: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
              <div 
                style={{ 
                  height: "100%", 
                  width: `${player.progress}%`, 
                  background: player.id === socket?.id ? "#2383E2" : "var(--foreground-muted)",
                  transition: "width 0.3s ease-out",
                  boxShadow: player.id === socket?.id ? "0 0 10px rgba(35, 131, 226, 0.5)" : "none"
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ position: "relative", minHeight: "300px" }}>
        {gameState === "STARTING" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, background: "rgba(255,255,255,0.01)", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "8rem", fontWeight: 800, color: "var(--foreground)" }}>{countdown}</div>
          </div>
        )}

        <div 
          className="mono-text" 
          onClick={() => inputRef.current?.focus()}
          style={{
            fontSize: getFontSizeRem(),
            lineHeight: "1.8",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            opacity: gameState === "RACING" ? 1 : 0.3,
            transition: "opacity 0.5s ease"
          }}
        >
          {renderText()}
        </div>

        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          disabled={gameState !== "RACING" || isFinished}
          style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none" }}
          autoFocus spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
        />
      </div>

      {/* Results */}
      {isFinished && (
        <div className="animate-fade-in" style={{ marginTop: "4rem", padding: "2rem", border: "1px solid var(--border)", borderRadius: "12px" }}>
          <h3 style={{ margin: "0 0 1rem 0" }}>Race Complete!</h3>
          <div style={{ display: "flex", gap: "2rem" }}>
             <div>
               <div style={{ color: "var(--foreground-muted)", fontSize: "0.8rem" }}>SPEED</div>
               <div style={{ fontSize: "2rem", fontWeight: 700 }}>{players.find(p => p.id === socket?.id)?.wpm} <span style={{ fontSize: "0.8rem" }}>WPM</span></div>
             </div>
             <div>
               <div style={{ color: "var(--foreground-muted)", fontSize: "0.8rem" }}>ACCURACY</div>
               <div style={{ fontSize: "2rem", fontWeight: 700 }}>{Math.max(0, 100 - Math.round((errorCount / targetText.length) * 100))}%</div>
             </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .cursor-block {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: #2383E2;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
