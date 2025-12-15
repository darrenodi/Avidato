import "./globals.css";
import type { Metadata } from "next"; // Import the Metadata type for better type-checking
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// --- Updated Metadata Object ---
// We are adding the 'icons' and 'manifest' properties to your existing object.
export const metadata: Metadata = {
  title: "Avidato - AI English Teaching Assistant for ESL Tutors",
  description: "Avidato is an AI-powered English teaching assistant for online ESL/EFL tutors. Generate personalized lesson plans, worksheets, quizzes, flashcards, and discussion questions. Free AI English teaching materials with CEFR level support.",
  keywords: "ESL tutoring, EFL lessons, English teaching, AI lesson plans, CEFR levels, online tutoring, English worksheets, language learning, ESL resources, English tutor tools",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Light theme only for public pages (landing, login, signup)
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900" suppressHydrationWarning>
        <AuthProvider>
          <main>
            {children}
          </main>
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}