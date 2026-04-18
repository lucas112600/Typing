"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SystemLogPubSub } from "@/lib/systemLog";
import type { NewsItem } from "@/lib/newsApi";

export default function HomeInteraction({ newsItem }: { newsItem: NewsItem | null }) {
  const router = useRouter();

  useEffect(() => {
    SystemLogPubSub.publish("SYS_READY");
    
    if (newsItem) {
      sessionStorage.setItem("typing_practice_data", JSON.stringify(newsItem));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        SystemLogPubSub.publish("INITIATE_PRACTICE");
        router.push("/practice");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, newsItem]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      padding: "2rem"
    }}>
      <div className="animate-step-in stagger-1" style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: 900 }}>
        [ DAILY_PICK ]
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {newsItem ? (
          <div className="animate-step-in stagger-2" style={{ maxWidth: "800px", textAlign: "center" }}>
            <h1 style={{ 
              fontSize: "3rem", 
              fontWeight: 900, 
              lineHeight: "1.1", 
              textTransform: "uppercase", 
              marginBottom: "1rem" 
            }}>
              {newsItem.title}
            </h1>
            <p style={{
              fontSize: "1rem",
              opacity: 0.6,
              fontWeight: 900
            }}>
              {newsItem.description.substring(0, 100)}...
            </p>
          </div>
        ) : (
          <div className="animate-step-in stagger-2" style={{ fontSize: "3rem", fontWeight: 900 }}>
            NO_DATA_AVAILABLE
          </div>
        )}
      </div>

      <div className="animate-step-in stagger-3" style={{ textAlign: "center", fontSize: "14px", fontWeight: 900, letterSpacing: "2px" }}>
        [ PRESS SPACE TO START ]
      </div>
    </div>
  );
}
