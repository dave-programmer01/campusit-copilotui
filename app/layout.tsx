import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusIT Co-Pilot · unofficial Lehman College tech help",
  description:
    "Unofficial, student-built AI helper for Lehman College tech problems: Wi-Fi, login, CUNYfirst and student email. No line. Just chat.",
};

export const viewport: Viewport = {
  themeColor: "#061513",
  // Shrink the layout viewport when the on-screen keyboard opens, so a
  // viewport-height shell keeps its composer above the keyboard.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
