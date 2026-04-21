import { Entry } from "./mockData";

export type Difficulty = "EASY" | "NORMAL" | "HARD" | "TIMED" | number;

// REAL EXCERPTS (Real Texts) instead of random procedural gibberish.
const REAL_TEXTS = {
  en: [
    {
      title: "The Apollo Program",
      text: "The Apollo program, also known as Project Apollo, was the third United States human spaceflight program carried out by the National Aeronautics and Space Administration (NASA), which succeeded in preparing and landing the first humans on the Moon from 1968 to 1972. It was first conceived in 1960 during President Dwight D. Eisenhower's administration as a three-man spacecraft to follow the one-man Project Mercury, which put the first Americans in space. Apollo was later dedicated to President John F. Kennedy's national goal for the 1960s of landing a man on the Moon and returning him safely to the Earth."
    },
    {
      title: "Ancient Architecture",
      text: "Ancient architecture is the study of buildings and structures from the earliest civilizations. It encompasses a wide variety of styles and techniques, from the megalithic structures of the Neolithic period to the grand temples of Ancient Egypt and the classical orders of Greece and Rome. These structures were not only functional but also served as symbols of power, religion, and cultural identity, reflecting the social and technological advancements of their time."
    },
    {
      title: "Philosophy of Stoicism",
      text: "Stoicism is a school of Hellenistic philosophy founded by Zeno of Citium in Athens in the early 3rd century BC. It is a philosophy of personal ethics informed by its system of logic and its views on the natural world. According to its teachings, as social beings, the path to eudaimonia (happiness) is found in accepting the moment as it presents itself, by not allowing oneself to be controlled by the desire for pleasure or fear of pain, by using one's mind to understand the world and to do one's part in nature's plan, and by working together and treating others fairly and justly."
    },
    {
      title: "The Industrial Revolution",
      text: "The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, that occurred during the period from around 1760 to about 1820–1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system. The Industrial Revolution also led to an unprecedented rise in the rate of population growth."
    }
  ],
  zh: [
    {
      title: "相對論精華",
      text: "相對論是關於時空和引力的理論，主要由愛因斯坦創立，依其研究對象的不同可分為狹義相對論和廣義相對論。相對論和量子力學的提出給物理學帶來了革命性的變化，它們共同奠定了現代物理學的基礎。相對論極大地改變了人類對宇宙和自然的常識性觀念，提出了同時的相對性、四維時空、彎曲時空等全新的概念。不過近年來，人們對於物理理論的分類有了一種新的認識，以其理論是否是決定論的來劃分經典與非經典的物理學。"
    },
    {
      title: "量子力學基礎",
      text: "量子力學是物理學的一個分支，主要研究微觀世界的物理現象。它描述了原子及亞原子尺度的能量與物質的行為，與經典物理學有著顯著的不同。量子力學的一個核心概念是波粒二象性，即微觀粒子同時具有波動和粒子的特性。這一理論不僅解釋了原子的能階結構，也為現代電子學、雷射技術以及量子計算的發展奠定了基礎，深刻地改變了我們對自然界基本規律的理解。"
    },
    {
      title: "文藝復興的影響",
      text: "文藝復興是一場發生在14世紀至17世紀的文化運動，在中世紀晚期發源於佛羅倫斯，後擴充套件至歐洲各國。「文藝復興」一詞亦可粗略地指代這一歷史時期，但由於歐洲各地因其引發的變化的時間並不一致，故「文藝復興」邊緣期及歷史時代無明確界線。這場文化運動囊括了對古典文獻的重新學習，在透視法方面的全新繪畫技術發展，以及廣泛而富有創造力的藝術實踐。它被視為是中世紀時代與近代之間的過渡與橋樑。"
    },
    {
      title: "黑洞物理學",
      text: "黑洞是時空展現出極端強大的引力，以致於所有粒子、甚至光這樣的電磁輻射都不能逃逸的區域。廣義相對論預測，足夠緊密的質量可以扭曲時空，形成黑洞；不可能從該區域逃離的邊界稱為事件視界。雖然事件視界對穿越它的物體的命運和情況有巨大影響，但對該地區的觀測似乎未能探測到任何特徵。在許多方面，黑洞就像一個理想的黑體，它不反光。"
    }
  ]
};

export function getDailyChallenge(language: "en" | "zh"): Entry {
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const seed = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const corpus = REAL_TEXTS[language];
  const index = seed % corpus.length;
  const sourceRaw = corpus[index];
  
  const diff: Difficulty = language === "en" ? "NORMAL" : "HARD"; // Standardize difficulty for daily
  
  return generateText(language, diff, `Daily - ${sourceRaw.title}`);
}

