import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const clashDisplay = localFont({
  variable: "--font-clash-display",
  display: "swap",
  src: [
    { path: "../public/fonts/ClashDisplay-Regular.woff2", weight: "400" },
    { path: "../public/fonts/ClashDisplay-Medium.woff2", weight: "500" },
    { path: "../public/fonts/ClashDisplay-Semibold.woff2", weight: "600" },
    { path: "../public/fonts/ClashDisplay-Bold.woff2", weight: "700" },
  ],
});

export const metadata: Metadata = {
  title: "Alban Calvo — AI Automation Engineer | n8n Expert",
  description:
    "Responsable IA & Automatisation. Agents IA, workflows n8n, RAG et automatisation no-code/low-code. Démos live intégrées : chaque interaction déclenche un vrai workflow.",
  openGraph: {
    title: "Alban Calvo — AI Automation Engineer",
    description:
      "Agents IA, workflows n8n, RAG et automatisation no-code/low-code. Portfolio avec démos live.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrainsMono.variable} ${clashDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
