"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";

import { useConfig, FontSizeOption, CursorStyleOption } from "@/context/ConfigContext";
import { ArrowLeft, Check } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  
  const { fontSize, cursorStyle, stopOnError, setFontSize, setCursorStyle, setStopOnError } = useConfig();

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
            justifyContent: "space-between"
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

    </div>
  );
}
