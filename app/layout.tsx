import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Swiftflow — votre équipe de créateurs IA",
  description:
    "Posts, carrousels, visuels, rapports et présentations — une équipe d'agents IA dédiée à votre marque, configurée et supervisée par Swiftflow.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
