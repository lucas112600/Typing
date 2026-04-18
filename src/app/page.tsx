import { fetchDailyNews } from "@/lib/newsApi";
import HomeInteraction from "@/components/HomeInteraction";

export default async function Home() {
  const newsItem = await fetchDailyNews();

  return (
    <main style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <HomeInteraction newsItem={newsItem} />
    </main>
  );
}
