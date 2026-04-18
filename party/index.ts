import type * as Party from "partykit/server";

interface Player {
  id: string;
  name: string;
  ready: boolean;
  progress: number;
  wpm: number;
  finished: boolean;
}

interface ScoreRecord {
  name: string;
  wpm: number;
  accuracy: number;
  date: string;
}

export default class Server implements Party.Server {
  players: Map<string, Player> = new Map();
  text: string = "The quick brown fox jumps over the lazy dog."; // Default text
  title: string = "Warm-up Race";
  state: "LOBBY" | "STARTING" | "RACING" = "LOBBY";
  leaderboard: ScoreRecord[] = [];

  constructor(readonly party: Party.Party) {}

  async onStart() {
    this.leaderboard = (await this.party.storage.get<ScoreRecord[]>("leaderboard")) || [];
  }

  onConnect(conn: Party.Connection) {
    // Add player to room
    const player: Player = {
      id: conn.id,
      name: `Player ${conn.id.slice(0, 4)}`,
      ready: false,
      progress: 0,
      wpm: 0,
      finished: false,
    };
    this.players.set(conn.id, player);
    
    // Send current state to the new connection
    conn.send(JSON.stringify({
      type: "SYNC_ROOM",
      players: Array.from(this.players.values()),
      text: this.text,
      title: this.title,
      state: this.state
    }));

    // Notify others
    this.party.broadcast(JSON.stringify({
      type: "PLAYER_JOINED",
      player
    }), [conn.id]);
  }

  onClose(conn: Party.Connection) {
    this.players.delete(conn.id);
    this.party.broadcast(JSON.stringify({
      type: "PLAYER_LEFT",
      playerId: conn.id
    }));
    
    // Reset room if empty
    if (this.players.size === 0) {
      this.state = "LOBBY";
    }
  }

  async onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);
    const player = this.players.get(sender.id);
    if (!player) return;

    switch (data.type) {
      case "SET_READY":
        player.ready = data.ready;
        this.broadcastState();
        this.checkStart();
        break;
      
      case "UPDATE_PROGRESS":
        player.progress = data.progress;
        player.wpm = data.wpm;
        this.broadcastState();
        break;

      case "FINISH":
        player.finished = true;
        player.progress = 100;
        this.broadcastState();
        break;

      case "SET_TEXT":
        // Only allow changing text in LOBBY
        if (this.state === "LOBBY") {
          this.text = data.text;
          this.title = data.title;
          this.party.broadcast(JSON.stringify({
             type: "TEXT_UPDATED",
             text: this.text,
             title: this.title
          }));
        }
        break;

      case "GET_LEADERBOARD":
        sender.send(JSON.stringify({
          type: "LEADERBOARD_UPDATE",
          leaderboard: this.leaderboard
        }));
        break;

      case "SUBMIT_SCORE":
        const newRecord: ScoreRecord = {
          name: data.name || "Anonymous",
          wpm: data.wpm,
          accuracy: data.accuracy,
          date: new Date().toISOString()
        };
        this.leaderboard.push(newRecord);
        // Sort: Highest WPM first
        this.leaderboard.sort((a, b) => b.wpm - a.wpm);
        // Keep top 50
        this.leaderboard = this.leaderboard.slice(0, 50);
        
        await this.party.storage.put("leaderboard", this.leaderboard);
        
        this.party.broadcast(JSON.stringify({
          type: "LEADERBOARD_UPDATE",
          leaderboard: this.leaderboard
        }));
        break;
    }
  }

  broadcastState() {
    this.party.broadcast(JSON.stringify({
      type: "UPDATE_PLAYERS",
      players: Array.from(this.players.values())
    }));
  }

  checkStart() {
    const allReady = Array.from(this.players.values()).every(p => p.ready);
    if (allReady && this.players.size >= 1 && this.state === "LOBBY") {
      this.state = "STARTING";
      this.party.broadcast(JSON.stringify({ type: "START_COUNTDOWN" }));
      
      // Auto transition to RACING after countdown (client handles countdown visual)
      setTimeout(() => {
        this.state = "RACING";
        this.party.broadcast(JSON.stringify({ type: "START_RACE" }));
      }, 5000);
    }
  }
}
