'use client'

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ShieldCheck, Fingerprint, Lock, Loader2, KeyRound } from 'lucide-react'
import { verifyDigiLocker } from '@/actions/verification'

import { motion } from 'framer-motion'

export default function VerifyIdentityPage() {
  const [step, setStep] = useState<'DETAILS' | 'OTP' | 'SUCCESS'>('DETAILS')
  const [aadhar, setAadhar] = useState('')
  const [pin, setPin] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Simulate API call to DigiLocker
    setTimeout(() => {
      setStep('OTP')
      setLoading(false)
    }, 1000)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.')
      setLoading(false)
      return
    }

    setStep('SUCCESS')
    
    // Automatically redirect after showing success state
    setTimeout(async () => {
      try {
        await verifyDigiLocker()
      } catch (err: any) {
        setError('Failed to update verification status.')
        setLoading(false)
        setStep('OTP')
      }
    }, 1500)
  }

  if (!mounted) return null

  return (
    <>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-[#BC8F8F] dark:bg-[var(--background)] w-full"
    >
      
      {/* Liquid Gooey Background Orbs for DigiLocker theme */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        style={{ filter: 'url(#goo)' }}
      >
        <div 
          className="absolute top-1/4 left-1/3 w-80 h-80 bg-emerald-500/60 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-1 10s infinite ease-in-out' }}
        />
        <div 
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/60 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-2 12s infinite ease-in-out' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-500/60 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-1 14s infinite ease-in-out reverse' }}
        />
        <div 
          className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-emerald-400/50 rounded-full mix-blend-multiply blur-xl opacity-70"
          style={{ animation: 'float-orb-2 9s infinite ease-in-out reverse' }}
        />
      </div>

      <motion.div 
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard className="p-8 border-[var(--glass-border)] shadow-2xl backdrop-blur-2xl bg-[var(--glass-bg)]/80 hover:shadow-[0_8px_32px_0_rgba(16,185,129,0.2)] transition-shadow duration-500">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-inner transition-colors ${step === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}
            >
              {step === 'SUCCESS' ? <ShieldCheck size={32} /> : <Fingerprint size={32} />}
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight"
            >
              Govt. Identity Verification
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm font-medium text-[var(--foreground)] opacity-70"
            >
              {step === 'DETAILS' ? 'Securely link your DigiLocker account.' : 
               step === 'OTP' ? 'Enter the OTP sent to your Aadhar-linked mobile.' : 
               'Identity Verified Successfully!'}
            </motion.p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-500 text-sm font-semibold border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <div className="relative overflow-hidden">
            {/* Step 1: DETAILS */}
            <div className={`transition-all duration-500 transform ${step === 'DETAILS' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute inset-0 pointer-events-none'}`}>
              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500 transition-colors">
                    <Fingerprint size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="12-Digit Aadhar Number"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[var(--foreground)]/10 transition-all text-lg font-medium tracking-wide"
                    required
                    minLength={12}
                    maxLength={12}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    placeholder="6-Digit Security PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[var(--foreground)]/10 transition-all text-lg font-medium tracking-widest"
                    required
                    minLength={6}
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || aadhar.length !== 12 || pin.length !== 6}
                  className="w-full group flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Authenticate via DigiLocker'}
                </button>
              </form>
            </div>

            {/* Step 2: OTP */}
            <div className={`transition-all duration-500 transform ${step === 'OTP' ? 'translate-x-0 opacity-100' : step === 'SUCCESS' ? '-translate-x-full opacity-0 absolute inset-0 pointer-events-none' : 'translate-x-full opacity-0 absolute inset-0 pointer-events-none'}`}>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500 transition-colors">
                    <KeyRound size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--foreground)]/5 border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-[var(--foreground)]/10 transition-all text-center tracking-[0.5em] text-2xl font-extrabold"
                    required
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                </button>
              </form>
            </div>

            {/* Step 3: SUCCESS */}
            <div className={`transition-all duration-500 transform ${step === 'SUCCESS' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute inset-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 size={40} className="animate-spin text-emerald-500 mb-4" />
                <p className="font-bold text-lg">Redirecting...</p>
              </div>
            </div>

          </div>
          
          {process.env.NODE_ENV === 'development' && step !== 'SUCCESS' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-4 border-t border-[var(--glass-border)] text-center"
            >
              <span className="inline-block px-3 py-1 bg-gray-500/10 text-gray-500 text-xs font-bold rounded-full border border-gray-500/20">
                Mock Mode: Any 12-digit Aadhar, 6-digit PIN, and 6-digit OTP works.
              </span>
            </motion.div>
          )}

        </GlassCard>
      </motion.div>
    </motion.div>
    </>
  )
}
