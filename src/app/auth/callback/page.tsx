"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // The Supabase client automatically handles the code exchange
      // We just need to check if we have a session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error.message);
        router.push("/auth/login?error=callback_failed");
        return;
      }

      if (session) {
        // Redirection to the dashboard or home
        router.push("/");
      } else {
        // Fallback
        router.push("/auth/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="notion-page" style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      textAlign: "center"
    }}>
      <div className="animate-spin" style={{ 
        width: "40px", 
        height: "40px", 
        border: "4px solid var(--surface-active)", 
        borderTopColor: "#2383E2", 
        borderRadius: "50%",
        marginBottom: "1rem"
      }} />
      <h2 style={{ margin: 0 }}>Authenticating with Discord...</h2>
      <p style={{ color: "var(--foreground-muted)" }}>Setting up your secure session.</p>
    </div>
  );
}
