'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Settings, Users, Calendar, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function EnterprisePage() {
  const [formStep, setFormStep] = useState(1)

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <Building2 size={40} />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-tight">
          Enterprise Solutions
        </h1>
        <p className="text-xl opacity-80 max-w-3xl">
          Automate your facility management. Sign bulk-contracts with the cooperative to dispatch verified cleaners, IT admins, and maintenance staff to your locations on a recurring schedule.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Features Column */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 border-indigo-500/20">
            <Settings className="text-indigo-400 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Automated Dispatch</h3>
            <p className="text-sm opacity-70">Set a schedule (e.g. Every Monday at 9AM) and our AI will route a cooperative worker to your office automatically.</p>
          </GlassCard>
          
          <GlassCard className="p-6 border-indigo-500/20">
            <ShieldCheck className="text-emerald-400 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Liability Protection</h3>
            <p className="text-sm opacity-70">All enterprise contracts come with built-in ₹1,00,000 liability insurance and full KYC compliance tracking.</p>
          </GlassCard>

          <GlassCard className="p-6 border-indigo-500/20">
            <TrendingUp className="text-amber-400 mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">Unified Invoicing</h3>
            <p className="text-sm opacity-70">Stop paying 10 different vendors. Get one simple monthly invoice for all your facility management needs.</p>
          </GlassCard>
        </div>

        {/* Contract Builder Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(formStep / 3) * 100}%` }} />
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-2">Build Your Enterprise Contract</h2>

            {formStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold opacity-70 mb-2 uppercase">Company Name</label>
                  <input type="text" placeholder="Acme Corp" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold opacity-70 mb-2 uppercase">Facility Size</label>
                  <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:border-indigo-500 focus:outline-none">
                    <option className="text-black">Small Office (1-50 employees)</option>
                    <option className="text-black">Medium Office (50-200 employees)</option>
                    <option className="text-black">Large Facility (200+ employees)</option>
                    <option className="text-black">Restaurant / Retail Chain</option>
                  </select>
                </div>
                <button onClick={() => setFormStep(2)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  Next: Select Services <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {formStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <label className="block text-xs font-bold opacity-70 mb-2 uppercase">What services do you need on recurring basis?</label>
                
                <div className="grid grid-cols-2 gap-4">
                  {['Deep Cleaning', 'IT Support / Networking', 'Plumbing Maintenance', 'Electrical Compliance', 'Pest Control', 'Security Guard'].map(service => (
                    <label key={service} className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:border-indigo-500/50 transition-colors bg-white/5">
                      <input type="checkbox" className="w-5 h-5 accent-indigo-500" />
                      <span className="text-sm font-bold">{service}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setFormStep(1)} className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all">Back</button>
                  <button onClick={() => setFormStep(3)} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    Next: Schedule <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {formStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon size={40} />
                </div>
                <h3 className="text-2xl font-bold">Contract Request Generated</h3>
                <p className="opacity-70 max-w-md mx-auto">
                  Our Enterprise team has received your facility requirements. A representative will call you within 2 hours to finalize the schedule and bulk-pricing discount.
                </p>
                <button onClick={() => setFormStep(1)} className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">
                  Start Over
                </button>
              </motion.div>
            )}

          </GlassCard>
        </div>

      </div>
    </div>
  )
}

function CheckCircleIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
  )
}
