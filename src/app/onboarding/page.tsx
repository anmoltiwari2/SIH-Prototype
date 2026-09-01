'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Briefcase, Search, ArrowRight } from 'lucide-react'
import { submitRoleSelection } from '@/actions/auth'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'WORKER' | null>(null)

  const handleConfirm = async () => {
    if (!selectedRole) return
    setLoading(true)
    try {
      await submitRoleSelection(selectedRole)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 text-[var(--foreground)]">Welcome to GullyGigs</h1>
          <p className="text-lg text-[var(--foreground)] opacity-80">
            How do you want to use the platform today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <GlassCard 
            interactive 
            className={`p-8 flex flex-col items-center text-center border-2 ${
              selectedRole === 'CUSTOMER' ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20' : 'border-transparent'
            }`}
            onClick={() => setSelectedRole('CUSTOMER')}
          >
            <div className={`p-4 rounded-full mb-4 ${selectedRole === 'CUSTOMER' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
              <Search size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">I am looking for help</h2>
            <p className="opacity-70">
              Find verified professionals, book services, and get help around your home or business.
            </p>
          </GlassCard>

          <GlassCard 
            interactive 
            className={`p-8 flex flex-col items-center text-center border-2 ${
              selectedRole === 'WORKER' ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/20' : 'border-transparent'
            }`}
            onClick={() => setSelectedRole('WORKER')}
          >
            <div className={`p-4 rounded-full mb-4 ${selectedRole === 'WORKER' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
              <Briefcase size={40} />
            </div>
            <h2 className="text-2xl font-semibold mb-2">I offer a service</h2>
            <p className="opacity-70">
              List your services, build your reputation, and earn on your own terms.
            </p>
          </GlassCard>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedRole || loading}
            className="flex items-center gap-2 py-3 px-8 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up your profile...' : 'Continue'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
