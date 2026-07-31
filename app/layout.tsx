import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Atmos — Qualité de l'air, 5 villes",
  description:
    "Tableau de bord comparatif de la qualité de l'air à Antananarivo, Paris, Nairobi, Mumbai et Beijing, alimenté par le pipeline donnee2-aqi et Neon Postgres.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-bg text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
