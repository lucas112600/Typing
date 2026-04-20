"use client";

import { useEffect, useState } from "react";

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

const SPECIAL_KEYS: Record<string, string> = {
  " ": "Space",
  "Backspace": "退格",
  "Enter": "回車",
  "Shift": "Shift",
  "Tab": "Tab",
  "CapsLock": "Caps",
};

export default function VirtualKeyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        // Normalize key to match our ROWS or SPECIAL_KEYS
        const key = e.key.toLowerCase();
        // For special keys, we might want the exact name or e.key
        next.add(e.key === " " ? " " : e.key);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key === " " ? " " : e.key);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const isPressed = (key: string) => {
    // Check if key or lowercase key is in the set
    return pressedKeys.has(key) || Array.from(pressedKeys).some(k => k.toLowerCase() === key.toLowerCase());
  };

  const renderKey = (key: string, width: string = "45px") => {
    const active = isPressed(key);
    const label = SPECIAL_KEYS[key] || key.toUpperCase();

    return (
      <div 
        key={key}
        style={{
          width,
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          background: active ? "#2383E2" : "var(--bg-secondary)",
          color: active ? "#fff" : "var(--foreground)",
          fontSize: "0.85rem",
          fontWeight: 600,
          transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: active ? "0 0 10px rgba(35, 131, 226, 0.4)" : "none",
          transform: active ? "translateY(2px)" : "none",
          userSelect: "none"
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="virtual-keyboard animate-fade-in" style={{ 
      marginTop: "4rem", 
      padding: "2rem",
      background: "rgba(0,0,0,0.02)",
      borderRadius: "16px",
      border: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      alignItems: "center",
      width: "fit-content",
      margin: "4rem auto 0 auto"
    }}>
      
      {/* Row 1 */}
      <div style={{ display: "flex", gap: "8px" }}>
        {renderKey("Tab", "60px")}
        {ROWS[0].map(k => renderKey(k))}
        {renderKey("Backspace", "80px")}
      </div>

      {/* Row 2 */}
      <div style={{ display: "flex", gap: "8px" }}>
        {renderKey("CapsLock", "75px")}
        {ROWS[1].map(k => renderKey(k))}
        {renderKey("Enter", "95px")}
      </div>

      {/* Row 3 */}
      <div style={{ display: "flex", gap: "8px" }}>
        {renderKey("Shift", "110px")}
        {ROWS[2].map(k => renderKey(k))}
        {renderKey("Shift", "110px")}
      </div>

      {/* Row 4 (Space) */}
      <div style={{ display: "flex", gap: "8px" }}>
        {renderKey(" ", "360px")}
      </div>

    </div>
  );
}
