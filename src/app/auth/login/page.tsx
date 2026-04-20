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
          disabled={loading}
          style={{ padding: "0.75rem", justifyContent: "center", marginTop: "1rem" }}
        >
          {loading ? "Logging in..." : <><LogIn size={18} /> Login</>}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--foreground-muted)" }}>
        Don't have an account? <Link href="/auth/register" style={{ color: "#2383E2", fontWeight: 600 }}>Sign up</Link>
      </div>
    </div>
  );
}
