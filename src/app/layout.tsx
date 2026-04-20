import type { Metadata } from "next";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SystemStatus from "@/components/SystemStatus";
import Footer from "@/components/Footer";
import { ConfigProvider } from "@/context/ConfigContext";

export const metadata: Metadata = {
  title: "Typing",
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
          <div className="root-layout-wrapper">
            <Cursor />
            {children}
            <Footer />
          </div>
          <SystemStatus />
        </ConfigProvider>
      </body>
    </html>
  );
}
