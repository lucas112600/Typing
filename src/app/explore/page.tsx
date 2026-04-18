"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";

type Category1 = "ZH_CHINESE" | "EN_ENGLISH";
type Category2 = "NEWS_FEED" | "AI_FORGE" | "ARCHIVE";

interface Entry {
  id: string;
  difficulty: "EASY" | "HARD" | "CORE";
  title: string;
  wordCount: number;
  source: string;
  text: string;
}

const mockData: Record<Category1, Record<Category2, Entry[]>> = {
  ZH_CHINESE: {
    NEWS_FEED: [
      { id: "zh-n-1", difficulty: "EASY", title: "每日新聞", wordCount: 150, source: "NEWS API", text: "這是一則測試用的中文新聞內容，請嘗試在這篇文章中提高你的靈活度。" },
      { id: "zh-n-2", difficulty: "HARD", title: "深度報導：半導體發展", wordCount: 450, source: "TECH DAILY", text: "半導體產業在近年來迎來了巨大的轉變與挑戰..." }
    ],
    AI_FORGE: [],
    ARCHIVE: [
      { id: "zh-a-1", difficulty: "CORE", title: "出師表", wordCount: 400, source: "CLASSIC", text: "臣亮言：先帝創業未半，而中道崩殂..." }
    ]
  },
  EN_ENGLISH: {
    NEWS_FEED: [
      { id: "en-n-1", difficulty: "EASY", title: "Daily Briefing", wordCount: 100, source: "NEWS API", text: "Today's briefing includes updates from the financial sector. Markets closed higher today." },
      { id: "en-n-2", difficulty: "HARD", title: "AI Revolution", wordCount: 300, source: "TECH DAILY", text: "Artificial Intelligence has drastically reshaped the way engineers approach software architectural patterns." }
    ],
    AI_FORGE: [],
    ARCHIVE: [
      { id: "en-a-1", difficulty: "CORE", title: "Declaration of Independence", wordCount: 500, source: "CLASSIC", text: "When in the Course of human events, it becomes necessary for one people to dissolve the political bands..." }
    ]
  }
};

export default function ExplorePage() {
  const router = useRouter();
  const [cat1, setCat1] = useState<Category1>("ZH_CHINESE");
  const [cat2, setCat2] = useState<Category2>("NEWS_FEED");

  useEffect(() => {
    SystemLogPubSub.publish("SYS_EXPLORE_READY");
  }, []);

  const handleSelect = (entry: Entry) => {
    sessionStorage.setItem("typing_practice_data", JSON.stringify({
      id: entry.id,
      title: entry.title,
      description: "",
      language: cat1 === "ZH_CHINESE" ? "zh" : "en",
      text: entry.text,
    }));
    router.push("/practice");
  };

  const entries = mockData[cat1][cat2] || [];

  return (
    <div style={{ padding: "4rem", display: "flex", flexDirection: "column", height: "100%", fontWeight: 900 }}>
      {/* HEADER / NAVIGATION */}
      <div className="animate-step-in stagger-1" style={{ display: "flex", gap: "2rem", borderBottom: "2px solid var(--foreground)", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            className="brutal-invert"
            style={{ padding: "0.5rem 1rem", border: cat1 === "ZH_CHINESE" ? "1px solid var(--foreground)" : "1px solid transparent", opacity: cat1 === "ZH_CHINESE" ? 1 : 0.4 }}
            onClick={() => setCat1("ZH_CHINESE")}
          >
            [ ZH_CHINESE ]
          </button>
          <button 
             className="brutal-invert"
            style={{ padding: "0.5rem 1rem", border: cat1 === "EN_ENGLISH" ? "1px solid var(--foreground)" : "1px solid transparent", opacity: cat1 === "EN_ENGLISH" ? 1 : 0.4 }}
            onClick={() => setCat1("EN_ENGLISH")}
          >
            [ EN_ENGLISH ]
          </button>
        </div>
      </div>

      {/* SUB NAV */}
      <div className="animate-step-in stagger-2" style={{ display: "flex", gap: "1rem", marginBottom: "4rem" }}>
        {["NEWS_FEED", "AI_FORGE", "ARCHIVE"].map((c) => (
          <button
            key={c}
            className="brutal-invert"
            style={{
              padding: "0.5rem 1rem",
              textDecoration: cat2 === c ? "underline" : "none",
              textUnderlineOffset: "4px",
              opacity: cat2 === c ? 1 : 0.6
            }}
            onClick={() => setCat2(c as Category2)}
          >
            * {c}
          </button>
        ))}
      </div>

      {/* LIST OR FORGE */}
      <div className="animate-step-in stagger-3" style={{ flex: 1, overflowY: "auto" }}>
        {cat2 === "AI_FORGE" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
            <div style={{ fontSize: "1.5rem" }}>[ SYS_PROMPT_REQUIREMENT ]</div>
            <input 
              className="brutal-invert"
              style={{
                width: "100%",
                padding: "2rem",
                fontSize: "2rem",
                fontWeight: 900,
                border: "2px solid var(--foreground)",
                outline: "none"
              }}
              placeholder="ENTER GENERATION DIRECTIVES..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = e.currentTarget.value;
                  if (!val.trim()) return;
                  SystemLogPubSub.publish("GENERATING_NEURAL_TEXT...");
                  e.currentTarget.disabled = true;
                  setTimeout(() => {
                     e.currentTarget.disabled = false;
                     e.currentTarget.value = "";
                     SystemLogPubSub.publish("GENERATION_COMPLETE");
                     const genEntry: Entry = {
                       id: "forge-" + Date.now(),
                       difficulty: "HARD",
                       title: "FORGED: " + val.toUpperCase(),
                       wordCount: val.length * 3 + 100,
                       source: "NEURAL_NET",
                       text: cat1 === "ZH_CHINESE" ? `這是一段針對指令「${val}」生成的對應中文鍛鍊測試文本，請專注於你的每一次敲擊。` : `This is a generated testing document addressing the directive "${val}". Stay focused on every stroke.`
                     };
                     handleSelect(genEntry);
                  }, 1500);
                }
              }}
            />
            <div style={{ opacity: 0.5, letterSpacing: "2px" }}>PRESS ENTER TO INITIATE SYNTHESIS.</div>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ opacity: 0.5, letterSpacing: "2px" }}>// NO_DATA</div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry.id}
              className="brutal-invert"
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 100px 150px",
                padding: "1rem",
                borderBottom: "1px solid var(--foreground)",
                cursor: "pointer",
                alignItems: "center"
              }}
              onClick={() => handleSelect(entry)}
            >
              <div>[{entry.difficulty}]</div>
              <div>{entry.title}</div>
              <div style={{ textAlign: "right" }}>{entry.wordCount} W</div>
              <div style={{ textAlign: "right", opacity: 0.6 }}>{entry.source}</div>
            </div>
          ))
        )}
      </div>

      <div className="animate-step-in stagger-4" style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="brutal-invert" style={{ padding: "0.5rem 1rem", border: "1px solid var(--foreground)", opacity: 0.5 }} onClick={() => router.push("/")}>
          ← BACK
        </button>
        {cat2 !== "AI_FORGE" && entries.length > 0 && (
          <div style={{ letterSpacing: "4px", fontSize: "1.2rem" }}>
            [ 01 / 12 ]
          </div>
        )}
      </div>
    </div>
  );
}
