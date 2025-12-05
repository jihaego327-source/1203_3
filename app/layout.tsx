import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { clerkLocalization } from "@/lib/clerk/localization";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={clerkLocalization}
      appearance={{
        // Tailwind CSS v4 호환성을 위한 설정
        cssLayerName: "clerk",
      }}
    >
      <html lang="ko">
        <body
          className={`${inter.variable} ${geistMono.variable} antialiased`}
        >
          <ErrorBoundary>
            <SyncUserProvider>
              <Navbar />
              {children}
              <Footer />
            </SyncUserProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
