"use client";

import { useRouter } from "next/navigation";
import { useConfig } from "@/context/ConfigContext";
import { translations } from "@/lib/i18n";
import { ArrowLeft, Clock, Zap, Globe, Layout, ShieldCheck } from "lucide-react";

export default function ChangelogPage() {
  const router = useRouter();
  const { uiLang } = useConfig();
  const t = translations[uiLang];

  const logs = [
    {
      version: "v1.2.0",
      date: "2026-04-20",
      type: "FEATURE",
      changes: uiLang === "en" ? [
        "Implemented adaptive i18n system (English/Chinese).",
        "Added global footer with contact information.",
        "Created version log and technical support room.",
        "Improved UI responsiveness and page transitions.",
        "Optimized PvP room stability."
      ] : [
        "實作適應性多國語言系統（中、英文）。",
        "新增全局頁尾與聯繫資訊。",
        "建立版本日誌與技術支援專區。",
        "優化 UI 響應速度與頁面轉換動畫。",
        "提升多人對戰房間穩定性。"
      ]
    },
    {
      version: "v1.1.5",
      date: "2026-04-19",
      type: "FIX",
      changes: uiLang === "en" ? [
        "Fixed WPM calculation for early session completion.",
        "Adjusted timed-mode text lengths based on duration.",
        "Resolved cursor synchronization issues in PvP rooms."
      ] : [
        "修正提前完成練習時的 WPM 計算邏輯。",
        "根據時間限制動態調整練習文章長度。",
        "解決多人模式中的游標同步問題。"
      ]
    },
    {
      version: "v1.1.0",
      date: "2026-04-18",
      type: "FEATURE",
      changes: uiLang === "en" ? [
        "Launched Alpha PvP Racing mode.",
        "Introduced Supabase Realtime for multiplayer sync.",
        "Added global Leaderboard tracking."
      ] : [
        "推出多人對戰 (Alpha) 模式。",
        "引入 Supabase Realtime 實現即時同步。",
        "新增全球排行榜追蹤系統。"
      ]
    }
  ];

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "800px" }}>
      
      <button className="app-button" onClick={() => router.push("/")} style={{ width: "fit-content", marginBottom: "2rem", color: "var(--foreground-muted)" }}>
         <ArrowLeft size={16} /> {t.back}
      </button>

      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>📜</div>
      <h1 className="notion-title">{t.version_log_title}</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        {t.update_list}
      </p>

      <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
        {logs.map((log) => (
          <div key={log.version} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
               <h2 className="notion-h2" style={{ margin: 0, border: "none", fontSize: "1.5rem" }}>{log.version}</h2>
               <span style={{ 
                 fontSize: "0.75rem", 
                 background: log.type === "FEATURE" ? "#2383E2" : "#9065B0", 
                 color: "white", 
                 padding: "2px 8px", 
                 borderRadius: "4px",
                 fontWeight: 700 
               }}>
                 {log.type}
               </span>
               <span style={{ fontSize: "0.85rem", color: "var(--foreground-muted)" }}>{log.date}</span>
            </div>
            
            <ul style={{ 
              listStyleType: "none", 
              paddingLeft: 0, 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.5rem" 
            }}>
              {log.changes.map((change, idx) => (
                <li key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                   <span style={{ color: "#2383E2", marginTop: "2px" }}>•</span>
                   <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: "6rem", 
        padding: "2rem", 
        background: "var(--surface-hover)", 
        borderRadius: "var(--radius)", 
        border: "1px solid var(--border)" 
      }}>
         <h3 className="notion-h3" style={{ marginTop: 0 }}>{t.contact_us}</h3>
         <p className="notion-p" style={{ fontSize: "0.9rem" }}>{t.feedback_msg}</p>
         <a href="mailto:huchialun97@gmail.com" style={{ 
           display: "inline-block", 
           marginTop: "1rem", 
           fontWeight: 600, 
           color: "#2383E2",
           textDecoration: "none"
         }}>
           huchialun97@gmail.com
         </a>
      </div>

    </div>
  );
}
