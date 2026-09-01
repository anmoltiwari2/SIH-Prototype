'use client'

import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface EscrowSummaryProps {
  baseRate: number;
  rateUnit: string;
  estimatedHours: number;
  isEmergency: boolean;
  isPremiumMember: boolean;
  onBook: () => void;
  loading: boolean;
}

export function EscrowSummary({
  baseRate,
  rateUnit,
  estimatedHours,
  isEmergency,
  isPremiumMember,
  onBook,
  loading
}: EscrowSummaryProps) {
  // Calculations
  const emergencyMultiplier = isEmergency ? 1.5 : 1.0;
  const unitMultiplier = rateUnit === 'HOURLY' ? estimatedHours : 1.0;
  
  const workerPayout = baseRate * unitMultiplier * emergencyMultiplier;
  
  // Platform fee logic
  const rawPlatformFee = workerPayout * 0.08;
  const finalPlatformFee = isPremiumMember ? 0 : rawPlatformFee;
  
  const totalEscrow = workerPayout + finalPlatformFee;

  return (
    <GlassCard className="p-6 sticky top-6">
      <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2 text-[var(--foreground)]">Escrow Summary</h2>
      
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between opacity-80">
          <span>Worker Base Rate {rateUnit === 'HOURLY' && `(x${estimatedHours} hrs)`}</span>
          <span>₹{(baseRate * unitMultiplier).toFixed(2)}</span>
        </div>
        
        {isEmergency && (
          <div className="flex justify-between text-red-500 font-semibold">
            <span>Emergency Surcharge (1.5x)</span>
            <span>+ ₹{(workerPayout - (baseRate * unitMultiplier)).toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between opacity-80">
          <span>Platform Co-op Fee (8%)</span>
          <div className="text-right">
            {isPremiumMember ? (
              <div className="flex flex-col items-end">
                <span className="line-through opacity-50">₹{rawPlatformFee.toFixed(2)}</span>
                <span className="text-[var(--primary)] font-bold text-xs uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded-sm mt-1">GullyGigs Plus</span>
              </div>
            ) : (
              <span>₹{finalPlatformFee.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--glass-border)] pt-4 mb-6">
        <div className="flex justify-between items-end">
          <span className="text-lg font-semibold">Total Escrow Lock</span>
          <span className="text-3xl font-extrabold text-[var(--primary)]">₹{totalEscrow.toFixed(2)}</span>
        </div>
        <p className="text-xs opacity-60 mt-2 text-right">Funds are held securely until job completion.</p>
      </div>

      <button
        onClick={onBook}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-lg transition-all shadow-lg disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : (
          <>
            <ShieldCheck size={20} /> Lock & Book (Escrow)
          </>
        )}
      </button>
    </GlassCard>
  );
}
