import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layouts/navbar";
import { createServerClient } from "@/utils/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mervason - Multi-Vendor E-commerce Marketplace",
  description: "Buy and sell products easily.",
  keywords: ["e-commerce", "marketplace", "whatsapp", "online shopping", "cameroon"],
  authors: [{ name: "Mervason Team" }],
  openGraph: {
    title: "Mervason - Multi-Vendor Marketplace",
    description: "Buy and sell products easily.",
    type: "website",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navbar user={user} />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
