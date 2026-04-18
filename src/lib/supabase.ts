import { createClient } from "@supabase/supabase-js";

// Provide a valid-looking placeholder during build to prevent createClient from throwing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "empty";

// If variables are missing, we still create the client but it will only fail when actually used
// This prevents the Next.js build from crashing during prerendering.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
