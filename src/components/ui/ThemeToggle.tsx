'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-[var(--glass-bg)] animate-pulse" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)]/60 hover:bg-[var(--background)] shadow-sm backdrop-blur-md text-[var(--foreground)] opacity-90 hover:opacity-100 transition-all text-sm font-semibold hover:text-[var(--primary)] hover:border-[var(--primary)]/30"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <div className={`absolute transition-all duration-500 transform ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
          <Sun size={18} className="text-amber-500 drop-shadow-sm" />
        </div>
        <div className={`absolute transition-all duration-500 transform ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
          <Moon size={18} className="text-blue-400 drop-shadow-sm" />
        </div>
      </div>
      <span className="hidden sm:block">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  )
}
