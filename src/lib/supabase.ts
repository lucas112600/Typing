import { createClient } from "@supabase/supabase-js";

// Provide a valid-looking placeholder during build to prevent createClient from throwing
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "empty";

// DIAGNOSTICS: Warn if using placeholder
if (typeof window !== "undefined") {
  const maskedUrl = supabaseUrl.length > 10 ? `${supabaseUrl.substring(0, 15)}...` : supabaseUrl;
  const maskedKey = supabaseAnonKey.length > 10 ? `${supabaseAnonKey.substring(0, 10)}...` : "not-found";
  
  console.log("🛠️ SUPABASE CONNECTING TO:", maskedUrl);
  console.log("🛠️ SUPABASE KEY START:", maskedKey);

  if (supabaseUrl.includes("placeholder.supabase.co")) {
    console.warn("⚠️ SUPABASE CONFIG MISSING: NEXT_PUBLIC_SUPABASE_URL is not set. Using placeholder.");
  }
}

// If variables are missing, we still create the client but it will only fail when actually used
// This prevents the Next.js build from crashing during prerendering.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

