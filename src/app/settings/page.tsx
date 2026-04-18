"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";

import { useConfig, FontSizeOption, CursorStyleOption } from "@/context/ConfigContext";

export default function SettingsPage() {
  const router = useRouter();
  
  const { fontSize, cursorStyle, stopOnError, setFontSize, setCursorStyle, setStopOnError } = useConfig();

  useEffect(() => {
    SystemLogPubSub.publish("SYS_CONFIG");
  }, []);

  return (
    <div style={{ padding: "4rem", height: "100%", display: "flex", flexDirection: "column", zIndex: 10, position: "relative" }}>
      <div className="glass-panel animate-step-in stagger-1" style={{ padding: "1rem 2rem", marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="text-gradient-primary" style={{ fontSize: "1.8rem", fontWeight: 800 }}>
          CONTROL_PANEL
        </div>
        <button className="glass-button" style={{ padding: "0.5rem 1.5rem" }} onClick={() => router.push("/")}>
          ← RETURN HOME
        </button>
      </div>

      <div className="animate-step-in stagger-2" style={{ display: "flex", flexDirection: "column", gap: "2rem", flex: 1, maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        
        {/* OPTION = FONT */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div className="text-gradient" style={{ marginBottom: "1.5rem", fontWeight: 600, letterSpacing: "2px" }}>{"// TYPOGRAPHY_SCALE"}</div>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["MEDIUM", "LARGE", "EXTRA_LARGE"].map((size) => (
              <button
                key={size}
                className={`glass-button ${fontSize === size ? "active" : ""}`}
                style={{ padding: "1rem 2rem", flex: 1 }}
                onClick={() => setFontSize(size as FontSizeOption)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* OPTION = CURSOR */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div className="text-gradient" style={{ marginBottom: "1.5rem", fontWeight: 600, letterSpacing: "2px" }}>{"// CURSOR_STYLE"}</div>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["CROSSHAIR", "BLOCK", "LINE"].map((style) => (
              <button
                key={style}
                className={`glass-button ${cursorStyle === style ? "active" : ""}`}
                style={{ padding: "1rem 2rem", flex: 1 }}
                onClick={() => setCursorStyle(style as CursorStyleOption)}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* OPTION = ERROR */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div className="text-gradient" style={{ marginBottom: "1.5rem", fontWeight: 600, letterSpacing: "2px" }}>{"// ERROR_STOP_MODE"}</div>
          <button
            className={`glass-button ${stopOnError ? "danger active" : ""}`}
            style={{ padding: "1.2rem 2rem", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}
            onClick={() => setStopOnError(!stopOnError)}
          >
            <span>{stopOnError ? "STRICT MODE" : "NORMAL MODE"}</span>
            <span style={{ color: stopOnError ? "var(--foreground)" : "var(--foreground-muted)", fontWeight: 400 }}>
               {stopOnError ? "Engine will halt upon typo detection." : "Engine allows typos with error penalties."}
             </span>
          </button>
        </div>

      </div>
    </div>
  );
}
