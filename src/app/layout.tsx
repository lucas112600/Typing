import type { Metadata } from "next";
import "./globals.css";
import SystemStatus from "@/components/SystemStatus";
import Footer from "@/components/Footer";
import { ConfigProvider } from "@/context/ConfigContext";
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>
          <ConfigProvider>
            <div className="root-layout-wrapper">
              {children}
              <Footer />
            </div>
            <SystemStatus />
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
