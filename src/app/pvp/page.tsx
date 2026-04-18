"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Users, Zap, Terminal, BookOpen, Quote, Feather } from "lucide-react";
import { THEME_PACKS, ThemeText } from "@/lib/themes";

export default function PvPLobby() {
  const [roomId, setRoomId] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(THEME_PACKS[0].id);
  const router = useRouter();

  const joinRoom = (id: string) => {
    if (!id.trim()) return;
    router.push(`/pvp/room/${id.trim()}`);
  };

  const createQuickRoom = () => {
    const id = Math.random().toString(36).substring(2, 7);
    // Since we can't pass data easily to the next page without a DB, 
    // we'll let the user change it inside the room if they are the host.
    router.push(`/pvp/room/${id}`);
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
        <p className="notion-p" style={{ opacity: 0.6 }}>Compete with others in real-time. Share your room code to invite friends.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Join Section */}
        <section className="app-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
            <Users size={20} color="#2383E2" />
            <h3 className="notion-h3" style={{ margin: 0 }}>Join a Room</h3>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
            Enter a room code to join an existing race.
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              placeholder="e.g. akz0c"
              className="app-input"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toLowerCase())}
              onKeyDown={(e) => e.key === "Enter" && joinRoom(roomId)}
            />
            <button className="app-button primary" style={{ width: "fit-content", padding: "0 1.5rem" }} onClick={() => joinRoom(roomId)}>
              Join
            </button>
          </div>
        </section>

        {/* Create Section */}
        <section className="app-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1.5rem" }}>
            <Plus size={20} color="#2383E2" />
            <h3 className="notion-h3" style={{ margin: 0 }}>Create Room</h3>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
            Setup a new arena and challenge your friends.
          </p>
          
          <button className="app-button primary" onClick={createQuickRoom}>
            Create Private Arena
          </button>
        </section>
      </div>

      <div style={{ marginTop: "4rem" }}>
        <h3 className="notion-h3" style={{ marginBottom: "1.5rem" }}>Available Themes</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {THEME_PACKS.slice(0, 4).map(theme => (
             <div key={theme.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.9rem", opacity: 0.7 }}>
                {theme.category === "TECH" && <Terminal size={14} />}
                {theme.category === "LITERATURE" && <BookOpen size={14} />}
                {theme.category === "QUOTES" && <Quote size={14} />}
                {theme.category === "POETRY" && <Feather size={14} />}
                <span>{theme.title}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
