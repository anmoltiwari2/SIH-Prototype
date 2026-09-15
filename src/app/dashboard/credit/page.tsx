'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, PiggyBank, TrendingUp, HandCoins, CheckCircle2, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function GullyCreditPage() {
  const [loanAmount, setLoanAmount] = useState(5000)
  
  // Fake platform metrics
  const interestRate = 4.5 // 4.5% flat interest
  const totalRepayment = loanAmount + (loanAmount * (interestRate / 100))
  const weeklyDeduction = totalRepayment / 8 // Paid off in 8 weeks

  const [applied, setApplied] = useState(false)

  const handleApply = () => {
    setApplied(true)
    setTimeout(() => {
      alert("Micro-loan approved by AI! Funds will be disbursed to your wallet in 10 minutes.")
    }, 1500)
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-500/20 text-amber-500 font-bold rounded-full mb-6 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <Coins size={20} /> GullyCredit (FinTech)
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
          Tool & Equipment Financing
        </h1>
        <p className="text-xl opacity-70 max-w-2xl">
          Get instant micro-loans for new tools, backed by your co-op gig history. No credit score required. Repayments are auto-deducted from your future payouts.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Features */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 border-amber-500/20 flex gap-4">
            <PiggyBank className="text-amber-500 shrink-0" size={32} />
            <div>
              <h3 className="font-bold text-lg mb-1">Low Interest Rates</h3>
              <p className="text-sm opacity-70">A flat 4.5% fee. All profits from lending go straight back into the cooperative dividend pool.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-emerald-500/20 flex gap-4">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={32} />
            <div>
              <h3 className="font-bold text-lg mb-1">AI Auto-Approval</h3>
              <p className="text-sm opacity-70">If you have a 4.5+ rating and have completed 10 gigs, the AI instantly approves loans up to ₹25,000.</p>
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Loan Calculator */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-amber-500" /> Calculate Your Loan
            </h2>

            <div className="mb-8">
              <label className="block text-sm font-bold opacity-70 mb-4 uppercase">How much do you need?</label>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-extrabold text-amber-500">₹{loanAmount.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="25000" 
                step="500"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between mt-2 text-xs font-bold opacity-50">
                <span>₹1,000</span>
                <span>Max: ₹25,000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs font-bold opacity-50 uppercase mb-1">Total Repayment (inc. fee)</p>
                <p className="text-xl font-bold">₹{totalRepayment.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs font-bold opacity-50 uppercase mb-1">Weekly Auto-Deduction</p>
                <p className="text-xl font-bold text-amber-500">₹{weeklyDeduction.toLocaleString()} <span className="text-sm text-white/50">/ 8 weeks</span></p>
              </div>
            </div>

            {!applied ? (
              <button onClick={handleApply} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-black transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                <HandCoins /> Apply & Get Funded Instantly
              </button>
            ) : (
              <div className="w-full py-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-xl font-black flex items-center justify-center gap-2 text-lg">
                <CheckCircle2 /> Application Sent to AI!
              </div>
            )}

          </GlassCard>
        </div>

      </div>
    </div>
  )
}
