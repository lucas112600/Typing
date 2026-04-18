"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";

import { useConfig, FontSizeOption, CursorStyleOption } from "@/context/ConfigContext";
import { ArrowLeft, Settings as SettingsIcon, Type, MousePointer2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  
  const { fontSize, cursorStyle, stopOnError, setFontSize, setCursorStyle, setStopOnError } = useConfig();

  useEffect(() => {
    SystemLogPubSub.publish("SYS_CONFIG");
  }, []);

  return (
    <div style={{ padding: "4rem 2rem", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <header className="animate-fade-in stagger-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <SettingsIcon color="var(--accent-primary)" /> Application Settings
          </h1>
          <p style={{ color: "var(--foreground-muted)" }}>Customize your typing experience constraints.</p>
        </div>
        <button className="app-button" style={{ padding: "0.5rem 1.5rem" }} onClick={() => router.push("/")}>
          <ArrowLeft size={16} /> Dashboard
        </button>
      </header>

      <div className="animate-fade-in stagger-2" style={{ display: "flex", flexDirection: "column", gap: "2rem", flex: 1, width: "100%" }}>
        
        {/* OPTION = FONT */}
        <div className="app-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Type size={20} color="var(--foreground-muted)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Typography Scale</h2>
          </div>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Adjust the font size of the typing container text.</p>
          
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {["MEDIUM", "LARGE", "EXTRA_LARGE"].map((size) => (
              <button
                key={size}
                className={`app-button ${fontSize === size ? "primary" : ""}`}
                style={{ padding: "0.75rem 1.5rem", flex: "1 1 120px" }}
                onClick={() => setFontSize(size as FontSizeOption)}
              >
                {size.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* OPTION = CURSOR */}
        <div className="app-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <MousePointer2 size={20} color="var(--foreground-muted)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Cursor Style</h2>
          </div>
           <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>Change the global mouse cursor appearance.</p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {["CROSSHAIR", "BLOCK", "LINE"].map((style) => (
              <button
                key={style}
                className={`app-button ${cursorStyle === style ? "primary" : ""}`}
                style={{ padding: "0.75rem 1.5rem", flex: "1 1 120px" }}
                onClick={() => setCursorStyle(style as CursorStyleOption)}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* OPTION = ERROR */}
        <div className="app-card" style={{ padding: "2rem" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <AlertTriangle size={20} color={stopOnError ? "var(--accent-danger)" : "var(--foreground-muted)"} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Strict Mode</h2>
          </div>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>When enabled, the engine will block further input until previous typos are corrected.</p>

          <button
            className={`app-button ${stopOnError ? "danger active" : ""}`}
            style={{ padding: "1rem 1.5rem", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            onClick={() => setStopOnError(!stopOnError)}
          >
            <span style={{ fontWeight: 600 }}>{stopOnError ? "Strict Mode Enabled" : "Normal Mode"}</span>
            <span style={{ color: stopOnError ? "#FFFFFF" : "var(--foreground-muted)", fontSize: "0.85rem", fontWeight: 400 }}>
               Toggle Constraint
             </span>
          </button>
        </div>

      </div>
      
      {/* Spacer */}
      <div style={{ height: "80px" }} />
    </div>
  );
}
