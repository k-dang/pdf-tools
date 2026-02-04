import type { Metadata } from "next";
import { JetBrains_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "pdf-tools | PDF manipulation for the command line",
  description:
    "A fast, type-safe CLI for splitting and merging PDFs. Built with Bun and TypeScript. Features an interactive TUI for visual page selection.",
  keywords: [
    "pdf",
    "cli",
    "command line",
    "pdf split",
    "pdf merge",
    "bun",
    "typescript",
  ],
  authors: [{ name: "k-dang" }],
  openGraph: {
    title: "pdf-tools | PDF manipulation for the command line",
    description:
      "A fast, type-safe CLI for splitting and merging PDFs. Built with Bun and TypeScript.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${instrumentSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
