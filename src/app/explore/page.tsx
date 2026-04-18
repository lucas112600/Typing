"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import Logo from "@/components/Logo";
import { mockData, Category1, Category2, Entry } from "@/lib/mockData";

export default function ExplorePage() {
  const router = useRouter();
  const [cat1, setCat1] = useState<Category1>("ZH_CHINESE");
  const [cat2, setCat2] = useState<Category2>("NEWS_FEED");
  const [generating, setGenerating] = useState(false);

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

  const generateChineseAI = (prompt: string): Entry => {
    // Procedurally generated Chinese
    const starters = [
      `關於${prompt}的發展，`,
      `很多人認為${prompt}是一個有趣的議題。`,
      `隨著技術進步，${prompt}已經成為焦點。`,
      `探討${prompt}時，我們必須注意幾個關鍵。`
    ];
    const middles = [
      "首先，它深刻影響了我們的日常生活。不僅提高了效率，還改變了原有的模式。",
      "其次，這個現象在短期內會帶來許多挑戰，但也充滿著機遇。",
      "在各行各業中，這項改變都引發了廣泛的討論與實踐。",
      "此外，研究指出未來的趨勢將會更緊密地與此結合。"
    ];
    const ends = [
      "總結來說，我們需要保持開放的態度來迎接這些變化。",
      "因此，持續學習與適應將是下一個十年的必修課。",
      "這提醒著我們，在追求創新的同時也不應忽視潛在的風險。",
      "未來會如何發展，讓我們拭目以待。"
    ];
    
    // Deterministic selection based on prompt length and chars
    const hash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const start = starters[hash % starters.length];
    const mid1 = middles[(hash + 1) % middles.length];
    const mid2 = middles[(hash + 2) % middles.length];
    const end = ends[hash % ends.length];

    const generatedText = start + mid1 + mid2 + end;

    return {
      id: "forge-" + Date.now(),
      difficulty: "HARD",
      title: `生成的文本: ${prompt}`,
      wordCount: generatedText.length,
      source: "NEURAL_FORGE_PROCEDURAL",
      text: generatedText
    };
  };

  const generateEnglishAI = (prompt: string): Entry => {
    const starters = [
      `The evolution of ${prompt} has been remarkable.`,
      `Many experts consider ${prompt} to be a critical turning point.`,
      `When we look closely at ${prompt}, several patterns emerge.`
    ];
    const middles = [
      " First and foremost, the operational efficiency achieved is unparalleled. Industries are rapidly adapting to these new paradigms.",
      " Furthermore, the underlying technology offers tremendous opportunities, despite the obvious logistical hurdles.",
      " As adoption increases, the need for robust architectural frameworks becomes increasingly apparent."
    ];
    const ends = [
      " In conclusion, remaining agile will be key to navigating this landscape.",
      " Ultimately, this reminds us that innovation and security must go hand in hand.",
      " The coming years will undoubtedly reveal the true impact of these changes."
    ];

    const hash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const start = starters[hash % starters.length];
    const mid = middles[(hash + 1) % middles.length];
    const end = ends[hash % ends.length];

    const generatedText = start + mid + end;

    return {
      id: "forge-" + Date.now(),
      difficulty: "HARD",
      title: `SYNTHESIS: ${prompt}`,
      wordCount: generatedText.split(' ').length,
      source: "NEURAL_FORGE_PROCEDURAL",
      text: generatedText
    };
  };

  const entries = mockData[cat1][cat2] || [];

  return (
    <div style={{ padding: "4rem", display: "flex", flexDirection: "column", height: "100%", zIndex: 10, position: "relative" }}>
      {/* HEADER / NAVIGATION */}
      <div className="glass-panel animate-step-in stagger-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", marginBottom: "2rem" }}>
        <Logo size={42} />
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            className={`glass-button ${cat1 === "ZH_CHINESE" ? "active" : ""}`}
            style={{ padding: "0.5rem 1.5rem" }}
            onClick={() => setCat1("ZH_CHINESE")}
          >
            中文 ZH
          </button>
          <button 
             className={`glass-button ${cat1 === "EN_ENGLISH" ? "active" : ""}`}
            style={{ padding: "0.5rem 1.5rem" }}
            onClick={() => setCat1("EN_ENGLISH")}
          >
            English EN
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR SUB NAV */}
        <div className="glass-panel animate-step-in stagger-2" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem", width: "250px" }}>
          {["NEWS_FEED", "ARCHIVE", "AI_FORGE"].map((c) => (
            <button
              key={c}
              className={`glass-button ${cat2 === c ? "active" : ""}`}
              style={{
                padding: "1rem",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              onClick={() => setCat2(c as Category2)}
            >
              <span>{c.replace("_", " ")}</span>
              {cat2 === c && <span style={{ color: "var(--accent-secondary)" }}>●</span>}
            </button>
          ))}
          
          <div style={{ flex: 1 }} />
          <button className="glass-button" style={{ padding: "1rem", textAlign: "center" }} onClick={() => router.push("/")}>
            ← RETURN HOME
          </button>
        </div>

        {/* LIST OR FORGE */}
        <div className="glass-panel animate-step-in stagger-3" style={{ flex: 1, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <h2 className="text-gradient" style={{ fontSize: "1.5rem", marginBottom: "2rem", letterSpacing: "2px" }}>
             {"// " + cat2.replace("_", " ")}
          </h2>

          {cat2 === "AI_FORGE" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px", margin: "0 auto", width: "100%", flex: 1, justifyContent: "center" }}>
              <div className="text-gradient-primary" style={{ fontSize: "1.2rem", fontWeight: 600 }}>ENTER GENERATION DIRECTIVES:</div>
              <input 
                className="mono-text"
                disabled={generating}
                style={{
                  width: "100%",
                  padding: "1.5rem",
                  fontSize: "1.2rem",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "var(--foreground)",
                  outline: "none",
                  transition: "all 0.3s ease",
                  opacity: generating ? 0.5 : 1
                }}
                placeholder="e.g. Quantum Computing..."
                onFocus={(e) => e.target.style.borderColor = "var(--accent-secondary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = e.currentTarget.value;
                    if (!val.trim()) return;
                    setGenerating(true);
                    SystemLogPubSub.publish("GENERATING_NEURAL_TEXT...");
                    
                    setTimeout(() => {
                       setGenerating(false);
                       e.currentTarget.value = "";
                       SystemLogPubSub.publish("GENERATION_COMPLETE");
                       const genEntry = cat1 === "ZH_CHINESE" ? generateChineseAI(val) : generateEnglishAI(val);
                       handleSelect(genEntry);
                    }, 1200);
                  }
                }}
              />
              <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>{generating ? "Synthesizing text arrays..." : "Press ENTER to initiate synthesis engine."}</div>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
              <h2>NO DATA FOUND IN CLUSTER</h2>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {entries.map((entry) => (
                <div 
                  key={entry.id}
                  className="glass-button"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 100px 150px",
                    padding: "1.5rem",
                    alignItems: "center",
                    gap: "1rem",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => handleSelect(entry)}
                >
                  <div style={{ 
                    fontSize: "0.8rem", 
                    padding: "4px 8px", 
                    borderRadius: "4px",
                    background: entry.difficulty === "HARD" ? "rgba(239, 68, 68, 0.2)" : 
                               entry.difficulty === "CORE" ? "rgba(139, 92, 246, 0.2)" : "rgba(6, 182, 212, 0.2)",
                    color: entry.difficulty === "HARD" ? "var(--accent-danger)" : 
                           entry.difficulty === "CORE" ? "var(--accent-primary)" : "var(--accent-secondary)",
                    textAlign: "center",
                    fontWeight: 800
                  }}>
                    {entry.difficulty}
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{entry.title}</div>
                  <div style={{ color: "var(--foreground-muted)", fontSize: "0.9rem", textAlign: "right" }}>{entry.wordCount} W</div>
                  <div className="mono-text" style={{ color: "var(--foreground-muted)", fontSize: "0.8rem", textAlign: "right" }}>{entry.source}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
