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
    <div style={{ padding: "4rem", height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="animate-step-in stagger-1" style={{ fontSize: "2rem", fontWeight: 900, borderBottom: "2px solid var(--foreground)", paddingBottom: "1rem", marginBottom: "3rem" }}>
        [ CONTROL_PANEL ]
      </div>

      <div className="animate-step-in stagger-2" style={{ display: "flex", flexDirection: "column", gap: "3rem", flex: 1, maxWidth: "600px" }}>
        
        {/* OPTION = FONT */}
        <div>
          <div style={{ marginBottom: "1rem", fontWeight: 900, letterSpacing: "2px" }}># TYPOGRAPHY_SCALE</div>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["MEDIUM", "LARGE", "EXTRA_LARGE"].map((size) => (
              <button
                key={size}
                className="brutal-invert"
                style={{
                  padding: "0.5rem 1rem",
                  border: fontSize === size ? "2px solid var(--foreground)" : "1px solid var(--foreground)",
                  opacity: fontSize === size ? 1 : 0.5,
                  fontWeight: 900
                }}
                onClick={() => setFontSize(size as FontSizeOption)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* OPTION = CURSOR */}
        <div>
          <div style={{ marginBottom: "1rem", fontWeight: 900, letterSpacing: "2px" }}># CURSOR_STYLE</div>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["CROSSHAIR", "BLOCK", "LINE"].map((style) => (
              <button
                key={style}
                className="brutal-invert"
                style={{
                  padding: "0.5rem 1rem",
                  border: cursorStyle === style ? "2px solid var(--foreground)" : "1px solid var(--foreground)",
                  opacity: cursorStyle === style ? 1 : 0.5,
                  fontWeight: 900
                }}
                onClick={() => setCursorStyle(style as CursorStyleOption)}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* OPTION = ERROR */}
        <div>
          <div style={{ marginBottom: "1rem", fontWeight: 900, letterSpacing: "2px" }}># ERROR_STOP_MODE</div>
          <button
            className={stopOnError ? "brutal-invert-red" : "brutal-invert"}
            style={{
              padding: "1rem 2rem",
              border: "1px solid var(--foreground)",
              fontWeight: 900,
              width: "100%",
              textAlign: "left"
            }}
            onClick={() => setStopOnError(!stopOnError)}
          >
            {stopOnError ? "[ ENABLED ] - STRICT MODE" : "[ DISABLED ] - NORMAL MODE"}
          </button>
        </div>

      </div>

      <div className="animate-step-in stagger-3" style={{ marginTop: "2rem", opacity: 0.5 }}>
        <button className="brutal-invert" style={{ padding: "0.5rem 1rem", border: "1px solid var(--foreground)" }} onClick={() => router.push("/")}>
          ← BACK
        </button>
      </div>
    </div>
  );
}
