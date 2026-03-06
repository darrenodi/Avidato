import "./globals.css";
import type { Metadata } from "next"; // Import the Metadata type for better type-checking
import { Plus_Jakarta_Sans } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import CookieConsent from "@/components/CookieConsent";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

// --- Updated Metadata Object ---
// We are adding the 'icons' and 'manifest' properties to your existing object.
export const metadata: Metadata = {
  title: "Avidato | AI-Powered English Teaching Assistant",
  description: "Avidato is an AI-powered English teaching assistant for online ESL/EFL tutors. Generate personalized lesson plans, worksheets, quizzes, flashcards, and discussion questions. Free AI English teaching materials with CEFR level support.",
  keywords: "ESL tutoring, EFL lessons, English teaching, AI lesson plans, CEFR levels, online tutoring, English worksheets, language learning, ESL resources, English tutor tools",
  openGraph: {
    title: "Avidato | AI-Powered English Teaching Assistant",
    description: "Generate personalized English lesson plans in minutes with AI. Perfect for ESL/EFL tutors.",
    url: "https://avidato.com",
    siteName: "Avidato",
    images: [
      {
        url: "https://avidato.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Avidato Logo",
        type: "image/png",
      },
      {
        url: "https://avidato.com/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Avidato Logo",
        type: "image/png",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avidato | AI-Powered English Teaching Assistant",
    description: "Generate personalized English lesson plans in minutes with AI.",
    images: ["https://avidato.com/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Light theme only for public pages (landing, login, signup)
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        {/* Organization Schema Markup for Search Engine Logo Display */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Avidato",
              "alternateName": "Avidato - AI English Teaching Assistant",
              "url": "https://avidato.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://avidato.com/android-chrome-512x512.png",
                "width": 512,
                "height": 512
              },
              "image": {
                "@type": "ImageObject",
                "url": "https://avidato.com/android-chrome-512x512.png",
                "width": 512,
                "height": 512
              },
              "description": "AI-powered English teaching assistant for online ESL/EFL tutors. Generate personalized lesson plans, discussion questions, and teaching materials with CEFR level support.",
              "sameAs": [
                "https://twitter.com/avidato",
                "https://linkedin.com/company/avidato",
                "https://www.facebook.com/p/Avidato-61583867944633/",
                "https://www.instagram.com/avidato.ai/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "url": "https://avidato.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://avidato.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
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