import { supabase } from "./supabase";
import { triggerAchievementToast } from "@/components/AchievementToast";

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  condition: (stats: { wpm: number; accuracy: number; totalSessions: number; mode?: string }) => boolean;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  FIRST_SESSION: {
    id: "FIRST_SESSION",
    title: "First Blood",
    icon: "🌱",
    description: "Complete your first typing session.",
    condition: (s) => s.totalSessions >= 1,
  },
  SPEED_DEMON: {
    id: "SPEED_DEMON",
    title: "Speed Demon",
    icon: "⚡",
    description: "Reach a speed of over 100 WPM.",
    condition: (s) => s.wpm >= 100,
  },
  ACCURACY_KING: {
    id: "ACCURACY_KING",
    title: "Accuracy King",
    icon: "🎯",
    description: "Reach 100% accuracy in a standard session.",
    condition: (s) => s.accuracy === 100 && s.wpm > 20, // Avoid near-empty sessions
  },
  PVP_WARRIOR: {
    id: "PVP_WARRIOR",
    title: "PvP Warrior",
    icon: "⚔️",
    description: "Complete a competitive PvP race.",
    condition: (s) => s.mode === "pvp",
  },
  NIGHT_OWL: {
    id: "NIGHT_OWL",
    title: "Night Owl",
    icon: "🦉",
    description: "Practice between midnight and 5 AM.",
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 5;
    },
  },
  CONSISTENCY: {
    id: "CONSISTENCY",
    title: "Consistency",
    icon: "📈",
    description: "Complete 10 sessions in a single day.",
    condition: (s) => s.totalSessions >= 10, // simplified for now
  },
};

/**
 * Checks and awards achievements to the user based on current session data.
 */
export const awardAchievement = async (userId: string, achievementId: string) => {
  try {
    // Check if user already has it to save bandwidth/API calls
    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single();

    if (!existing) {
      const { error } = await supabase
        .from("user_achievements")
        .insert({ user_id: userId, achievement_id: achievementId });
      
      if (!error) {
        triggerAchievementToast(achievementId);
        return true; // Successfully awarded
      }
    }
  } catch (err) {
    console.error("Error awarding achievement:", err);
  }
  return false;
};

/**
 * Fetches all unlocked achievement IDs for a user.
 */
export const fetchUserAchievements = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user achievements:", error);
    return [];
  }

  return data.map(d => d.achievement_id);
};
