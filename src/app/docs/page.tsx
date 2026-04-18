"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
  const router = useRouter();

  return (
    <div className="notion-page animate-fade-in">
      <button className="app-button" onClick={() => router.push("/")} style={{ width: "fit-content", marginBottom: "2rem", color: "var(--foreground-muted)" }}>
         <ArrowLeft size={16} /> Back to Hub
      </button>

      <div style={{ fontSize: "5rem", marginBottom: "1rem", lineHeight: 1 }}>📖</div>
      <h1 className="notion-title">Documentation</h1>
      <p className="notion-p" style={{ fontSize: "1.1rem", color: "var(--foreground-muted)" }}>
        A rigorous outline of the Neural Forge and Strict Engine rulesets.
      </p>

      <h2 className="notion-h2">The Neural Forge (AI Generation)</h2>
      <p className="notion-p">
        Whenever you choose <b>Auto Start</b> or click a dynamic Category button (Easy / Normal / Hard), the system fires an event to the internal Generator mechanism.
      </p>
      <ul style={{ paddingLeft: "1.5rem", color: "var(--foreground)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
         <li><b>Length Mapping</b>: EASY maps to ~50 words. HARD approaches ~200 words.</li>
         <li><b>Grammar Structures</b>: The Chinese generator constructs standard <code>主題-評論</code> sentences. The English generator uses <code>S-V-O</code> matrices.</li>
         <li><b>Punctuation Distribution</b>: Approximately 15% of the string is dedicated to procedural punctuation to mimic complex real-world manuscripts.</li>
      </ul>

      <h2 className="notion-h2">Strict Typing Checks</h2>
      <p className="notion-p">
        The application is capable of handling deep IME (Input Method Editor) sequences precisely.
      </p>
      <p className="notion-p" style={{ borderLeft: "3px solid var(--foreground)", paddingLeft: "1rem", fontStyle: "italic", color: "var(--foreground-muted)" }}>
        If Strict Mode is enabled via Settings, the client will lock the cursor array length until the specific keystroke error is explicitly deleted by the user.
      </p>
      
      <h2 className="notion-h2">Local Storage Retention</h2>
      <p className="notion-p">
        Metrics and historical WPM plots are maintained seamlessly on your local memory core (localStorage). Deletion of browser memory will reset the historical dataset.
      </p>
    </div>
  );
}
