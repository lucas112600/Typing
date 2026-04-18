"use client";

class AudioManager {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private initialized: boolean = false;
  private volume: number = 0.5;

  private sounds = {
    standard: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // Click
    space: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",    // Thud
    error: "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3",   // Sharp click for error
    finish: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",  // Chime
  };

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    if (this.initialized) return;
    
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.context = new AudioContextClass();
    this.initialized = true;

    // Preload sounds
    Object.entries(this.sounds).forEach(([key, url]) => {
      this.loadSound(key, url);
    });
  }

  private async loadSound(key: string, url: string) {
    if (!this.context) return;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(key, audioBuffer);
    } catch (e) {
      console.error(`Failed to load sound: ${key}`, e);
    }
  }

  public setVolume(v: number) {
    this.volume = v;
  }

  public play(key: "standard" | "space" | "error" | "finish") {
    if (!this.context || !this.initialized) {
      this.init();
    }
    
    // Resume context if suspended (browser security)
    if (this.context?.state === "suspended") {
      this.context.resume();
    }

    const buffer = this.buffers.get(key);
    if (!buffer || !this.context) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.context.createGain();
    gainNode.gain.value = this.volume;

    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    source.start(0);
  }
}

const audioManager = typeof window !== "undefined" ? new AudioManager() : null;
export default audioManager;
