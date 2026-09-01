'use client'

import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Crown, CheckCircle2, ShieldCheck, ArrowRight, Loader2, X } from 'lucide-react';
import { upgradeToPlus } from '@/actions/profile';
import { useRouter } from 'next/navigation';

interface SubscriptionGateModalProps {
  onClose: () => void;
  onContinueWithFee: () => void;
  platformFee: number;
}

export function SubscriptionGateModal({ onClose, onContinueWithFee, platformFee }: SubscriptionGateModalProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await upgradeToPlus();
      // Reload or trigger a state refresh to show 0% fees
      router.refresh();
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <GlassCard className="relative w-full max-w-lg p-8 z-10 border-[var(--primary)]/50 shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
        <button onClick={onClose} className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4 border border-[var(--primary)]/30">
            <Crown size={32} />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-[var(--foreground)]">Upgrade to GullyGigs Plus</h2>
          <p className="opacity-70">Never pay platform fees again.</p>
        </div>

        <div className="bg-[var(--foreground)]/5 rounded-xl p-4 mb-6 border border-[var(--glass-border)]">
          <p className="text-sm opacity-80 mb-2">You are about to pay a platform co-op fee of:</p>
          <p className="text-3xl font-extrabold text-red-500 mb-2">₹{platformFee.toFixed(2)}</p>
          <p className="text-xs opacity-60">Upgrade today for ₹499/month and your platform fee drops to ₹0 forever.</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[var(--primary)]" />
            <span className="text-sm font-semibold">0% Platform Commission</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[var(--primary)]" />
            <span className="text-sm font-semibold">Priority Worker Matching</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[var(--primary)]" />
            <span className="text-sm font-semibold">Extended Guarantee</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-lg transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>Upgrade for ₹499/mo <ArrowRight size={20} /></>
            )}
          </button>
          
          <button
            onClick={() => {
              onClose();
              onContinueWithFee();
            }}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-transparent hover:bg-[var(--foreground)]/5 text-[var(--foreground)] opacity-70 hover:opacity-100 font-bold transition-all text-sm border border-[var(--glass-border)]"
          >
            Continue with ₹{platformFee.toFixed(2)} fee
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
