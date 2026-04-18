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

export const appendStat = (stat: StatSession) => {
  if (typeof window === "undefined") return;
  const current = getStats();
  current.push(stat);
  // Keep only the last 30 sessions to prevent overgrown local storage
  if (current.length > 30) current.shift();
  localStorage.setItem("TYPING_STATS", JSON.stringify(current));
};
