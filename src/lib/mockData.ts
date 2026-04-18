export type Category1 = "ZH_CHINESE" | "EN_ENGLISH";
export type Category2 = "NEWS_FEED" | "AI_FORGE" | "ARCHIVE";

export interface Entry {
  id: string;
  difficulty: "EASY" | "HARD" | "CORE";
  title: string;
  wordCount: number;
  source: string;
  text: string;
}

export const mockData: Record<Category1, Record<Category2, Entry[]>> = {
  ZH_CHINESE: {
    NEWS_FEED: [
      { id: "zh-n-1", difficulty: "EASY", title: "晨間新聞簡報", wordCount: 95, source: "NEWS API", text: "今日股市開盤走高，科技類股領先大盤。專家預期本週經濟數據將持續顯示穩定的增長跡象，建議投資者關注後續發展與新興市場動態。" },
      { id: "zh-n-2", difficulty: "HARD", title: "生成式 AI 與設計的未來", wordCount: 182, source: "TECH DAILY", text: "生成式人工智慧正在改變創意產業的運作方式。從自動生成的使用者介面到高度客製化的使用者體驗，設計師現在必須學會與演算法協作。這不僅僅是工具的替換，更是設計思維的典範轉移。未來，擁有程式概念與美學基礎的跨領域人才將會是市場上最搶手的資源。" },
      { id: "zh-n-3", difficulty: "CORE", title: "氣候變遷最新報告", wordCount: 145, source: "GLOBAL POST", text: "最新的聯合國氣候變遷報告指出，全球暖化速度已超過預期。各國政府必須立即採取更積極的減碳措施，以避免不可逆轉的生態浩劫。能源轉型與永續發展將是下個十年的核心議題。" },
      { id: "zh-n-4", difficulty: "EASY", title: "健康生活：規律運動", wordCount: 88, source: "HEALTH WEEKLY", text: "保持規律的運動習慣不僅能增強免疫力，還能有效減輕心理壓力。專家建議每天至少進行三十分鐘的中等強度運動，幫助身心維持在最佳狀態。" },
      { id: "zh-n-5", difficulty: "HARD", title: "量子計算的原理解析", wordCount: 205, source: "SCIENCE NOW", text: "量子計算利用量子力學中的疊加與量子糾纏特性，能夠在極短的時間內解決傳統電腦需要數千年才能運算完畢的複雜問題。這種突破性的計算能力將對密碼學、材料科學與新藥開發產生顛覆性的影響。目前的挑戰在於如何維持量子位元的穩定性並減少運作時的錯誤率。" }
    ],
    AI_FORGE: [],
    ARCHIVE: [
      { id: "zh-a-1", difficulty: "CORE", title: "出師表 (節錄)", wordCount: 120, source: "CLASSIC", text: "臣亮言：先帝創業未半，而中道崩殂。今天下三分，益州疲弊，此誠危急存亡之秋也。然侍衛之臣不懈於內，忠志之士忘身於外者，蓋追先帝之殊遇，欲報之於陛下也。" },
      { id: "zh-a-2", difficulty: "EASY", title: "春曉", wordCount: 20, source: "POETRY", text: "春眠不覺曉，處處聞啼鳥。夜來風雨聲，花落知多少。" },
      { id: "zh-a-3", difficulty: "HARD", title: "莊子·逍遙遊 (節錄)", wordCount: 154, source: "PHILOSOPHY", text: "北冥有魚，其名為鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。鵬之背，不知其幾千里也。怒而飛，其翼若垂天之雲。是鳥也，海運則將徙於南冥。南冥者，天池也。齊諧者，志怪者也。" },
      { id: "zh-a-4", difficulty: "CORE", title: "蘭亭集序 (節錄)", wordCount: 135, source: "CLASSIC", text: "永和九年，歲在癸丑，暮春之初，會於會稽山陰之蘭亭，修禊事也。群賢畢至，少長咸集。此地有崇山峻嶺，茂林修竹，又有清流激湍，映帶左右，引以為流觴曲水，列坐其次。" },
      { id: "zh-a-5", difficulty: "HARD", title: "岳陽樓記 (節錄)", wordCount: 148, source: "CLASSIC", text: "嗟夫！予嘗求古仁人之心，或異二者之為，何哉？不以物喜，不以己悲。居廟堂之高，則憂其民；處江湖之遠，則憂其君。是進亦憂，退亦憂。然則何時而樂耶？" }
    ]
  },
  EN_ENGLISH: {
    NEWS_FEED: [
      { id: "en-n-1", difficulty: "EASY", title: "Morning Market Brief", wordCount: 45, source: "NEWS API", text: "Stocks opened higher this morning as tech companies led the rally. Analysts expect the positive momentum to continue into the afternoon session as new economic data comes in." },
      { id: "en-n-2", difficulty: "HARD", title: "The Architecture of AI", wordCount: 82, source: "TECH DAILY", text: "Artificial Intelligence has drastically reshaped software architectural patterns. Modern distributed systems now incorporate neural networks directly into their request pipelines, requiring engineers to balance latency, massive data throughput, and complex asynchronous state management across globally distributed microservices." },
      { id: "en-n-3", difficulty: "CORE", title: "Space Exploration Update", wordCount: 65, source: "GLOBAL POST", text: "The recent successful launch of the new heavy-lift rocket marks a significant milestone in commercial spaceflight. The mission successfully deployed a constellation of observation satellites into low Earth orbit." },
      { id: "en-n-4", difficulty: "EASY", title: "Coffee Consumption Study", wordCount: 48, source: "HEALTH WEEKLY", text: "A new study indicates that moderate coffee consumption may be linked to improved long-term cognitive health. Researchers found that drinking two to three cups daily could offer neuroprotective benefits." },
      { id: "en-n-5", difficulty: "HARD", title: "Cryptographic Security", wordCount: 78, source: "SCIENCE NOW", text: "As quantum computing continues to advance, traditional RSA encryption methods face imminent obsolescence. Security researchers are urgently developing Post-Quantum Cryptography algorithms based on lattice structures and isogenies to ensure that encrypted communications remain secure against future computational threats." }
    ],
    AI_FORGE: [],
    ARCHIVE: [
      { id: "en-a-1", difficulty: "CORE", title: "Declaration of Independence", wordCount: 71, source: "CLASSIC", text: "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them." },
      { id: "en-a-2", difficulty: "EASY", title: "To Be or Not To Be", wordCount: 55, source: "LITERATURE", text: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them." },
      { id: "en-a-3", difficulty: "HARD", title: "The Great Gatsby (Excerpt)", wordCount: 84, source: "CLASSIC", text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.' He didn't say any more, but we've always been unusually communicative in a reserved way." },
      { id: "en-a-4", difficulty: "CORE", title: "1984 (Opening)", wordCount: 42, source: "LITERATURE", text: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions." },
      { id: "en-a-5", difficulty: "HARD", title: "Walden (Excerpt)", wordCount: 79, source: "PHILOSOPHY", text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived. I did not wish to live what was not life, living is so dear; nor did I wish to practise resignation, unless it was quite necessary." }
    ]
  }
};
