import { supabase } from "./supabase";

export interface StatSession {
  date: string;
  wpm: number;
  accuracy: number;
}

export const getStats = (): StatSession[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("TYPING_STATS");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Appends a stat session to local storage and optionally syncs with Supabase if userId is provided.
 */
export const appendStat = async (stat: StatSession, userId?: string) => {
  if (typeof window === "undefined") return;
  
  // Local storage backup
  const current = getStats();
  current.push(stat);
  if (current.length > 50) current.shift();
  localStorage.setItem("TYPING_STATS", JSON.stringify(current));

  // Remote sync if authenticated
  if (userId) {
    try {
      await supabase.from("typing_stats").insert({
        user_id: userId,
        wpm: stat.wpm,
        accuracy: stat.accuracy,
        created_at: stat.date
      });
    } catch (err) {
      console.error("Failed to sync stat to Supabase:", err);
    }
  }
};

/**
 * Fetches real stats from Supabase for a specific user.
 */
export const fetchRealStats = async (userId: string): Promise<StatSession[]> => {
  const { data, error } = await supabase
    .from("typing_stats")
    .select("wpm, accuracy, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching real stats:", error);
    return [];
  }

  return data.map(d => ({
    date: d.created_at,
    wpm: d.wpm,
    accuracy: d.accuracy
  }));
};
