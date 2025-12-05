import type { Metadata } from "next";
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
  title: "Field Parka Runway Showcase",
  description:
    "Immersive studio-lit runway presentation of a high poly field parka ensemble with 2K procedural textiles and fashion show animation.",
  openGraph: {
    title: "Field Parka Runway Showcase",
    description:
      "Explore an animated field parka and tactical pant pairing rendered in a cinematic 3D studio environment.",
    url: "https://agentic-afbd8066.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Parka Runway Showcase",
    description:
      "High poly field parka look with studio lighting, 2K texture detail, and animated runway preview.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
