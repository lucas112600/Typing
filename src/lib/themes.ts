export interface ThemeText {
  id: string;
  title: string;
  text: string;
  language: "en" | "zh";
  category: "LITERATURE" | "TECH" | "QUOTES" | "POETRY";
}

export const THEME_PACKS: ThemeText[] = [
  {
    id: "lit-1",
    category: "LITERATURE",
    title: "Moby Dick",
    language: "en",
    text: "Call me Ishmael. Some years ago - never mind how long precisely - having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world."
  },
  {
    id: "tech-1",
    category: "TECH",
    title: "React Hook",
    language: "en",
    text: "useCallback(async () => { const { data } = await supabase.from('leaderboards').select('*').order('wpm', { ascending: false }).limit(10); if (data) setLeaderboard(data); }, []);"
  },
  {
    id: "quote-1",
    category: "QUOTES",
    title: "Steve Jobs",
    language: "en",
    text: "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking."
  },
  {
    id: "poetry-1",
    category: "POETRY",
    title: "The Road Not Taken",
    language: "en",
    text: "Two roads diverged in a yellow wood, And sorry I could not travel both And be one traveler, long I stood And looked down one as far as I could To where it bent in the undergrowth."
  },
  {
    id: "zh-1",
    category: "LITERATURE",
    title: "背影",
    language: "zh",
    text: "我與父親不相見已有二年餘了，我最不能忘記的是他的背影。那年冬天，祖母死了，父親的差使也交卸了，正是禍不單行的日子。"
  },
  {
    id: "tech-js",
    category: "TECH",
    title: "JavaScript Async",
    language: "en",
    text: "async function fetchData(url) { try { const response = await fetch(url); return await response.json(); } catch (error) { console.error('Error:', error); } }"
  }
];

export const getThemeById = (id: string) => THEME_PACKS.find(t => t.id === id) || THEME_PACKS[0];
