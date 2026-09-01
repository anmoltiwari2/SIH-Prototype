'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Briefcase, ArrowRight, Loader2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { submitRoleSelection } from '@/actions/auth'

export default function HomePage() {
  const [loadingRole, setLoadingRole] = useState<'CUSTOMER' | 'WORKER' | null>(null)
  const [showSplash, setShowSplash] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Only show the splash screen if this is the first time in the current browser session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
    if (!hasSeenIntro) {
      setShowSplash(true)
      sessionStorage.setItem('hasSeenIntro', 'true')
    }
  }, [])

  // Safely close the splash screen if the video lags longer than 20 seconds
  useEffect(() => {
    if (!showSplash) return;
    // Safety timeout increased to 20 seconds so lagging videos aren't cut off early
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 20000)

    return () => clearTimeout(timer)
  }, [])

  const handleRoleSelect = async (role: 'CUSTOMER' | 'WORKER') => {
    setLoadingRole(role)
    
    // Allow public browsing for customers without enforcing login immediately
    if (role === 'CUSTOMER') {
      router.push('/search')
      return
    }

    try {
      // For workers, attempt to create the DB profile and route to dashboard
      await submitRoleSelection(role)
    } catch (err: any) {
      console.error(err)
      // Route the user to login so they can authenticate first.
      router.push('/login')
      setLoadingRole(null)
    }
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--background)]"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          >
            <video 
              src="/logo.mp4"
              autoPlay 
              muted 
              playsInline
              preload="auto"
              onEnded={() => setShowSplash(false)}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-[#F5F5DC] dark:bg-[var(--background)] w-full">
        
        {/* Background Graphic Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl text-center mb-16"
      >
        <h1 className="text-6xl md:text-7xl font-extrabold text-[var(--primary)] mb-6 tracking-tighter drop-shadow-sm">
          GullyGigs
        </h1>
        <p className="text-xl md:text-2xl text-[var(--foreground)] opacity-80 max-w-3xl mx-auto font-medium">
          The cooperative gig-services super-app.
        </p>
        <p className="text-lg text-[var(--foreground)] opacity-60 mt-2">
          How do you want to use the platform today?
        </p>
      </motion.div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Customer Card */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <GlassCard 
            interactive 
            onClick={() => !loadingRole && handleRoleSelect('CUSTOMER')}
            className={`group relative overflow-hidden h-full p-10 flex flex-col items-center text-center border border-[var(--glass-border)] transition-all duration-500 hover:border-[var(--primary)] hover:shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-2 ${loadingRole === 'CUSTOMER' ? 'opacity-70 scale-95' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-6 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-500 shadow-inner">
              {loadingRole === 'CUSTOMER' ? <Loader2 size={48} className="animate-spin" /> : <Search size={48} />}
            </div>
            
            <h2 className="relative text-3xl font-extrabold mb-4 tracking-tight">I want to find a worker</h2>
            <p className="relative text-lg opacity-70 mb-8 max-w-xs mx-auto">
              Search for verified professionals, book services, and get help around your home or business.
            </p>
            
            <div className="relative mt-auto flex items-center gap-2 text-[var(--primary)] font-bold group-hover:translate-x-2 transition-transform duration-300">
              {loadingRole === 'CUSTOMER' ? 'Setting up profile...' : 'Start finding help'} <ArrowRight size={20} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Worker Card */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <GlassCard 
            interactive 
            onClick={() => !loadingRole && handleRoleSelect('WORKER')}
            className={`group relative overflow-hidden h-full p-10 flex flex-col items-center text-center border border-[var(--glass-border)] transition-all duration-500 hover:border-amber-500 hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2 ${loadingRole === 'WORKER' ? 'opacity-70 scale-95' : ''}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 rounded-full bg-amber-500/10 text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500 shadow-inner">
              {loadingRole === 'WORKER' ? <Loader2 size={48} className="animate-spin" /> : <Briefcase size={48} />}
            </div>
            
            <h2 className="relative text-3xl font-extrabold mb-4 tracking-tight">I want to apply for a job</h2>
            <p className="relative text-lg opacity-70 mb-8 max-w-xs mx-auto">
              List your services, build your reputation, and earn money on your own terms.
            </p>
            
            <div className="relative mt-auto flex items-center gap-2 text-amber-500 font-bold group-hover:translate-x-2 transition-transform duration-300">
              {loadingRole === 'WORKER' ? 'Setting up profile...' : 'Start offering services'} <ArrowRight size={20} />
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </div>
    </>
  )
}