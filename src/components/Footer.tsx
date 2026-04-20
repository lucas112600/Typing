"use client";

import { useConfig } from "@/context/ConfigContext";
import { translations } from "@/lib/i18n";
import Link from "next/link";

export default function Footer() {
  const { uiLang } = useConfig();
  const t = translations[uiLang];

  return (
    <footer style={{ 
      marginTop: "auto", 
      padding: "2rem 0 4rem 0", 
      borderTop: "1px solid var(--border)",
      color: "var(--foreground-muted)",
      fontSize: "0.85rem"
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p>{t.footer_statement}</p>
            <p style={{ marginTop: "0.25rem" }}>© 2026 Typing Arena · <span className="mono-text" style={{ fontSize: "0.75rem" }}>huchialun97@gmail.com</span></p>
          </div>
          
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/changelog" style={{ color: "inherit", textDecoration: "none", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--border)"} onMouseOut={(e) => e.currentTarget.style.borderColor = "transparent"}>
              {t.changelog}
            </Link>
            <a href="mailto:huchialun97@gmail.com" style={{ color: "inherit", textDecoration: "none", borderBottom: "1px solid transparent", transition: "border-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--border)"} onMouseOut={(e) => e.currentTarget.style.borderColor = "transparent"}>
              {t.technical_support}
            </a>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ 
                display: "inline-block", 
                width: "8px", height: "8px", 
                borderRadius: "50%", 
                backgroundColor: "#2ecc71" 
              }} />
              <span>{t.current_version}: <span className="mono-text">v1.2.0</span></span>
           </div>
           <div>
              <span style={{ opacity: 0.6 }}>{t.feedback_msg}</span>
           </div>
        </div>

      </div>
    </footer>
  );
}
