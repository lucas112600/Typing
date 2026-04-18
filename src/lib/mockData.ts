export type Category1 = "ZH_CHINESE" | "EN_ENGLISH";
export type Category2 = "NEWS_FEED" | "ARCHIVE";

export interface Entry {
  id: string;
  difficulty: "EASY" | "HARD" | "CORE" | "CUSTOM" | string;
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
      { id: "zh-n-5", difficulty: "HARD", title: "量子計算的原理解析", wordCount: 205, source: "SCIENCE NOW", text: "量子計算利用量子力學中的疊加與量子糾纏特性，能夠在極短的時間內解決傳統電腦需要數千年才能運算完畢的複雜問題。這種突破性的計算能力將對密碼學、材料科學與新藥開發產生顛覆性的影響。目前的挑戰在於如何維持量子位元的穩定性並減少運作時的錯誤率。" },
      // New Entries Below
      { id: "zh-n-6", difficulty: "CORE", title: "半導體產業的下一個十年", wordCount: 130, source: "TECH TRENDS", text: "隨著莫爾定律逐漸面臨物理極限，半導體產業開始轉向先進封裝技術與三維積體電路設計。供應鏈的重組與地緣政治的影響，使各國競相扶植本土晶片製造能力，未來的競爭將不僅僅是製程節點的推進，更是生態系的全面對抗。" },
      { id: "zh-n-7", difficulty: "EASY", title: "電動車基礎設施普及", wordCount: 75, source: "AUTO NEWS", text: "政府宣布將在全國範圍內擴增三千個快速充電站。這項基礎設施升級計畫預計能大幅減輕電動車車主的里程焦慮，並加速燃油車輛的淘汰進程。" },
      { id: "zh-n-8", difficulty: "HARD", title: "遠距醫療與隱私挑戰", wordCount: 190, source: "MED JOURNAL", text: "後疫情時代，遠距醫療已成為常態。然而，大量的病患電子病歷在雲端傳輸的過程中，面臨著極大的網路安全風險。醫療機構必須導入零信任架構與端到端加密技術，確保患者隱私不受侵犯。同時，各國立法機構也正積極草擬針對數位醫療的個人資料保護法案，以期在便利性與資訊安全之間取得平衡。" },
      { id: "zh-n-9", difficulty: "CORE", title: "央行數位貨幣的試點", wordCount: 150, source: "FINANCE WEEK", text: "多國央行已正式啟動央行數位貨幣（CBDC）的零售試點。這將顯著降低跨境支付的成本與時間，並賦予政府更精細的貨幣政策操作工具。然而，如何防範系統性金融風險，以及保障使用者的消費隱私，仍是全面推廣前必須克服的重大難題。" },
      { id: "zh-n-10", difficulty: "EASY", title: "遠距工作的新平衡", wordCount: 60, source: "WORKPLACE", text: "許多企業逐漸過渡到混合辦公模式。員工每週在家工作兩天，其餘時間回辦公室進行跨部門協作。這不僅提升了員工滿意度，也降低了辦公室租賃成本。" }
    ],
    ARCHIVE: [
      { id: "zh-a-1", difficulty: "CORE", title: "出師表 (節錄)", wordCount: 120, source: "CLASSIC", text: "臣亮言：先帝創業未半，而中道崩殂。今天下三分，益州疲弊，此誠危急存亡之秋也。然侍衛之臣不懈於內，忠志之士忘身於外者，蓋追先帝之殊遇，欲報之於陛下也。" },
      { id: "zh-a-2", difficulty: "EASY", title: "春曉", wordCount: 20, source: "POETRY", text: "春眠不覺曉，處處聞啼鳥。夜來風雨聲，花落知多少。" },
      { id: "zh-a-3", difficulty: "HARD", title: "莊子·逍遙遊 (節錄)", wordCount: 154, source: "PHILOSOPHY", text: "北冥有魚，其名為鯤。鯤之大，不知其幾千里也。化而為鳥，其名為鵬。鵬之背，不知其幾千里也。怒而飛，其翼若垂天之雲。是鳥也，海運則將徙於南冥。南冥者，天池也。齊諧者，志怪者也。" },
      { id: "zh-a-4", difficulty: "CORE", title: "蘭亭集序 (節錄)", wordCount: 135, source: "CLASSIC", text: "永和九年，歲在癸丑，暮春之初，會於會稽山陰之蘭亭，修禊事也。群賢畢至，少長咸集。此地有崇山峻嶺，茂林修竹，又有清流激湍，映帶左右，引以為流觴曲水，列坐其次。" },
      { id: "zh-a-5", difficulty: "HARD", title: "岳陽樓記 (節錄)", wordCount: 148, source: "CLASSIC", text: "嗟夫！予嘗求古仁人之心，或異二者之為，何哉？不以物喜，不以己悲。居廟堂之高，則憂其民；處江湖之遠，則憂其君。是進亦憂，退亦憂。然則何時而樂耶？" },
      // New Entries Below
      { id: "zh-a-6", difficulty: "CORE", title: "論語·學而 (節錄)", wordCount: 100, source: "PHILOSOPHY", text: "子曰：「學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？」曾子曰：「吾日三省吾身：為人謀而不忠乎？與朋友交而不信乎？傳不習乎？」" },
      { id: "zh-a-7", difficulty: "EASY", title: "靜夜思", wordCount: 20, source: "POETRY", text: "床前明月光，疑是地上霜。舉頭望明月，低頭思故鄉。" },
      { id: "zh-a-8", difficulty: "HARD", title: "三國演義·卷一 (節錄)", wordCount: 180, source: "LITERATURE", text: "話說天下大勢，分久必合，合久必分。周末七國分爭，并入於秦；及秦滅之後，楚漢分爭，又并入於漢。漢朝自高祖斬白蛇而起義，一統天下，後來光武中興，傳至獻帝，遂分為三國。推其致亂之由，殆始於桓、靈二帝。桓帝禁錮善類，崇信宦官。及桓帝崩，靈帝即位，大將軍竇武、太傅陳蕃共相輔佐。" },
      { id: "zh-a-9", difficulty: "CORE", title: "孫子兵法·計篇 (節錄)", wordCount: 140, source: "MILITARY", text: "孫子曰：兵者，國之大事，死生之地，存亡之道，不可不察也。故經之以五事，校之以計，而索其情：一曰道，二曰天，三曰地，四曰將，五曰法。道者，令民與上同意，可與之死，可與之生，而不畏危也。" },
      { id: "zh-a-10", difficulty: "HARD", title: "紅樓夢·第一回 (節錄)", wordCount: 200, source: "LITERATURE", text: "此開卷第一回也。作者自云：因曾歷過一番夢幻之後，故將真事隱去，而借「通靈」之說，撰此《石頭記》一書也。故曰「甄士隱」云云。但書中所記何事何人？自又云：今風塵碌碌，一事無成，忽念及當日所有之女子，一一細考較去，覺其行止見識，皆出於我之上。何我堂堂鬚眉，誠不若彼裙釵哉？實愧則有餘，悔又無益之大無可如何之日也。" }
    ]
  },
  EN_ENGLISH: {
    NEWS_FEED: [
      { id: "en-n-1", difficulty: "EASY", title: "Morning Market Brief", wordCount: 45, source: "NEWS API", text: "Stocks opened higher this morning as tech companies led the rally. Analysts expect the positive momentum to continue into the afternoon session as new economic data comes in." },
      { id: "en-n-2", difficulty: "HARD", title: "The Architecture of AI", wordCount: 82, source: "TECH DAILY", text: "Artificial Intelligence has drastically reshaped software architectural patterns. Modern distributed systems now incorporate neural networks directly into their request pipelines, requiring engineers to balance latency, massive data throughput, and complex asynchronous state management across globally distributed microservices." },
      { id: "en-n-3", difficulty: "CORE", title: "Space Exploration Update", wordCount: 65, source: "GLOBAL POST", text: "The recent successful launch of the new heavy-lift rocket marks a significant milestone in commercial spaceflight. The mission successfully deployed a constellation of observation satellites into low Earth orbit." },
      { id: "en-n-4", difficulty: "EASY", title: "Coffee Consumption Study", wordCount: 48, source: "HEALTH WEEKLY", text: "A new study indicates that moderate coffee consumption may be linked to improved long-term cognitive health. Researchers found that drinking two to three cups daily could offer neuroprotective benefits." },
      { id: "en-n-5", difficulty: "HARD", title: "Cryptographic Security", wordCount: 78, source: "SCIENCE NOW", text: "As quantum computing continues to advance, traditional RSA encryption methods face imminent obsolescence. Security researchers are urgently developing Post-Quantum Cryptography algorithms based on lattice structures and isogenies to ensure that encrypted communications remain secure against future computational threats." },
      // New Entries Below
      { id: "en-n-6", difficulty: "CORE", title: "Renewable Energy Transition", wordCount: 70, source: "ENERGY NOW", text: "The shift towards renewable energy sources has accelerated globally. Solar and wind infrastructure projects are receiving record investments, drastically reducing the reliance on fossil fuels. Experts warn that grid modernization must keep pace to handle the variable energy loads." },
      { id: "en-n-7", difficulty: "EASY", title: "Smartphone Battery Tech", wordCount: 40, source: "GADGETS", text: "New solid-state battery technology promises to double smartphone battery life while reducing charging times by half. Commercial devices utilizing this tech are expected next year." },
      { id: "en-n-8", difficulty: "HARD", title: "Macroeconomic Soft Landing", wordCount: 95, source: "ECONOMY", text: "Federal Reserve officials expressed cautious optimism regarding the possibility of achieving a soft landing for the economy. By carefully calibrating interest rate adjustments, policy makers aim to curb stubborn inflation without triggering a widespread recession. However, unpredictable geopolitical tensions and fluctuating energy prices remain significant variables that could easily derail the current trajectory." },
      { id: "en-n-9", difficulty: "CORE", title: "Ocean Cleanup Progress", wordCount: 60, source: "ENVIRONMENT", text: "Non-profit organizations have successfully extracted millions of pounds of plastic waste from the Pacific Ocean this year. Upgraded collection systems now operate autonomously, using advanced machine learning models to identify high-density trash accumulation zones efficiently." },
      { id: "en-n-10", difficulty: "EASY", title: "Dietary Fiber Limits", wordCount: 35, source: "HEALTH", text: "Nutritionists are advising the public to slowly increase their dietary fiber intake to avoid temporary digestive discomfort. Staying adequately hydrated is highly recommended during this transition." }
    ],
    ARCHIVE: [
      { id: "en-a-1", difficulty: "CORE", title: "Declaration of Independence", wordCount: 71, source: "CLASSIC", text: "When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them." },
      { id: "en-a-2", difficulty: "EASY", title: "To Be or Not To Be", wordCount: 55, source: "LITERATURE", text: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them." },
      { id: "en-a-3", difficulty: "HARD", title: "The Great Gatsby", wordCount: 84, source: "CLASSIC", text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.' He didn't say any more, but we've always been unusually communicative in a reserved way." },
      { id: "en-a-4", difficulty: "CORE", title: "1984 (Opening)", wordCount: 42, source: "LITERATURE", text: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions." },
      { id: "en-a-5", difficulty: "HARD", title: "Walden", wordCount: 79, source: "PHILOSOPHY", text: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived. I did not wish to live what was not life, living is so dear; nor did I wish to practise resignation, unless it was quite necessary." },
      // New Entries Below
      { id: "en-a-6", difficulty: "CORE", title: "Frankenstein", wordCount: 65, source: "LITERATURE", text: "I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had filled several public situations with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business." },
      { id: "en-a-7", difficulty: "EASY", title: "Moby Dick", wordCount: 45, source: "LITERATURE", text: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world." },
      { id: "en-a-8", difficulty: "HARD", title: "Pride and Prejudice", wordCount: 88, source: "LITERATURE", text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters." },
      { id: "en-a-9", difficulty: "CORE", title: "A Tale of Two Cities", wordCount: 50, source: "CLASSIC", text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness." },
      { id: "en-a-10", difficulty: "HARD", title: "Meditations (Marcus Aurelius)", wordCount: 75, source: "PHILOSOPHY", text: "Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil. But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, can neither be injured by any of them." }
    ]
  }
};
