"use client";

class AudioManager {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private initialized: boolean = false;
  private volume: number = 0.5;

  private sounds = {
    standard: "https://www.soundjay.com/buttons/sounds/button-16.mp3",
    space: "https://www.soundjay.com/buttons/sounds/button-17.mp3",
    error: "https://www.soundjay.com/buttons/sounds/button-10.mp3",
    finish: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
  };

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    if (this.initialized) return;
    
    const AudioContextClass = (window.AudioContext || (window as unknown as Window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
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
