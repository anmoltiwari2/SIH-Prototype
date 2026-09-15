'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavbarLinks() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false
    return pathname.startsWith(path)
  }

  return (
    <>
      <Link 
        href="/" 
        className={`text-sm font-semibold transition-all hidden sm:flex items-center px-4 py-2.5 rounded-xl border shadow-sm backdrop-blur-md 
          ${isActive('/') 
            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]' 
            : 'border-[var(--glass-border)] bg-[var(--glass-bg)]/60 text-[var(--foreground)] opacity-90 hover:opacity-100 hover:bg-[var(--background)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30'
          }`}
      >
        Home
      </Link>
      <Link 
        href="/search" 
        className={`text-sm font-semibold transition-all hidden sm:flex items-center px-4 py-2.5 rounded-xl border shadow-sm backdrop-blur-md 
          ${isActive('/search') || isActive('/book')
            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]' 
            : 'border-[var(--glass-border)] bg-[var(--glass-bg)]/60 text-[var(--foreground)] opacity-90 hover:opacity-100 hover:bg-[var(--background)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30'
          }`}
      >
        Find Workers
      </Link>
      <Link 
        href="/dashboard" 
        className={`text-sm font-semibold transition-all hidden sm:flex items-center px-4 py-2.5 rounded-xl border shadow-sm backdrop-blur-md 
          ${isActive('/dashboard') 
            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]' 
            : 'border-[var(--glass-border)] bg-[var(--glass-bg)]/60 text-[var(--foreground)] opacity-90 hover:opacity-100 hover:bg-[var(--background)] hover:text-[var(--primary)] hover:border-[var(--primary)]/30'
          }`}
      >
        Dashboard
      </Link>
    </>
  )
}
