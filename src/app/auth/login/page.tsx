"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useConfig } from "@/context/ConfigContext";
import { translations } from "@/lib/i18n";
import { ArrowLeft, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { uiLang } = useConfig();
  const t = translations[uiLang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  const handleDiscordLogin = async () => {
    setOauthLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(false);
    }
  };

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "400px", margin: "0 auto", padding: "6rem 1rem" }}>
      <button onClick={() => router.push("/")} className="app-button" style={{ width: "fit-content", marginBottom: "2rem" }}>
        <ArrowLeft size={16} /> {t.back}
      </button>

      <h1 className="notion-title" style={{ textAlign: "center" }}>Login</h1>
      <p style={{ textAlign: "center", color: "var(--foreground-muted)", marginBottom: "3rem" }}>
        Enter your credentials to access your global profile.
      </p>

      {error && (
        <div style={{ 
          background: "rgba(235, 87, 87, 0.1)", 
          color: "var(--foreground-danger)", 
          padding: "1rem", 
          borderRadius: "var(--radius)", 
          marginBottom: "1.5rem", 
          display: "flex", 
          alignItems: "center", 
          gap: "0.5rem",
          fontSize: "0.9rem"
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground-muted)" }}>Email</label>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--foreground-muted)" }} />
            <input 
              type="email" 
              className="app-input" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: "36px" }}
              required
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground-muted)" }}>Password</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--foreground-muted)" }} />
            <input 
              type="password" 
              className="app-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: "36px" }}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="app-button primary" 
          disabled={loading || oauthLoading}
          style={{ padding: "0.75rem", justifyContent: "center", marginTop: "1rem" }}
        >
          {loading ? "Logging in..." : <><LogIn size={18} /> Login</>}
        </button>
      </form>

      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "1rem", 
        margin: "2rem 0",
        color: "var(--foreground-muted)",
        fontSize: "0.8rem"
      }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span>OR</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      <button 
        onClick={handleDiscordLogin}
        disabled={oauthLoading || loading}
        className="app-button" 
        style={{ 
          width: "100%", 
          background: "#5865F2", 
          color: "white", 
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.8rem",
          padding: "0.75rem"
        }}
      >
        {oauthLoading ? (
          <div className="animate-spin" style={{ width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%" }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        )}
        Login with Discord
      </button>

      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--foreground-muted)" }}>
        Don&apos;t have an account? <Link href="/auth/register" style={{ color: "#2383E2", fontWeight: 600 }}>Sign up</Link>
      </div>
    </div>
  );
}
