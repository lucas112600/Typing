"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";

import { useConfig, FontSizeOption, CursorStyleOption } from "@/context/ConfigContext";
import { ArrowLeft, Check } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  
  const { 
    fontSize, cursorStyle, stopOnError, nickname, soundEnabled, soundVolume,
    setFontSize, setCursorStyle, setStopOnError, setNickname, setSoundEnabled, setSoundVolume 
  } = useConfig();

  useEffect(() => {
    SystemLogPubSub.publish("SYS_CONFIG");
  }, []);

  return (
    <div className="notion-page animate-fade-in">
      
      <button className="app-button" onClick={() => router.push("/")} style={{ width: "fit-content", marginBottom: "2rem", color: "var(--foreground-muted)" }}>
         <ArrowLeft size={16} /> Back to Hub
      </button>

      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>⚙️</div>
      <h1 className="notion-title">Preferences</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        Configure typographical scale and strictness algorithms.
      </p>

      {/* Profile / Nickname Block */}
      <h2 className="notion-h2">Identity</h2>
      <p className="notion-p">Set your nickname for global leaderboards and PvP rooms.</p>
      <div style={{ marginBottom: "2rem" }}>
         <input 
            type="text"
            placeholder="nEnter your nickname..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="app-input"
            style={{ 
               width: "100%", 
               maxWidth: "400px", 
               padding: "0.75rem 1rem",
               fontSize: "1rem",
               background: "var(--bg-secondary)",
               border: "1px solid var(--border)",
               borderRadius: "6px",
               color: "var(--foreground)",
               outline: "none"
            }}
         />
      </div>

      {/* Editor Font Size Block */}
      <h2 className="notion-h2">Typography Scale</h2>
      <p className="notion-p">Choose the visual block size of character elements during practice.</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "1rem" }}>
         {["MEDIUM", "LARGE", "EXTRA_LARGE"].map((size, idx) => (
            <button 
               key={size}
               className="app-button"
               style={{ 
                  borderRadius: 0, 
                  padding: "0.75rem 1rem", 
                  borderBottom: idx !== 2 ? "1px solid var(--border)" : "none",
                  justifyContent: "space-between"
               }}
               onClick={() => setFontSize(size as FontSizeOption)}
            >
               <span>{size.replace("_", " ")}</span>
               {fontSize === size && <Check size={16} color="var(--foreground)" />}
            </button>
         ))}
      </div>

      {/* Cursor Block */}
      <h2 className="notion-h2">Cursor Style</h2>
      <p className="notion-p">Affects the practice line indicator.</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "1rem" }}>
         {["CROSSHAIR", "BLOCK", "LINE"].map((style, idx) => (
            <button 
               key={style}
               className="app-button"
               style={{ 
                  borderRadius: 0, 
                  padding: "0.75rem 1rem", 
                  borderBottom: idx !== 2 ? "1px solid var(--border)" : "none",
                  justifyContent: "space-between"
               }}
               onClick={() => setCursorStyle(style as CursorStyleOption)}
            >
               <span>{style}</span>
               {cursorStyle === style && <Check size={16} color="var(--foreground)" />}
            </button>
         ))}
      </div>

      {/* Strict Mode Block */}
      <h2 className="notion-h2">Strict Constraint</h2>
      <p className="notion-p">Requires 100% path accuracy before advancing (locks input on typo).</p>
      
      <button 
         className="app-button"
         style={{ 
            border: "1px solid var(--border)", 
            padding: "0.75rem 1rem",
            justifyContent: "space-between",
            marginBottom: "2rem"
         }}
         onClick={() => setStopOnError(!stopOnError)}
      >
         <span>{stopOnError ? "Strict Mode is ON" : "Strict Mode is OFF"}</span>
         <div style={{ 
            width: "36px", height: "20px", 
            backgroundColor: stopOnError ? "#2383E2" : "var(--border)", 
            borderRadius: "10px", 
            position: "relative",
            transition: "background-color 0.2s"
         }}>
             <div style={{
                position: "absolute",
                top: "2px",
                left: stopOnError ? "18px" : "2px",
                width: "16px",
                height: "16px",
                backgroundColor: "#fff",
                borderRadius: "50%",
                transition: "left 0.2s"
             }} />
         </div>
      </button>

      {/* Audio / Sound Block */}
      <h2 className="notion-h2">Audio Feedback</h2>
      <p className="notion-p">Enable high-fidelity mechanical keyboard sound simulation.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "4rem" }}>
         <button 
            className="app-button"
            style={{ 
               border: "1px solid var(--border)", 
               padding: "0.75rem 1rem",
               justifyContent: "space-between"
            }}
            onClick={() => setSoundEnabled(!soundEnabled)}
         >
            <span>{soundEnabled ? "Sound Effects ON" : "Sound Effects OFF"}</span>
            <div style={{ 
               width: "36px", height: "20px", 
               backgroundColor: soundEnabled ? "#E2B714" : "var(--border)", 
               borderRadius: "10px", 
               position: "relative",
               transition: "background-color 0.2s"
            }}>
                <div style={{
                   position: "absolute",
                   top: "2px",
                   left: soundEnabled ? "18px" : "2px",
                   width: "16px",
                   height: "16px",
                   backgroundColor: "#fff",
                   borderRadius: "50%",
                   transition: "left 0.2s"
                }} />
            </div>
         </button>

         {soundEnabled && (
           <div style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
               <span style={{ fontSize: "0.8rem", color: "var(--foreground-muted)" }}>VOLUME</span>
               <span style={{ fontSize: "0.8rem" }}>{Math.round(soundVolume * 100)}%</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="1" 
               step="0.01" 
               value={soundVolume} 
               onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
               style={{ width: "100%", accentColor: "#E2B714" }}
             />
           </div>
         )}
      </div>

    </div>
  );
}
