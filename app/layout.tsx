import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JourneyAlert — Wake up before you arrive",
  description: "A route-aware travel alarm that wakes you near your destination.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
