import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { createServerClient } from "@/utils/supabase/server";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mervason.com'),
  title: {
    default: "Mervason - Marketplace Multi-Vendeurs au Cameroun",
    template: "%s | Mervason"
  },
  description: "Achetez et vendez facilement via WhatsApp. Marketplace e-commerce multi-vendeurs au Cameroun.",
  keywords: ["e-commerce", "marketplace", "whatsapp", "online shopping", "cameroon", "cameroun", "boutique en ligne", "vente en ligne"],
  authors: [{ name: "Mervason Team" }],
  creator: "Mervason",
  publisher: "Mervason",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://mervason.com",
    siteName: "Mervason",
    title: "Mervason - Marketplace Multi-Vendeurs",
    description: "Achetez et vendez facilement via WhatsApp au Cameroun",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mervason Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mervason - Marketplace Multi-Vendeurs",
    description: "Achetez et vendez facilement via WhatsApp au Cameroun",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get current user for navbar (show/hide Dashboard link)
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#F97316" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}
      >
        <Navbar user={user} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
