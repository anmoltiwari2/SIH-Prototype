'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Briefcase, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function MyGigsPage() {
  const activeGigs = [
    {
      id: 'GIG-001',
      title: 'Deep Cleaning (Office)',
      status: 'IN_PROGRESS',
      client: 'Acme Corp',
      date: 'Today, 2:00 PM',
      payout: '₹1200'
    },
    {
      id: 'GIG-002',
      title: 'Plumbing Repair',
      status: 'PENDING_ACCEPTANCE',
      client: 'Rahul Sharma',
      date: 'Tomorrow, 10:00 AM',
      payout: '₹450'
    }
  ]

  const completedGigs = [
    {
      id: 'GIG-000',
      title: 'AC Servicing',
      status: 'COMPLETED',
      client: 'Sneha Gupta',
      date: 'Yesterday',
      payout: '₹800'
    }
  ]

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--primary)]/20 text-[var(--primary)] font-bold rounded-full mb-6">
          <Briefcase size={20} /> My Active Gigs
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Job Management
        </h1>
        <p className="text-xl opacity-70 max-w-2xl">
          Track your upcoming bookings, SOS requests, and past completed jobs.
        </p>
      </motion.div>

      {/* Active Jobs */}
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock className="text-amber-500" /> Currently Active & Pending</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {activeGigs.map((gig, index) => (
          <motion.div key={gig.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
            <GlassCard className="p-6 border-white/10 hover:border-[var(--primary)]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold opacity-50 mb-1">{gig.id}</p>
                  <h4 className="text-lg font-bold">{gig.title}</h4>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${gig.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {gig.status.replace('_', ' ')}
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm opacity-80">
                <p><strong>Client:</strong> {gig.client}</p>
                <p><strong>Schedule:</strong> {gig.date}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xl font-extrabold text-[var(--primary)]">{gig.payout}</span>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                  View Details <ArrowRight size={16} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Past History */}
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 opacity-50"><CheckCircle2 /> Past History</h3>
      <div className="grid grid-cols-1 gap-4 opacity-70">
        {completedGigs.map((gig) => (
          <GlassCard key={gig.id} className="p-4 flex items-center justify-between border-transparent bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-bold">{gig.title}</h4>
                <p className="text-xs opacity-70">{gig.date} • {gig.client}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-400">{gig.payout}</span>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  )
}
