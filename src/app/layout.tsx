import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Passport — Verified Developer Identity",
  description:
    "The living trust passport for developers. More powerful than GitHub, more objective than LinkedIn, more alive than a resume.",
  metadataBase: new URL("https://p.krl.kr"),
  openGraph: {
    title: "Digital Passport — Verified Developer Identity",
    description:
      "One verified identity across every platform you build on. Trust Score, Skill Genome, Project Passport and more.",
    type: "website",
    url: "https://p.krl.kr",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Passport — Verified Developer Identity",
    description: "Your developer identity, verified.",
    images: ["/og-image.svg"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#4361ee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
