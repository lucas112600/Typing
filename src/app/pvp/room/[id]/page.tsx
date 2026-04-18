"use client";

import { useEffect, useState, useRef, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useConfig } from "@/context/ConfigContext";
import { ArrowLeft, Settings, Check } from "lucide-react";
import audioManager from "@/lib/audioManager";
import { RealtimeChannel } from "@supabase/supabase-js";
import { THEME_PACKS, ThemeText } from "@/lib/themes";

export const dynamic = "force-dynamic";

interface Player {
  id: string;
  name: string;
  ready: boolean;
  progress: number;
  wpm: number;
  finished: boolean;
}

interface PresenceMetadata {
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
  const { fontSize, stopOnError, soundEnabled, soundVolume, nickname } = useConfig();
  
  const [userId] = useState(() => Math.random().toString(36).substring(2, 9));
  const [players, setPlayers] = useState<Player[]>([]);
  const [targetText, setTargetText] = useState(THEME_PACKS[0].text);
  const [title, setTitle] = useState(THEME_PACKS[0].title);
  const [gameState, setGameState] = useState<"LOADING" | "LOBBY" | "STARTING" | "RACING">("LOADING");
  const [countdown, setCountdown] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Typing State
  const [value, setValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Caret position
  const [caretPos, setCaretPos] = useState({ left: 0, top: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Host detection: First person in the players list
  const isHost = players.length > 0 && players[0].id === userId;

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceMetadata>();
        const formattedPlayers: Player[] = Object.values(state).flat().map((p) => ({
          id: p.id,
          name: p.name,
          ready: p.ready,
          progress: p.progress || 0,
          wpm: p.wpm || 0,
          finished: p.finished || false,
        }));
        setPlayers(formattedPlayers);
        setGameState(current => current === "LOADING" ? "LOBBY" : current);
      })
      .on("broadcast", { event: "race_event" }, ({ payload }) => {
        if (payload.type === "START_COUNTDOWN") {
          setGameState("STARTING");
          setCountdown(5);
        } else if (payload.type === "START_RACE") {
          setGameState("RACING");
          setStartTime(Date.now());
          setTimeout(() => inputRef.current?.focus(), 100);
        } else if (payload.type === "THEME_UPDATED") {
          setTargetText(payload.text);
          setTitle(payload.title);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Immediately drop loading state when subscribed
          setGameState(current => current === "LOADING" ? "LOBBY" : current);

          await channel.track({
            id: userId,
            name: nickname || `Player ${userId.slice(0, 4)}`,
            ready: false,
            progress: 0,
            wpm: 0,
            finished: false,
          });
        } else if (status === "CHANNEL_ERROR") {
          console.error("Supabase Realtime Channel Error");
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId, userId, nickname]);

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

  const toggleReady = useCallback(async () => {
    if (!channelRef.current) return;
    const me = players.find(p => p.id === userId);
    const newReady = !me?.ready;
    
    await channelRef.current.track({
      id: userId,
      name: nickname || `Player ${userId.slice(0, 4)}`,
      ready: newReady,
      progress: 0,
      wpm: 0,
      finished: false,
    });

    const otherPlayers = players.filter(p => p.id !== userId);
    const allOthersReady = otherPlayers.every(p => p.ready);
    
    if (newReady && allOthersReady && players.length >= 1) {
       channelRef.current.send({
         type: "broadcast",
         event: "race_event",
         payload: { type: "START_COUNTDOWN" }
       });

       setTimeout(() => {
         channelRef.current?.send({
           type: "broadcast",
           event: "race_event",
           payload: { type: "START_RACE" }
         });
       }, 5000);
    }
  }, [players, userId, nickname]);

  const changeTheme = (theme: ThemeText) => {
    if (!isHost || !channelRef.current) return;
    setTargetText(theme.text);
    setTitle(theme.title);
    setShowSettings(false);
    
    channelRef.current.send({
      type: "broadcast",
      event: "race_event",
      payload: { 
        type: "THEME_UPDATED", 
        text: theme.text, 
        title: theme.title 
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") router.push("/pvp");

    if (soundEnabled && !isFinished && gameState === "RACING" && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (e.key === " ") audioManager?.play("space");
      else audioManager?.play("standard");
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "RACING" || isFinished || !channelRef.current) return;
    const val = e.target.value;

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

    const progress = Math.min(100, Math.round((val.length / targetText.length) * 100));
    const timeMs = Date.now() - (startTime || 0);
    const wpm = Math.round((val.length / 5) / (timeMs / 60000)) || 0;
    
    await channelRef.current.track({
      id: userId,
      name: nickname || `Player ${userId.slice(0, 4)}`,
      ready: true,
      progress,
      wpm,
      finished: val.length >= targetText.length,
    });

    if (val.length >= targetText.length && !isComposing) {
      setIsFinished(true);
      if (soundEnabled) audioManager?.play("finish");

      const finalWpm = wpm;
      const finalAccuracy = Math.max(0, 100 - Math.round((errorCount / targetText.length) * 100));
      
      await supabase.from("leaderboards").insert({
        name: nickname || `Player ${userId.slice(0, 4)}`,
        wpm: finalWpm,
        accuracy: finalAccuracy
      });
    }
  };

  const renderText = () => {
    return targetText.split("").map((char, index) => {
      let state: "upcoming" | "correct" | "wrong" = "upcoming";

      if (index < value.length) {
        state = value[index] === char ? "correct" : "wrong";
      }

      const color = state === "correct" ? "var(--foreground)" :
                    state === "upcoming" ? "var(--foreground-muted)" :
                    "var(--foreground-danger)";
      const opacity = state === "upcoming" ? 0.55 : 1;
      const bg = state === "wrong" ? "rgba(235, 87, 87, 0.2)" : "transparent";

      return (
        <span 
          key={index} 
          ref={el => { charRefs.current[index] = el; }}
          className={state === "correct" ? "char-pop" : ""}
          style={{ 
            color, 
            opacity, 
            backgroundColor: bg, 
            position: "relative",
            display: "inline-block",
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
      default: return "1.5rem";
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (gameState === "STARTING" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, countdown]);

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <div style={{ color: "var(--foreground-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            PvP Room / {roomId}
          </div>
          <h2 className="notion-h2" style={{ margin: "0.5rem 0" }}>{gameState === "LOADING" ? "Connecting..." : title}</h2>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           {isHost && gameState === "LOBBY" && (
             <button onClick={() => setShowSettings(!showSettings)} className="app-button" style={{ width: "fit-content", padding: "0.5rem" }}>
               <Settings size={20} />
             </button>
           )}
           {gameState === "LOBBY" && (
             <button 
               onClick={toggleReady}
               className={`app-button ${players.find(p => p.id === userId)?.ready ? "secondary" : "primary"}`}
               style={{ padding: "0.5rem 1.5rem" }}
             >
               {players.find(p => p.id === userId)?.ready ? "Unready" : "Ready Up"}
             </button>
           )}
           <button 
             onClick={() => router.push("/")} 
             style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--foreground-muted)", fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }}
           >
             <ArrowLeft size={16} />
             <span>Exit</span>
           </button>
        </div>
      </div>

      {showSettings && isHost && (
        <div className="animate-fade-in" style={{ marginBottom: "2rem", padding: "1.5rem", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border)" }}>
           <h4 className="notion-h3" style={{ marginTop: 0 }}>Room Theme</h4>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
              {THEME_PACKS.map(theme => (
                <button 
                  key={theme.id} 
                  className="app-button" 
                  style={{ 
                    border: "1px solid var(--border)", 
                    padding: "0.5rem", 
                    justifyContent: "center",
                    position: "relative"
                  }} 
                  onClick={() => changeTheme(theme)}
                >
                  {theme.title}
                  {title === theme.title && <Check size={14} style={{ position: "absolute", top: 2, right: 2 }} color="#2383E2" />}
                </button>
              ))}
           </div>
        </div>
      )}

      <div style={{ marginBottom: "4rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {players.map(player => (
          <div key={player.id} style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.5rem", color: player.id === userId ? "var(--foreground)" : "var(--foreground-muted)" }}>
              <span>{player.name} {player.id === userId && "(You)"} {player.finished && "🏁"}</span>
              <span>{player.wpm} WPM · {player.progress}%</span>
            </div>
            <div style={{ height: "4px", background: "var(--bg-secondary)", borderRadius: "2px", overflow: "hidden" }}>
              <div 
                style={{ 
                  height: "100%", 
                  width: `${player.progress}%`, 
                  background: player.id === userId ? "#2383E2" : "var(--foreground-muted)",
                  transition: "width 0.3s ease-out"
                }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative", minHeight: "300px" }}>
        {gameState === "STARTING" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, background: "rgba(255,255,255,0.01)", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: "8rem", fontWeight: 800, color: "var(--foreground)" }}>{countdown}</div>
          </div>
        )}

        <div 
          ref={textContainerRef}
          className="mono-text" 
          onClick={() => inputRef.current?.focus()}
          style={{
            position: "relative",
            fontSize: getFontSizeRem(),
            lineHeight: "1.8",
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            opacity: gameState === "RACING" ? 1 : 0.3,
            transition: "opacity 0.5s ease"
          }}
        >
          <div className="smooth-caret" style={{ left: caretPos.left, top: caretPos.top }} />
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
    </div>
  );
}