export function generateText(language: "en" | "zh", diff: Difficulty, overrideTitle?: string): Entry {
  // Get the target corpus
  const corpus = REAL_TEXTS[language];
  const sourceRaw = corpus[Math.floor(Math.random() * corpus.length)];
  
  const textRaw = sourceRaw.text;

  let targetLength = typeof diff === "number" ? diff : (diff === "NORMAL" ? 100 : (diff === "HARD" ? 200 : (diff === "TIMED" ? 180 : 50)));
  
  if (language === "zh") {
     if (typeof diff === "number") targetLength = diff;
     else targetLength = diff === "EASY" ? 60 : diff === "NORMAL" ? 120 : (diff === "TIMED" ? 200 : 250);
  }
  
  // Try to find a real semantic chunk from the raw text matching approximate length
  let finalText = textRaw;
  
  if (language === "en") {
     const tokens = textRaw.split(/(?<=\. )/g); // Split by sentences
     let combined = "";
     for (const sentence of tokens) {
        if ((combined + sentence).split(" ").length > targetLength * 1.2) {
           if (combined.length === 0) combined = sentence;
           break;
        }
        combined += sentence;
     }
     finalText = combined.trim();
  } else {
     const tokens = textRaw.split(/(?<=[。！？])/g);
     let combined = "";
     for (const sentence of tokens) {
         if (combined.length + sentence.length > targetLength * 1.2) {
            if (combined.length === 0) combined = sentence;
            break;
         }
         combined += sentence;
     }
     finalText = combined.trim();
  }

  // Fallback to ensuring we don't return empty
  if (finalText.length < 5) finalText = sourceRaw.text;

  return {
    id: `auto-${Date.now()}`,
    title: overrideTitle && overrideTitle.trim() !== "每日隨機生成" && overrideTitle.trim() !== "" ? overrideTitle : sourceRaw.title,
    text: finalText,
    difficulty: diff === "NORMAL" ? "CORE" : typeof diff === "number" ? "CUSTOM" : diff,
    wordCount: language === "en" ? finalText.split(" ").length : finalText.length,
    source: "Historical Archive"
  };
}

export async function generateWikiText(language: "en" | "zh", diff: Difficulty, topic: string): Promise<Entry> {
  try {
    // Search for the topic
    const searchRes = await fetch(`https://${language}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&utf8=&format=json&origin=*`);
    const searchData = await searchRes.json();
    
    if (searchData.query && searchData.query.search && searchData.query.search.length > 0) {
      const bestTitle = searchData.query.search[0].title;
      // Fetch the page text extract
      const pageRes = await fetch(`https://${language}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(bestTitle)}&format=json&origin=*`);
      const pageData = await pageRes.json();
      
      const pages = pageData.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      
      if (page.extract && page.extract.length > 50) {
        // We got real text! Clean it up
        let rawText = page.extract.replace(/\n+/g, " ");
        // Send it through the slicing logic if needed or just return if it's small enough
        
        // Strip out brackets often found in wiki e.g., (listen), [1]
        rawText = rawText.replace(/\[[0-9]+\]/g, "");
        rawText = rawText.replace(/\(.*?\)/g, "").replace(/（.*?）/g, "");
        
        // Apply length constraints like local generator
        const targetLength = language === "zh" ? (diff === "EASY" ? 60 : diff === "NORMAL" ? 120 : 250) : (diff === "EASY" ? 50 : diff === "NORMAL" ? 100 : 200);
        
        let finalText = rawText;
        if (language === "en") {
          const tokens = rawText.split(/(?<=\. )/g);
          let combined = "";
          for (const sentence of tokens) {
            if ((combined + sentence).split(" ").length > targetLength * 1.5) {
              if (combined.length === 0) combined = sentence;
              break;
            }
            combined += sentence;
          }
          finalText = combined.trim();
        } else {
          const tokens = rawText.split(/(?<=[。！？])/g);
          let combined = "";
          for (const sentence of tokens) {
            if (combined.length + sentence.length > targetLength * 1.5) {
              if (combined.length === 0) combined = sentence;
              break;
            }
            combined += sentence;
          }
          finalText = combined.trim();
        }

        return {
          id: `wiki-${Date.now()}`,
          title: page.title,
          text: finalText,
          difficulty: diff === "NORMAL" ? "CORE" : typeof diff === "number" ? "CUSTOM" : diff,
          wordCount: language === "en" ? finalText.split(" ").length : finalText.length,
          source: `Wikipedia (${language.toUpperCase()})`
        };
      }
    }
    // Fallback appropriately if fetch empty
    return generateText(language, diff, topic);
  } catch (error) {
    console.error("Wikipedia API fetch failed:", error);
    return generateText(language, diff, topic);
  }
}
