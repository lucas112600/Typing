import { Entry } from "./mockData";

export type Difficulty = "EASY" | "NORMAL" | "HARD";

export const generateText = (language: "en" | "zh", difficulty: Difficulty, customPrompt?: string): Entry => {
  const prompt = customPrompt || (language === "zh" ? "自動生成主題" : "Auto-Generated Topic");
  const hash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now();

  if (language === "zh") {
    return generateChineseAI(prompt, difficulty, hash);
  } else {
    return generateEnglishAI(prompt, difficulty, hash);
  }
};

const generateChineseAI = (prompt: string, difficulty: Difficulty, hash: number): Entry => {
  const starters = [
    `在探討${prompt}的過程中，我們能發現許多有趣的現象。`,
    `今天想和大家分享關於${prompt}的一些想法。`,
    `隨著社會發展，${prompt}已經成為了不可忽視的焦點。`,
    `如果你對${prompt}感興趣，那這篇文章值得一看。`
  ];

  const middlesEASY = [
    "它讓生活變得更簡單。每天看到進步，都讓人很開心。",
    "有時候，簡單的改變就能帶來很大的影響。",
    "大家都在學著適應，這其實不難。"
  ];
  
  const middlesNORMAL = [
    "首先，這不僅僅是工具的替換，而是思維方式的轉折。我們必須學會與新事物協作。",
    "從歷史的角度來看，每一次技術革新都會帶來短暫的陣痛期，但長期而言會帶來龐大效益。",
    "這項改變在各行各業中都引發了廣泛的討論，實踐的過程中雖然遇挫，卻也收穫豐富。"
  ];

  const middlesHARD = [
    "從宏觀經濟學的角度切入，其演進對全球供應鏈產生了不可逆轉的結構性改變。分散式架構與去中心化思維在此扮演了催化劑的角色。",
    "量子計算與神經網路的交叉應用正在重塑這個領域的邊界。研究人員在解決演算法收斂性問題時，經常需要藉助高維向量空間的正交特性。",
    "我們必須謹慎考慮其伴隨的倫理風險。正如傅柯在權力論述中所言，知識體系的建構往往隱藏著未被察覺的規訓機制。盲目追求效率而忽略人文底蘊，將導致文明的失衡。"
  ];

  const ends = [
    "總而言之，保持開放的心態是最重要的。",
    "未來的發展充滿無限可能，讓我們拭目以待。",
    "希望這能給你帶來一些不一樣的啟發。"
  ];

  const start = starters[hash % starters.length];
  const end = ends[hash % ends.length];

  let body = "";
  if (difficulty === "EASY") {
    body = middlesEASY[hash % middlesEASY.length];
  } else if (difficulty === "NORMAL") {
     body = middlesNORMAL[(hash + 1) % middlesNORMAL.length] + middlesNORMAL[(hash + 2) % middlesNORMAL.length];
  } else {
     body = middlesNORMAL[(hash + 1) % middlesNORMAL.length] + middlesHARD[(hash + 3) % middlesHARD.length] + middlesHARD[(hash + 4) % middlesHARD.length];
  }

  const generatedText = start + body + end;

  return {
    id: "gen-" + Date.now(),
    difficulty: difficulty === "NORMAL" ? "CORE" : difficulty,
    title: `隨機生成: ${difficulty}`,
    wordCount: generatedText.length,
    source: "NEURAL_FORGE_PROCEDURAL",
    text: generatedText
  };
};


const generateEnglishAI = (prompt: string, difficulty: Difficulty, hash: number): Entry => {
  const starters = [
    `The evolution of ${prompt} has been remarkable to witness. `,
    `When approaching ${prompt}, we must keep an open mind. `,
    `Recent studies suggest that ${prompt} is gaining momentum. `
  ];

  const middlesEASY = [
    "It is very easy to use and helps us a lot. ",
    "Many people like it because it saves time. ",
    "Just keep trying and you will see the results. "
  ];
  
  const middlesNORMAL = [
    "Furthermore, the operational efficiency achieved is unparalleled. Industries are rapidly adapting to these new tools and enjoying the benefits. ",
    "While the initial learning curve can be steep, the overall trajectory points towards massive productivity gains. ",
    "It shifts the paradigm from traditional methods to a more dynamic, responsive framework entirely. "
  ];

  const middlesHARD = [
    "Simultaneously, the integration of isomorphic architectures and distributed ledger networks exacerbates the complexity of concurrent state management. ",
    "Developers must wrestle with asymptotic complexities and algorithmic bottlenecks to ensure low-latency throughput across disparate microservices. ",
    "The deterministic nature of classical mechanics is being challenged here, introducing stochastic variables that fundamentally disrupt canonical predictive models. "
  ];

  const ends = [
    "In conclusion, remaining agile is the key to success.",
    "Ultimately, only time will tell how this plays out.",
    "In the end, innovation always finds a way forward."
  ];

  const start = starters[hash % starters.length];
  const end = ends[hash % ends.length];

  let body = "";
  if (difficulty === "EASY") {
    body = middlesEASY[hash % middlesEASY.length];
  } else if (difficulty === "NORMAL") {
     body = middlesNORMAL[(hash + 1) % middlesNORMAL.length] + middlesNORMAL[(hash + 2) % middlesNORMAL.length];
  } else {
     body = middlesNORMAL[(hash + 1) % middlesNORMAL.length] + middlesHARD[(hash + 3) % middlesHARD.length] + middlesHARD[(hash + 4) % middlesHARD.length];
  }

  const generatedText = start + body + end;

  return {
    id: "gen-" + Date.now(),
    difficulty: difficulty === "NORMAL" ? "CORE" : difficulty,
    title: `Synthesis: ${difficulty}`,
    wordCount: generatedText.split(' ').length,
    source: "NEURAL_FORGE_PROCEDURAL",
    text: generatedText
  };
};
