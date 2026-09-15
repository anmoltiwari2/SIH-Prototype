'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2, Search, Briefcase, Crown, Building2 } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard'
import { submitRoleSelection, submitMockWorkerApplication, submitMockCustomerLogin } from '@/actions/auth'

export default function HomePage() {
  const [loadingRole, setLoadingRole] = useState<'CUSTOMER' | 'WORKER' | null>(null)
  const [showSplash, setShowSplash] = useState(false)
  const [showWorkerForm, setShowWorkerForm] = useState(false)
  const router = useRouter()

  const handleWorkerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingRole('WORKER');
    
    // Extract form data
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const skill = formData.get('skill') as string;

    // Fake artificial delay to simulate "backend saving"
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Call our new server action that sets mock auth cookies and routes straight to dashboard!
    await submitMockWorkerApplication(name || 'New Worker', skill || 'general');
  };

  useEffect(() => {
    // Only show the splash screen if this is the first time in the current browser session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
    if (!hasSeenIntro) {
      setShowSplash(true)
      sessionStorage.setItem('hasSeenIntro', 'true')
    }
  }, [])

  // Safely close the splash screen if the video lags longer than 5 seconds
  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [showSplash])

  const handleRoleSelect = async (role: 'CUSTOMER' | 'WORKER') => {
    setLoadingRole(role)
    
    // Automatically log in as a mock customer and route to their dashboard
    if (role === 'CUSTOMER') {
      await submitMockCustomerLogin()
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
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-[#F5F5DC] dark:bg-[var(--background)] w-full">
        
        {/* Background Graphic Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl text-center mb-16 flex flex-col items-center"
      >
        <div className="relative w-32 h-32 mb-6 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(236,72,153,0.4)] border border-white/20">
          <img src="/logo.jpg" alt="GullyGigs Hero Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black">G</div>' }} />
        </div>
        
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
            onClick={() => !loadingRole && setShowWorkerForm(true)}
            className={`group relative overflow-hidden h-full p-10 flex flex-col items-center text-center border border-[var(--glass-border)] transition-all duration-500 hover:border-amber-500 hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] hover:-translate-y-2`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 rounded-full bg-amber-500/10 text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500 shadow-inner">
              <Briefcase size={48} />
            </div>
            
            <h2 className="relative text-3xl font-extrabold mb-4 tracking-tight">I want to apply for a job</h2>
            <p className="relative text-lg opacity-70 mb-8 max-w-xs mx-auto">
              List your services, build your reputation, and earn money on your own terms.
            </p>
            
            <div className="relative mt-auto flex items-center gap-2 text-amber-500 font-bold group-hover:translate-x-2 transition-transform duration-300">
              Start offering services <ArrowRight size={20} />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* MARKETING SECTIONS: Premium & Enterprise */}
      <div className="relative z-10 w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Gully Premium Ad */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="p-8 h-full flex flex-col justify-center items-start border-amber-500/30 relative overflow-hidden group">
            <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-500" />
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl mb-4">
              <Crown size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Gully Premium</h3>
            <p className="opacity-70 mb-6 text-sm">Pay ₹499/month and enjoy 0% platform fees on all bookings, plus priority SOS dispatch.</p>
            <Link href="/premium" className="mt-auto px-6 py-2.5 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white border border-amber-500/50 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              Upgrade Now
            </Link>
          </GlassCard>
        </motion.div>

        {/* Enterprise B2B Ad */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <GlassCard className="p-8 h-full flex flex-col justify-center items-start border-indigo-500/30 relative overflow-hidden group">
            <div className="absolute bottom-[-50%] right-[-20%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500" />
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl mb-4">
              <Building2 size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Enterprise Solutions</h3>
            <p className="opacity-70 mb-6 text-sm">Automate facility management for your office or restaurant with recurring bulk-contracts.</p>
            <Link href="/enterprise" className="mt-auto px-6 py-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white border border-indigo-500/50 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              Partner With Us
            </Link>
          </GlassCard>
        </motion.div>

      </div>

      {/* Worker Application Modal */}
      <AnimatePresence>
        {showWorkerForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Briefcase className="text-amber-500" /> Worker Application
              </h2>
              <p className="opacity-70 text-sm mb-6">Enter your details to create your database profile and apply for jobs.</p>
              
              <form onSubmit={handleWorkerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold opacity-70 mb-1">FULL NAME</label>
                  <input name="name" required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold opacity-70 mb-1">PRIMARY SKILL</label>
                  <select name="skill" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 focus:outline-none transition-colors">
                    <option value="" className="text-black">Select a skill</option>
                    <option value="plumbing" className="text-black">Plumbing & Pipe Fitting</option>
                    <option value="electrical" className="text-black">Electrical Repair</option>
                    <option value="cleaning" className="text-black">Deep Cleaning</option>
                    <option value="delivery" className="text-black">Local Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold opacity-70 mb-1">EXPERIENCE (YEARS)</label>
                  <input name="experience" type="number" min="0" placeholder="e.g. 3" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500 focus:outline-none transition-colors" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowWorkerForm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={loadingRole === 'WORKER'} className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                    {loadingRole === 'WORKER' ? (
                      <><Loader2 size={18} className="animate-spin" /> Saving to DB...</>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Public Reviews Section */}
      <div className="relative z-10 w-full max-w-5xl mt-24 mb-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-3">Community Reviews</h2>
          <p className="opacity-70">See what others are saying about our verified professionals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Review 1 */}
          <GlassCard className="p-6 relative group overflow-hidden border-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex text-amber-500 mb-3">{'★'.repeat(5)}</div>
            <p className="text-sm opacity-90 mb-4 italic">"Vikram was incredibly fast and professional! Fixed my ceiling fan in 20 minutes flat."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs">S</div>
              <div>
                <p className="text-xs font-bold">Sneha P.</p>
                <p className="text-[10px] opacity-50">Reviewed Vikram Electrician</p>
              </div>
            </div>
          </GlassCard>

          {/* Review 2 */}
          <GlassCard className="p-6 relative group overflow-hidden border-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex text-amber-500 mb-3">{'★'.repeat(5)}</div>
            <p className="text-sm opacity-90 mb-4 italic">"The babysitter was so kind and my kids loved her. Highly recommend this platform."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-xs">A</div>
              <div>
                <p className="text-xs font-bold">Amit K.</p>
                <p className="text-[10px] opacity-50">Reviewed Sneha Babysitter</p>
              </div>
            </div>
          </GlassCard>

          {/* Review 3 */}
          <GlassCard className="p-6 relative group overflow-hidden border-cyan-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex text-amber-500 mb-3">{'★'.repeat(5)}</div>
            <p className="text-sm opacity-90 mb-4 italic">"Manoj fixed my car engine on a Sunday night. Absolute lifesaver and fair pricing."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-xs">R</div>
              <div>
                <p className="text-xs font-bold">Rahul M.</p>
                <p className="text-[10px] opacity-50">Reviewed Manoj Mechanic</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Write a Review Section */}
        <GlassCard className="max-w-2xl mx-auto p-8 border-white/10">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>
          <p className="text-xs opacity-60 mb-6">Had a great experience? Drop a review for a worker right here!</p>
          
          <form onSubmit={(e) => { e.preventDefault(); alert('Review submitted! Thank you for your feedback.'); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name" required className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm focus:border-[var(--primary)] focus:outline-none" />
              <input type="text" placeholder="Worker's Name" required className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm focus:border-[var(--primary)] focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs font-bold opacity-70">RATING:</span>
               <div className="flex text-amber-500/40 cursor-pointer">
                 {[1,2,3,4,5].map(star => <span key={star} className="hover:text-amber-500 transition-colors text-xl">★</span>)}
               </div>
            </div>
            <textarea placeholder="Write your experience..." rows={3} required className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm focus:border-[var(--primary)] focus:outline-none resize-none" />
            <button type="submit" className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-lg font-bold transition-colors">
              Submit Public Review
            </button>
          </form>
        </GlassCard>
      </div>

    </div>

      {/* Powered by GullyOS SaaS Badge */}
      <div className="relative z-10 w-full pb-12 flex justify-center">
        <Link href="/gullyos" className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
            <span className="text-[10px] font-black text-white">OS</span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest leading-none mb-1">Powered by</p>
            <p className="text-sm font-bold text-white leading-none">GullyOS</p>
          </div>
        </Link>
      </div>

    </>
  );
}