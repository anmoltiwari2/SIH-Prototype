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
  title: "GullyGigs",
  description: "The cooperative gig-services super-app.",
};

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

import { NavbarAuth } from '@/components/ui/NavbarAuth';
import { SiteNavigatorChatbot } from '@/components/assistant/SiteNavigatorChatbot';
import { MascotProvider } from '@/lib/MascotContext';
import { GullyGigsAssistant } from '@/components/assistant/GullyGigsAssistant';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Global Glassmorphic Navbar */}
          <header className="sticky top-0 z-50 w-full border-b border-[var(--glass-border)] bg-[var(--glass-bg)]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
              <Link href="/" className="text-2xl font-extrabold text-[var(--primary)] tracking-tight">
                GullyGigs
              </Link>
              <nav className="flex items-center gap-3">
                <Link href="/sos" className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all shadow-sm font-bold text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 dark:bg-red-500"></span>
                  </span>
                  SOS
                </Link>
                <Link href="/" className="text-sm font-semibold opacity-90 hover:opacity-100 transition-all hidden sm:flex items-center px-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)]/60 hover:bg-[var(--background)] shadow-sm backdrop-blur-md hover:text-[var(--primary)] hover:border-[var(--primary)]/30">
                  Home
                </Link>
                <Link href="/dashboard" className="text-sm font-semibold opacity-90 hover:opacity-100 transition-all hidden sm:flex items-center px-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)]/60 hover:bg-[var(--background)] shadow-sm backdrop-blur-md hover:text-[var(--primary)] hover:border-[var(--primary)]/30">
                  Dashboard
                </Link>
                <div className="hidden sm:block">
                  <SiteNavigatorChatbot />
                </div>
                <ThemeToggle />
                <NavbarAuth />
              </nav>
            </div>
          </header>

          {/* SVG Filter for Liquid Gooey Effect */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </svg>

          {/* Main Content */}
          <MascotProvider>
            <main className="flex-grow relative z-10">
              {children}
            </main>
            <GullyGigsAssistant />
          </MascotProvider>

          {/* Footer */}
          <footer className="w-full py-6 text-center border-t border-[var(--glass-border)] bg-[var(--glass-bg)]/50 backdrop-blur-sm mt-auto">
            <p className="text-sm font-extrabold tracking-widest uppercase opacity-70">
              GullyGigs
            </p>
            <p className="text-xs font-bold text-[var(--primary)] mt-1 tracking-wider">
              Co-powered by VEDA^4
            </p>
            <p className="text-xs opacity-50 mt-2">© {new Date().getFullYear()} All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
