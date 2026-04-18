import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SystemLog from "@/components/SystemLog";

const inter = Inter({ subsets: ["latin"], weight: ["900"], variable: "--font-inter" });
const notoSansTC = Noto_Sans_TC({ subsets: ["latin"], weight: ["900"], variable: "--font-noto-sans-tc" });

export const metadata: Metadata = {
  title: "TYPING_",
  description: "Modern Brutalism Typing Trainer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSansTC.variable}`}>
        <Cursor />
        {children}
        <SystemLog />
      </body>
    </html>
  );
}
