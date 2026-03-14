import type { Metadata } from "next";
import { Space_Grotesk, Spline_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Toast from "@/components/Toast";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const body = Spline_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "SmartCompliance Suite",
  description: "KYC/AML compliance dashboard with Supabase auth."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-midnight text-frost">
        <Toast />
        {children}
      </body>
    </html>
  );
}
