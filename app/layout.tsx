import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";

export const metadata: Metadata = {
  title: "LifeQuest — แอปดัดสันดาน เปลี่ยนชีวิตให้เป็นเกม RPG",
  description: "แอปดัดสันดาน ที่เปลี่ยนการสร้างนิสัยดีๆ ให้เป็นเกม RPG สุดมันส์ ทำภารกิจ เก็บ XP เลเวลอัป แล้วดูตัวเองเปลี่ยนไปทีละนิดในชีวิตจริง 🎮⚔️",
  manifest: "/manifest.json",
  openGraph: {
    title: "LifeQuest — แอปดัดสันดาน 🎮⚔️",
    description: "เบื่อชีวิตเดิมๆ? มาดัดสันดานผ่านเกม RPG กัน! ทำภารกิจประจำวัน เก็บ XP เลเวลอัป ผสมชีวิตจริงกับเกมแบบไม่เคยมีมาก่อน",
    type: "website",
    locale: "th_TH",
    siteName: "LifeQuest",
  },
  twitter: {
    card: "summary",
    title: "LifeQuest — แอปดัดสันดาน 🎮⚔️",
    description: "เบื่อชีวิตเดิมๆ? มาดัดสันดานผ่านเกม RPG กัน! ทำภารกิจประจำวัน เก็บ XP เลเวลอัป ผสมชีวิตจริงกับเกมแบบไม่เคยมีมาก่อน",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LifeQuest",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-body min-h-screen overflow-x-hidden" style={{ backgroundColor: "#0c0c1d", color: "#e2e8f0" }}>
        <ThemeProvider>
          <div className="relative min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
