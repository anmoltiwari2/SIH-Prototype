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
import { NavbarLinks } from '@/components/layout/NavbarLinks';
import { Sidebar } from '@/components/layout/Sidebar';
import { MascotProvider } from '@/lib/MascotContext';
import { GullyGigsAssistant } from '@/components/assistant/GullyGigsAssistant';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          
          <Sidebar />

          <div className="flex-1 flex flex-col min-h-screen relative w-full lg:w-[calc(100%-18rem)]">
            {/* Minimal Global Header */}
            <header className="sticky top-0 z-40 w-full border-b border-[var(--glass-border)] bg-[var(--glass-bg)]/80 backdrop-blur-md">
              <div className="px-6 lg:px-10 h-16 flex items-center justify-between lg:justify-end">
                {/* On mobile, leave space for the hamburger menu on the left */}
                <div className="lg:hidden w-10"></div> 
                
                <nav className="flex items-center gap-4">
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
              <main className="flex-grow relative z-10 w-full">
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
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
