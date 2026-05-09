import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "MedRoute — AI Symptom Analyser",
  description: "AI-Powered Triage. Describe your symptoms and get matched to the right medical specialist.",
  other: {
    "google-adsense-account": "ca-pub-1911010801005771",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1911010801005771" 
          crossOrigin="anonymous"
        ></script>
      </head>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
