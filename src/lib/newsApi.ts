export interface NewsItem {
  id: string;
  title: string;
  description: string;
  language: "en" | "zh";
  text: string;
}

export async function fetchDailyNews(): Promise<NewsItem | null> {
  try {
    const apiKey = process.env.NEWSDATA_API_KEY;
    const url = apiKey 
      ? `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en,zh`
      : "https://newsdata.io/api/1/latest?apikey=pub_4aa247943855452ea452c518b66221bf&language=en,zh"; // Fallback if env not loaded
      
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      // Pick the first valid text
      for (const item of data.results) {
        if (item.title) {
          const text = item.description 
            ? `${item.title}. ${item.description}`
            : item.title;
          
          // detect basic language
          const isChinese = /[\u4e00-\u9fa5]/.test(text);
          return {
            id: item.article_id || Math.random().toString(),
            title: item.title,
            description: item.description || "",
            language: isChinese ? "zh" : "en",
            text: text,
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return null;
  }
}
