"use client";

import { useState, useEffect } from "react";
import { ACHIEVEMENTS } from "@/lib/achievementStore";

let toastTrigger: (id: string) => void = () => {};

export const triggerAchievementToast = (id: string) => {
  toastTrigger(id);
};

export default function AchievementToast() {
  const [activeAchievement, setActiveAchievement] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastTrigger = (id: string) => {
      setActiveAchievement(id);
      setVisible(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };
  }, []);

  if (!activeAchievement) return null;

  const ach = ACHIEVEMENTS[activeAchievement];
  if (!ach) return null;

  return (
    <div 
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 1000,
        background: "var(--background)",
        color: "var(--foreground)",
        padding: "1.2rem",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        maxWidth: "350px",
        transform: visible ? "translateX(0) scale(1)" : "translateX(120%) scale(0.9)",
        opacity: visible ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        pointerEvents: visible ? "auto" : "none"
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>{ach.icon}</div>
      <div>
        <div style={{ fontSize: "0.7rem", color: "#2383E2", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Achievement Unlocked!
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, margin: "2px 0" }}>{ach.title}</div>
        <div style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", lineHeight: 1.3 }}>{ach.description}</div>
      </div>
    </div>
  );
}
