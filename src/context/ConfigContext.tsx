"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FontSizeOption = "MEDIUM" | "LARGE" | "EXTRA_LARGE";

interface ConfigState {
  fontSize: FontSizeOption;
  stopOnError: boolean;
  nickname: string;
  soundEnabled: boolean;
  soundVolume: number;
  uiLang: "en" | "zh";
  setFontSize: (size: FontSizeOption) => void;
  setStopOnError: (stop: boolean) => void;
  setNickname: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setUiLang: (lang: "en" | "zh") => void;
}

const defaultConfig: ConfigState = {
  fontSize: "LARGE",
  stopOnError: false,
  nickname: "",
  soundEnabled: true,
  soundVolume: 0.5,
  uiLang: "en",
  setFontSize: () => {},
  setStopOnError: () => {},
  setNickname: () => {},
  setSoundEnabled: () => {},
  setSoundVolume: () => {},
  setUiLang: () => {},
};

const ConfigContext = createContext<ConfigState>(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    if (typeof window === "undefined") return "LARGE";
    try {
      const stored = localStorage.getItem("TYPING_CONFIG");
      if (stored) return JSON.parse(stored).fontSize || "LARGE";
    } catch { }
    return "LARGE";
  });

  const [stopOnError, setStopOnErrorState] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem("TYPING_CONFIG");
      if (stored) return JSON.parse(stored).stopOnError ?? false;
    } catch { }
    return false;
  });

  const [nickname, setNicknameState] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const stored = localStorage.getItem("TYPING_CONFIG");
      if (stored) return JSON.parse(stored).nickname || "";
    } catch { }
    return "";
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem("TYPING_CONFIG");
      if (stored) return JSON.parse(stored).soundEnabled ?? true;
    } catch { }
    return true;
  });

  const [soundVolume, setSoundVolumeState] = useState(() => {
    if (typeof window === "undefined") return 0.5;
    try {
      const stored = localStorage.getItem("TYPING_CONFIG");
      if (stored) return JSON.parse(stored).soundVolume ?? 0.5;
    } catch { }
    return 0.5;
  });

  const [uiLang, setUiLangState] = useState<"en" | "zh">(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = localStorage.getItem("TYPING_CONFIG");
      if (stored) return JSON.parse(stored).uiLang || "en";
    } catch { }
    return "en";
  });

  // Save to local storage on change
  const setFontSize = (v: FontSizeOption) => {
    setFontSizeState(v);
    saveConfig({ fontSize: v, stopOnError, nickname, soundEnabled, soundVolume, uiLang });
  };
  const setStopOnError = (v: boolean) => {
    setStopOnErrorState(v);
    saveConfig({ fontSize, stopOnError: v, nickname, soundEnabled, soundVolume, uiLang });
  };
  const setNickname = (v: string) => {
    setNicknameState(v);
    localStorage.setItem("TYPING_NICKNAME", v);
    saveConfig({ fontSize, stopOnError, nickname: v, soundEnabled, soundVolume, uiLang });
  };
  const setSoundEnabled = (v: boolean) => {
    setSoundEnabledState(v);
    saveConfig({ fontSize, stopOnError, nickname, soundEnabled: v, soundVolume, uiLang });
  };
  const setSoundVolume = (v: number) => {
    setSoundVolumeState(v);
    saveConfig({ fontSize, stopOnError, nickname, soundEnabled, soundVolume: v, uiLang });
  };
  const setUiLang = (v: "en" | "zh") => {
    setUiLangState(v);
    saveConfig({ fontSize, stopOnError, nickname, soundEnabled, soundVolume, uiLang: v });
  };

  const saveConfig = (state: { 
    fontSize: FontSizeOption; 
    stopOnError: boolean; 
    nickname: string;
    soundEnabled: boolean;
    soundVolume: number;
    uiLang: "en" | "zh";
  }) => {
    localStorage.setItem("TYPING_CONFIG", JSON.stringify(state));
  };

  useEffect(() => {
    const root = document.documentElement;
    let scale = "1";
    if (fontSize === "MEDIUM") scale = "0.8";
    if (fontSize === "EXTRA_LARGE") scale = "1.2";
    root.style.setProperty("--font-scale", scale);
  }, [fontSize]);

  return (
    <ConfigContext.Provider value={{ 
      fontSize, stopOnError, nickname, soundEnabled, soundVolume, uiLang,
      setFontSize, setStopOnError, setNickname, setSoundEnabled, setSoundVolume, setUiLang 
    }}>
      {children}
    </ConfigContext.Provider>
  );
}
