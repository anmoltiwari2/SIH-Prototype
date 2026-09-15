'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Coins, Users, Vote, Sparkles, Crown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useRouter } from 'next/navigation'

export default function EquityDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      
      {/* Premium Gold Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button onClick={() => router.back()} className="text-sm font-bold text-amber-500/70 hover:text-amber-500 mb-8 flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/30 font-bold mb-4">
             <Crown size={16} /> Cooperative Member
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-sm">
            Your Ownership Stake
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="opacity-70 text-xl max-w-2xl">
            You don't just work here. You own it. Watch your patronage points convert into tangible equity and quarterly dividends.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Equity Value & Pipeline */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Massive Hero Number */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <GlassCard className="p-10 border-amber-500/40 bg-gradient-to-br from-black/60 to-amber-900/10 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden group">
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-5 group-hover:animate-shine" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                  <div>
                    <p className="text-amber-500/80 font-bold tracking-widest uppercase text-sm mb-2 flex items-center gap-2">
                      <Sparkles size={16} /> Estimated Equity Value
                    </p>
                    <h2 className="text-7xl font-extrabold text-white tracking-tighter">
                      ₹45,250
                    </h2>
                    <p className="text-emerald-400 font-bold mt-2 flex items-center gap-1">
                      <TrendingUp size={16} /> +12.4% this quarter
                    </p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center min-w-[160px] backdrop-blur-md">
                    <p className="text-sm text-amber-500/80 font-bold mb-1 uppercase">Co-op Shares</p>
                    <p className="text-4xl font-extrabold text-amber-400">181</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* The Pipeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Coins className="text-amber-500" /> Point Conversion Pipeline</h3>
              <GlassCard className="p-8">
                 <div className="relative">
                   {/* Connection Line */}
                   <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                      />
                   </div>

                   <div className="relative flex justify-between items-center">
                     {/* Step 1 */}
                     <div className="bg-[#111] border border-white/20 p-4 rounded-xl flex flex-col items-center w-32 shadow-xl z-10">
                       <span className="text-3xl mb-2">🛠️</span>
                       <span className="text-xs font-bold opacity-70 text-center">Completed Jobs</span>
                       <span className="text-xl font-extrabold mt-1">42</span>
                     </div>
                     
                     {/* Step 2 */}
                     <div className="bg-[#111] border border-amber-500/40 p-4 rounded-xl flex flex-col items-center w-32 shadow-[0_0_20px_rgba(245,158,11,0.2)] z-10">
                       <Coins size={28} className="text-amber-500 mb-2" />
                       <span className="text-xs font-bold opacity-70 text-center">Patronage Points</span>
                       <span className="text-xl font-extrabold text-amber-500 mt-1">1,250</span>
                     </div>

                     {/* Step 3 */}
                     <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-4 rounded-xl flex flex-col items-center w-32 shadow-[0_0_30px_rgba(245,158,11,0.5)] z-10 border border-white/20 text-black">
                       <Crown size={28} className="mb-2" />
                       <span className="text-xs font-bold opacity-80 text-center">New Shares<br/>(Next Qtr)</span>
                       <span className="text-xl font-extrabold mt-1">+5</span>
                     </div>
                   </div>
                 </div>
                 <p className="text-center text-sm opacity-60 mt-6 max-w-lg mx-auto">
                   Every 250 Patronage Points automatically convert into 1 Class-A Cooperative Share at the end of each fiscal quarter.
                 </p>
              </GlassCard>
            </motion.div>

          </div>

          {/* Right Column: Dividends & Governance */}
          <div className="space-y-8">
            
            {/* Dividend Projections */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <GlassCard className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><TrendingUp className="text-emerald-400" size={20} /> Dividend Payouts</h3>
                <p className="text-xs opacity-60 mb-6">Historical & Projected (per share)</p>
                
                {/* CSS Bar Chart */}
                <div className="flex items-end justify-between h-40 gap-2 mt-auto pb-4 border-b border-white/10">
                  <div className="w-full flex flex-col items-center group">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">₹12</span>
                    <div className="w-full bg-white/10 rounded-t-md h-[40%] group-hover:bg-white/20 transition-colors relative" />
                    <span className="text-[10px] opacity-50 mt-2 font-bold">Q1</span>
                  </div>
                  <div className="w-full flex flex-col items-center group">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">₹15</span>
                    <div className="w-full bg-white/10 rounded-t-md h-[50%] group-hover:bg-white/20 transition-colors relative" />
                    <span className="text-[10px] opacity-50 mt-2 font-bold">Q2</span>
                  </div>
                  <div className="w-full flex flex-col items-center group">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">₹18</span>
                    <div className="w-full bg-amber-500/40 rounded-t-md h-[60%] group-hover:bg-amber-500/60 transition-colors relative shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
                    <span className="text-[10px] text-amber-500 font-bold mt-2">Q3</span>
                  </div>
                  <div className="w-full flex flex-col items-center group">
                    <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold text-emerald-400">₹24</span>
                    <div className="w-full bg-emerald-500/80 rounded-t-md h-[80%] shadow-[0_0_15px_rgba(16,185,129,0.4)] relative border-t-2 border-emerald-300" />
                    <span className="text-[10px] text-emerald-400 font-bold mt-2">Q4 (Proj)</span>
                  </div>
                </div>

                <div className="mt-4 bg-white/5 p-4 rounded-lg">
                  <p className="text-xs opacity-70 uppercase tracking-wider font-bold mb-1">Proj. Next Payout</p>
                  <p className="text-2xl font-extrabold text-emerald-400">₹4,344.00</p>
                  <p className="text-[10px] opacity-50 mt-1">Based on 181 shares * ₹24 est.</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Governance & Voting */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <GlassCard className="p-6 border-blue-500/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2"><Vote className="text-blue-400" size={20} /> Governance</h3>
                    <p className="text-xs opacity-60 mt-1">1 Share = 1 Vote</p>
                  </div>
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
                    181 Votes Power
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-bold uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-sm">Active Poll</span>
                       <span className="text-[10px] opacity-50">Ends in 2d</span>
                    </div>
                    <p className="text-sm font-medium group-hover:text-blue-300 transition-colors">Increase minimum hourly baseline wage by 5%?</p>
                  </div>
                  
                  <div className="bg-black/40 border border-white/5 p-3 rounded-lg hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-sm">Passed</span>
                       <span className="text-[10px] opacity-50">Last week</span>
                    </div>
                    <p className="text-sm font-medium opacity-70 line-through">Allocate 10% of Q2 profits to emergency health fund</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}
