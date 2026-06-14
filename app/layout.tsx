import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-outfit",
});
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
    <html lang="fr" className={`${jakarta.variable} ${outfit.variable} ${plexMono.variable}`}>
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
