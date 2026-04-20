"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useConfig } from "@/context/ConfigContext";
import { translations } from "@/lib/i18n";
import { ArrowLeft, Mail, Lock, UserPlus, AlertCircle, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { uiLang } = useConfig();
  const t = translations[uiLang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      // Success - usually leads to email confirmation message or instant login
      router.push("/auth/login?msg=Registered successfully! Please check your email and login.");
    }
  };

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "400px", margin: "0 auto", padding: "6rem 1rem" }}>
      <button onClick={() => router.push("/")} className="app-button" style={{ width: "fit-content", marginBottom: "2rem" }}>
        <ArrowLeft size={16} /> {t.back}
      </button>

      <h1 className="notion-title" style={{ textAlign: "center" }}>Create Account</h1>
      <p style={{ textAlign: "center", color: "var(--foreground-muted)", marginBottom: "3rem" }}>
        Join the global typing community.
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

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground-muted)" }}>Nickname</label>
          <div style={{ position: "relative" }}>
            <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--foreground-muted)" }} />
            <input 
              type="text" 
              className="app-input" 
              placeholder="e.g. TypeMaster"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{ paddingLeft: "36px" }}
              required
            />
          </div>
        </div>

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
          {loading ? "Registering..." : <><UserPlus size={18} /> Register</>}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem", color: "var(--foreground-muted)" }}>
        Already have an account? <Link href="/auth/login" style={{ color: "#2383E2", fontWeight: 600 }}>Log in</Link>
      </div>
    </div>
  );
}
