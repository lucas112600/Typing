import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SystemLog from "@/components/SystemLog";
import { ConfigProvider } from "@/context/ConfigContext";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600", "800"], variable: "--font-outfit" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });
const notoSansTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-noto-sans-tc" });

export const metadata: Metadata = {
  title: "TYPING_ | Premium Trainer",
  description: "Next-Generation Glassmorphism Typing Trainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetBrains.variable} ${notoSansTC.variable}`}>
        <ConfigProvider>
          <Cursor />
          {children}
          <SystemLog />
        </ConfigProvider>
      </body>
    </html>
  );
}
