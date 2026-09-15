'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Globe, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import Link from 'next/link'

export default function GullyOSPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[var(--primary)] selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Abstract OS Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 font-bold tracking-widest uppercase rounded-full mb-8 border border-blue-500/20 backdrop-blur-md">
            <Code2 size={16} /> B2B SaaS Licensing
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            Run your own <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Cooperative.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl opacity-70 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            License the powerful GullyOS source code. Launch a worker-owned gig platform in your city in days, not months.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform flex items-center gap-2 text-lg">
              Buy License (₹50,000/mo) <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 font-bold rounded-full transition-colors text-lg">
              Read the Docs
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Everything you need out of the box</h2>
          <p className="text-xl opacity-50">GullyOS handles the complex FinTech and matchmaking logic.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="text-amber-400" size={32} />,
              title: "AI Bidding Engine",
              desc: "Built-in dynamic surge pricing and matching algorithms."
            },
            {
              icon: <Shield className="text-emerald-400" size={32} />,
              title: "Automated Escrow",
              desc: "Secure hold-and-release payment routing."
            },
            {
              icon: <Globe className="text-blue-400" size={32} />,
              title: "White-Label Ready",
              desc: "Swap colors, logos, and mascots in 5 minutes via config."
            }
          ].map((feat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <GlassCard className="p-8 h-full border-white/5 hover:border-white/20 transition-colors bg-white/5">
                <div className="mb-6">{feat.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
                <p className="opacity-60 leading-relaxed">{feat.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <GlassCard className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-blue-900/40 to-emerald-900/40 border-blue-500/20">
          <h2 className="text-4xl font-black mb-4">Ready to start your local gig economy?</h2>
          <p className="opacity-70 mb-8 max-w-lg mx-auto">Join 15+ cities running on GullyOS. Empower workers and keep capital local.</p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black rounded-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-shadow">
            Talk to Sales
          </button>
        </GlassCard>
      </section>
      
      {/* Footer link back to app */}
      <div className="text-center pb-12 opacity-50 text-sm">
        <Link href="/" className="hover:underline">← Back to GullyGigs</Link>
      </div>

    </div>
  )
}
