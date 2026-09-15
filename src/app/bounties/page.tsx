'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, MapPin, Clock, Zap, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useRouter } from 'next/navigation'

// Helper component for live countdown timer
function CountdownTimer({ initialSeconds, onExpire }: { initialSeconds: number, onExpire: () => void }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire()
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, onExpire])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const isCritical = timeLeft < 60

  return (
    <span className={`font-mono font-bold flex items-center gap-1 ${isCritical ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
      <Clock size={14} />
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </span>
  )
}

export default function BountiesPage() {
  const router = useRouter()
  const [bounties, setBounties] = useState([
    {
      id: 'b-1',
      title: 'Major Pipe Burst - Flooding!',
      category: 'Plumbing',
      distance: '0.8 km',
      basePay: 800,
      surgeMultiplier: 2.5,
      expiresIn: 345, // seconds
      claimed: false,
      claiming: false
    },
    {
      id: 'b-2',
      title: 'Power Outage in Entire Shop',
      category: 'Electrical',
      distance: '1.2 km',
      basePay: 1200,
      surgeMultiplier: 1.8,
      expiresIn: 890,
      claimed: false,
      claiming: false
    },
    {
      id: 'b-3',
      title: 'Urgent Deep Clean (Move-out in 2hrs)',
      category: 'Cleaning',
      distance: '3.5 km',
      basePay: 2000,
      surgeMultiplier: 1.5,
      expiresIn: 1240,
      claimed: false,
      claiming: false
    }
  ])

  const handleClaim = async (id: string) => {
    // Set claiming state
    setBounties(prev => prev.map(b => b.id === id ? { ...b, claiming: true } : b))
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500))
    
    // Set claimed state
    setBounties(prev => prev.map(b => b.id === id ? { ...b, claiming: false, claimed: true } : b))
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const handleExpire = (id: string) => {
    setBounties(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      
      {/* Animated Radar Background */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
        <div className="absolute inset-0 rounded-full border border-red-500/30" />
        <div className="absolute inset-8 rounded-full border border-red-500/20" />
        <div className="absolute inset-16 rounded-full border border-red-500/10" />
        {/* Radar sweep line */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t border-r border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] opacity-50"
          style={{ transformOrigin: "center center" }}
        >
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-red-500/20 to-transparent rounded-tr-full" />
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <button onClick={() => router.back()} className="text-sm font-bold opacity-70 hover:opacity-100 mb-8 flex items-center gap-2 transition-opacity">
          &larr; Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-extrabold flex items-center gap-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <AlertTriangle className="text-red-500" size={48} />
              Live SOS Bounties
            </h1>
            <p className="opacity-70 text-lg mt-2 font-medium">High-urgency local jobs with surge pricing. Claim them before they expire!</p>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 px-6 py-4 rounded-xl flex items-center gap-4 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
             <div className="relative flex items-center justify-center">
                <span className="absolute inline-flex h-4 w-4 rounded-full bg-red-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
             </div>
             <div>
               <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Active Surge Area</p>
               <p className="text-2xl font-extrabold text-white">Up to 2.5x Pay</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {bounties.map(bounty => (
              <motion.div
                key={bounty.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                layout
              >
                <GlassCard className={`p-0 h-full flex flex-col relative overflow-hidden transition-all duration-500 ${
                  bounty.claimed 
                    ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-emerald-500/5' 
                    : 'border-red-500/40 hover:border-red-500/80 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-black/40'
                }`}>
                  
                  {bounty.claimed && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 z-20 bg-emerald-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6"
                    >
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring', damping: 15 }}
                      >
                        <CheckCircle2 size={64} className="text-emerald-500 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">Bounty Claimed!</h3>
                      <p className="text-emerald-200 mt-2 font-medium">Adding to your active jobs...</p>
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="p-6 pb-4 border-b border-white/10 flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2 flex items-center gap-1">
                        <AlertTriangle size={12} /> {bounty.category} Emergency
                      </div>
                      <h2 className="text-xl font-bold leading-tight text-white/90">{bounty.title}</h2>
                    </div>
                    <div className="bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                      <CountdownTimer initialSeconds={bounty.expiresIn} onExpire={() => handleExpire(bounty.id)} />
                    </div>
                  </div>
                  
                  {/* Body */}
                  <div className="p-6 space-y-4 flex-grow">
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <div className="bg-white/5 p-2 rounded-full"><MapPin size={16} className="text-blue-400" /></div>
                      <span className="font-medium">{bounty.distance} away</span>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex justify-between items-center relative overflow-hidden group">
                       <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
                         <Zap size={64} className="text-red-500" />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-red-400 mb-1">SURGE PRICING ({bounty.surgeMultiplier}x)</p>
                         <p className="text-3xl font-extrabold text-white">₹{(bounty.basePay * bounty.surgeMultiplier).toFixed(0)}</p>
                       </div>
                    </div>
                  </div>

                  {/* Footer / Action */}
                  <div className="p-4 pt-0">
                    <button 
                      onClick={() => handleClaim(bounty.id)}
                      disabled={bounty.claiming || bounty.claimed}
                      className="w-full relative overflow-hidden rounded-xl py-4 font-extrabold text-lg transition-all group active:scale-95 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bounty.claiming ? (
                         <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Securing Bounty...</span>
                      ) : (
                         <span className="flex items-center justify-center gap-2">Claim Bounty <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                      )}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {bounties.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-white/10 rounded-2xl bg-black/40 backdrop-blur-md"
            >
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-red-500 rounded-full blur-[30px] opacity-20 animate-pulse" />
                 <AlertTriangle size={64} className="text-red-500/50 relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Active Bounties</h2>
              <p className="text-white/50 max-w-sm">The neighborhood is peaceful right now. Keep your radar on to catch the next surge job.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
