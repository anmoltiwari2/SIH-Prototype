'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Loader2, UserRound, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { submitProfileSetup } from '@/actions/profile'

export default function SetupProfilePage() {
  const [role, setRole] = useState<'CUSTOMER' | 'WORKER'>('CUSTOMER')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitProfileSetup({ 
        role, 
        name, 
        age, 
        gender, 
        category: role === 'WORKER' ? category : undefined, 
        subcategory: role === 'WORKER' ? subcategory : undefined 
      })
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-[#8A9A5B] dark:bg-[var(--background)] w-full"
    >
      
      {/* Liquid Gooey Background Orbs (Same as Login Page) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        style={{ filter: 'url(#goo)' }}
      >
        <div 
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-[var(--primary)]/60 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-1 8s infinite ease-in-out' }}
        />
        <div 
          className="absolute top-1/3 left-1/3 w-80 h-80 bg-amber-500/60 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-2 12s infinite ease-in-out' }}
        />
        <div 
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/60 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-1 10s infinite ease-in-out reverse' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[var(--primary)]/50 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-2 14s infinite ease-in-out reverse' }}
        />
      </div>

      <motion.div 
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard className="p-8 border-[var(--glass-border)] shadow-2xl backdrop-blur-2xl bg-[var(--glass-bg)]/80 hover:shadow-[0_8px_32px_0_rgba(var(--primary-rgb),0.3)] transition-shadow duration-500">
          
          <div className="text-center mb-10">
            <motion.div 
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4 shadow-inner"
            >
              <UserRound size={32} />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold text-[var(--primary)] mb-2 tracking-tight"
            >
              Almost There
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm font-medium text-[var(--foreground)] opacity-70"
            >
              Let's set up your profile details.
            </motion.p>
          </div>

          <div className="relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'WORKER')}
                  className="w-full px-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--foreground)]/10 transition-all text-lg font-bold tracking-wide appearance-none"
                  required
                >
                  <option value="CUSTOMER" className="text-black dark:text-white bg-white dark:bg-zinc-800">I'm looking for help (Customer)</option>
                  <option value="WORKER" className="text-black dark:text-white bg-white dark:bg-zinc-800">I offer a service (Worker)</option>
                </select>
              </div>

              {role === 'WORKER' && (
                <>
                  <div className="relative group">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--foreground)]/10 transition-all text-lg font-medium tracking-wide appearance-none"
                      required
                    >
                      <option value="" disabled className="text-gray-500">Select Service Category</option>
                      <option value="Skilled Home Trades" className="text-black dark:text-white bg-white dark:bg-zinc-800">Skilled Home Trades</option>
                      <option value="Cleaning" className="text-black dark:text-white bg-white dark:bg-zinc-800">Cleaning</option>
                      <option value="Cook" className="text-black dark:text-white bg-white dark:bg-zinc-800">Cook</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Specific Service (e.g., Plumbing, Baking)"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--foreground)]/10 transition-all text-lg font-medium tracking-wide"
                      required
                    />
                  </div>
                </>
              )}

              <div className="relative group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--foreground)]/10 transition-all text-lg font-medium tracking-wide"
                  required
                />
              </div>
              <div className="relative group flex gap-4">
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-1/2 px-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--foreground)]/10 transition-all text-lg font-medium tracking-wide"
                  required
                  min="16"
                  max="100"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-1/2 px-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:bg-[var(--foreground)]/10 transition-all text-lg font-medium tracking-wide appearance-none"
                  required
                >
                  <option value="" disabled className="text-gray-500">Gender</option>
                  <option value="Male" className="text-black dark:text-white bg-white dark:bg-zinc-800">Male</option>
                  <option value="Female" className="text-black dark:text-white bg-white dark:bg-zinc-800">Female</option>
                  <option value="Other" className="text-black dark:text-white bg-white dark:bg-zinc-800">Other</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={loading || !name || !age || !gender || (role === 'WORKER' && (!category || !subcategory))}
                className="w-full mt-4 group flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>Complete Setup <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>
          
        </GlassCard>
      </motion.div>
    </motion.div>
    </>
  )
}
