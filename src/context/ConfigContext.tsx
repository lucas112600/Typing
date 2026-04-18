"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type FontSizeOption = "MEDIUM" | "LARGE" | "EXTRA_LARGE";
export type CursorStyleOption = "CROSSHAIR" | "BLOCK" | "LINE";

interface ConfigState {
  fontSize: FontSizeOption;
  cursorStyle: CursorStyleOption;
  stopOnError: boolean;
  setFontSize: (size: FontSizeOption) => void;
  setCursorStyle: (style: CursorStyleOption) => void;
  setStopOnError: (stop: boolean) => void;
}

const defaultConfig: ConfigState = {
  fontSize: "LARGE",
  cursorStyle: "CROSSHAIR",
  stopOnError: false,
  setFontSize: () => {},
  setCursorStyle: () => {},
  setStopOnError: () => {},
};

const ConfigContext = createContext<ConfigState>(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>("LARGE");
  const [cursorStyle, setCursorStyleState] = useState<CursorStyleOption>("CROSSHAIR");
  const [stopOnError, setStopOnErrorState] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("TYPING_CONFIG");
      if (stored) {
        const parsed = JSON.parse(stored);
        // eslint-disable-next-line
        if (parsed.fontSize) setFontSizeState(parsed.fontSize);
        if (parsed.cursorStyle) setCursorStyleState(parsed.cursorStyle);
        if (parsed.stopOnError !== undefined) setStopOnErrorState(parsed.stopOnError);
      }
    } catch (e) {
      console.error("Failed to parse config", e);
    }
  }, []);

  // Save to local storage on change
  const setFontSize = (v: FontSizeOption) => {
    setFontSizeState(v);
    saveConfig({ fontSize: v, cursorStyle, stopOnError });
  };
  const setCursorStyle = (v: CursorStyleOption) => {
    setCursorStyleState(v);
    saveConfig({ fontSize, cursorStyle: v, stopOnError });
  };
  const setStopOnError = (v: boolean) => {
    setStopOnErrorState(v);
    saveConfig({ fontSize, cursorStyle, stopOnError: v });
  };

  const saveConfig = (state: { fontSize: FontSizeOption; cursorStyle: CursorStyleOption; stopOnError: boolean }) => {
    localStorage.setItem("TYPING_CONFIG", JSON.stringify(state));
  };

  useEffect(() => {
    // Inject global CSS variables based on config
    const root = document.documentElement;
    let scale = "1";
    if (fontSize === "MEDIUM") scale = "0.8";
    if (fontSize === "EXTRA_LARGE") scale = "1.2";
    root.style.setProperty("--font-scale", scale);
  }, [fontSize]);

  return (
    <ConfigContext.Provider value={{ fontSize, cursorStyle, stopOnError, setFontSize, setCursorStyle, setStopOnError }}>
      {children}
    </ConfigContext.Provider>
  );
}
