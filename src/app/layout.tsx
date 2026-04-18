import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SystemStatus from "@/components/SystemStatus";
import { ConfigProvider } from "@/context/ConfigContext";

export const metadata: Metadata = {
  title: "Typing | Notion Style",
  description: "Minimalist procedural typing practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <Cursor />
          {children}
          <SystemStatus />
        </ConfigProvider>
      </body>
    </html>
  );
}
