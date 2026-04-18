"use client";

import { useEffect, useState } from "react";
import { SystemLogPubSub } from "@/lib/systemLog";

export default function SystemLog() {
  const [log, setLog] = useState("");

  useEffect(() => {
    return SystemLogPubSub.subscribe(setLog);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "8px",
        left: "8px",
        fontSize: "10px",
        letterSpacing: "1px",
        fontFamily: "var(--font-inter), monospace",
        zIndex: 9998,
        color: "var(--foreground)",
        mixBlendMode: "difference",
        pointerEvents: "none",
        textTransform: "uppercase"
      }}
    >
      [{log}]
    </div>
  );
}
