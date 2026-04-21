"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogIn, User as UserIcon, LogOut } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Left: Logo */}
        <div 
          onClick={() => router.push("/")} 
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Logo size={24} />
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.5px" }}>TYPING_</span>
        </div>

        {/* Right: Auth/Session */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div 
                onClick={() => router.push("/profile")}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.6rem", 
                  cursor: "pointer",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "var(--radius)",
                  transition: "background 0.2s"
                }}
                className="app-button"
              >
                <div style={{ 
                  width: "24px", 
                  height: "24px", 
                  borderRadius: "50%", 
                  background: "var(--surface-active)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#2383E2"
                }}>
                  <UserIcon size={14} />
                </div>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {profile?.nickname || user.email?.split("@")[0]}
                </span>
              </div>
              <button 
                onClick={() => signOut()} 
                title="Sign Out"
                style={{ width: "auto", padding: "0.4rem" }}
                className="app-button danger"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => router.push("/auth/login")} 
              className="app-button primary" 
              style={{ width: "auto", padding: "0.4rem 1rem", fontSize: "0.9rem" }}
            >
              <LogIn size={16} /> <span style={{ marginLeft: "4px" }}>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
