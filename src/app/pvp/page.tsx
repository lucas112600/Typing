"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Users, Zap, AlertCircle, Sparkles } from "lucide-react";

// SIMPLE WARM-UP COMPONENT
function LobbyWarmUp() {
  const [value, setValue] = useState("");
  const targetText = "Warm up your fingers while you wait for the competition to begin!";
  const inputRef = useRef<HTMLInputElement>(null);

  const renderText = () => {
    return targetText.split("").map((char, index) => {
      let color = "var(--foreground-muted)";
      let opacity = 0.55; // Increased contrast
      if (index < value.length) {
        color = value[index] === char ? "var(--foreground)" : "var(--foreground-danger)";
        opacity = 1;
      }
      return (
        <span key={index} style={{ color, opacity, transition: "all 0.1s" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      );
    });
  };

  return (
    <div 
      className="app-card" 
      onClick={() => inputRef.current?.focus()}
      style={{ padding: "2rem", marginTop: "4rem", cursor: "text", position: "relative" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem", color: "#E2B714" }}>
        <Sparkles size={18} />
        <span style={{ fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Interactive Warm-up</span>
      </div>
      <div className="mono-text" style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
        {renderText()}
      </div>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ position: "absolute", top: 0, left: 0, opacity: 0, pointerEvents: "none" }}
        spellCheck={false} autoComplete="off"
      />
      {value.length >= targetText.length && (
         <button 
           onClick={(e) => { e.stopPropagation(); setValue(""); }}
           className="app-button" 
           style={{ marginTop: "1rem", color: "#2383E2", fontSize: "0.8rem", width: "fit-content" }}
         >
           Reset Warm-up
         </button>
      )}
    </div>
  );
}

export default function PvPLobby() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const joinRoom = async (id: string) => {
    const cleanId = id.trim().toLowerCase();
    if (!cleanId) return;
    
    setLoading(true);
    setError("");

    try {
      // VALIDATE ROOM EXISTENCE
      const { data, error: queryError } = await supabase
        .from("rooms")
        .select("id")
        .eq("id", cleanId)
        .single();

      if (queryError || !data) {
        console.error("Room Join Error:", queryError);
        setError(queryError ? `Error: ${queryError.message}` : "Room not found. Check the code.");
        setLoading(false);
        return;
      }

      router.push(`/pvp/room/${cleanId}`);
    } catch (err) {
      console.error("Critical Join Error:", err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network Error: Failed to connect to Supabase. Check your internet or NEXT_PUBLIC_SUPABASE_URL.");
      } else {
        setError(`System Error: ${err instanceof Error ? err.message : "Possible configuration issue"}`);
      }
      setLoading(false);
    }
  };

  const createQuickRoom = async () => {
    setLoading(true);
    const id = Math.random().toString(36).substring(2, 7);
    
    try {
      // REGISTER ROOM IN DATABASE
      const { error: insertError } = await supabase
        .from("rooms")
        .insert({ id });

      if (insertError) {
        console.error("Room Creation Error:", insertError);
        setError(`Failed: ${insertError.message}`);
        setLoading(false);
        return;
      }

      router.push(`/pvp/room/${id}`);
    } catch (err) {
      console.error("Critical Creation Error:", err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Failed: Network error when connecting to Supabase. Are variables set?");
      } else {
        setError(`Failed: ${err instanceof Error ? err.message : "Unknown system error"}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="notion-page animate-fade-in" style={{ maxWidth: "800px" }}>
      <button onClick={() => router.push("/")} className="app-button" style={{ width: "fit-content", marginBottom: "2rem" }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ marginBottom: "4rem" }}>
        <h1 className="notion-title" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          Arena Lobby <Zap size={32} color="#E2B714" fill="#E2B714" />
        </h1>
        <p className="notion-p" style={{ opacity: 0.6 }}>Only valid room codes can join the race. Create your own arena to begin.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Join Section */}
        <section className="app-card" style={{ padding: "2rem", border: error ? "1px solid var(--foreground-danger)" : "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
            <Users size={20} color="#2383E2" />
            <h3 className="notion-h3" style={{ margin: 0 }}>Join a Room</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" 
                placeholder="e.g. akz0c"
                className="app-input"
                value={roomId}
                disabled={loading}
                onChange={(e) => {
                  setRoomId(e.target.value.toLowerCase());
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && joinRoom(roomId)}
              />
              <button 
                className="app-button primary" 
                disabled={loading}
                style={{ width: "fit-content", padding: "0 1.5rem" }} 
                onClick={() => joinRoom(roomId)}
              >
                {loading ? "..." : "Join"}
              </button>
            </div>
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground-danger)", fontSize: "0.8rem" }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        {/* Create Section */}
        <section className="app-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
            <Plus size={20} color="#2383E2" />
            <h3 className="notion-h3" style={{ margin: 0 }}>Create Room</h3>
          </div>
          <button className="app-button primary" disabled={loading} onClick={createQuickRoom}>
            {loading ? "Initializing..." : "Create Private Arena"}
          </button>
        </section>
      </div>

      <LobbyWarmUp />
    </div>
  );
}
