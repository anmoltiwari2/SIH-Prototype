'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, CheckCircle, Zap, Shield, Loader2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useRouter } from 'next/navigation'

export default function PremiumPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = () => {
    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      alert("Payment Successful! Welcome to Gully Premium.")
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto flex flex-col items-center justify-center">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-amber-500/20 text-amber-500 rounded-full mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          <Crown size={48} />
        </div>
        <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
          Gully Premium
        </h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          Upgrade your experience. Zero platform fees, priority dispatch, and exclusive perks.
        </p>
      </motion.div>

      {/* Pricing Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Free Tier */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-8 h-full border border-white/10 opacity-70">
            <h3 className="text-2xl font-bold mb-2">Standard</h3>
            <div className="text-4xl font-extrabold mb-6">₹0<span className="text-lg font-normal opacity-50">/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><CheckCircle className="text-emerald-500" size={20} /> Access to all workers</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-emerald-500" size={20} /> Basic Escrow protection</li>
              <li className="flex items-center gap-3 opacity-50"><XCircle /> 8% Platform Booking Fee</li>
              <li className="flex items-center gap-3 opacity-50"><XCircle /> Standard Dispatch Times</li>
            </ul>
            <button disabled className="w-full py-3 bg-white/5 rounded-xl font-bold text-white/50 cursor-not-allowed">
              Current Plan
            </button>
          </GlassCard>
        </motion.div>

        {/* Premium Tier */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-8 h-full border-2 border-amber-500 relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.15)]">
            <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
            
            <h3 className="text-2xl font-bold mb-2 text-amber-500">Gully Premium</h3>
            <div className="text-4xl font-extrabold mb-6 text-white">₹499<span className="text-lg font-normal opacity-50 text-white">/mo</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 font-bold"><Zap className="text-amber-500" size={20} /> 0% Platform Booking Fee</li>
              <li className="flex items-center gap-3 font-bold"><Shield className="text-amber-500" size={20} /> Priority SOS Dispatch (Under 60s)</li>
              <li className="flex items-center gap-3 font-bold"><CheckCircle className="text-amber-500" size={20} /> Free Trust Shield Insurance on all jobs</li>
              <li className="flex items-center gap-3 font-bold"><CheckCircle className="text-amber-500" size={20} /> Dedicated Support Line</li>
            </ul>
            <button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : "Subscribe Now"}
            </button>
          </GlassCard>
        </motion.div>

      </div>
    </div>
  )
}

function XCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
  )
}
