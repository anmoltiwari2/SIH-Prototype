'use client'

import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShieldCheck, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';

interface EscrowSummaryProps {
  baseRate: number;
  rateUnit: string;
  estimatedHours: number;
  surgeMultiplier: number;
  isPremiumMember: boolean;
  onBook: () => void;
  loading: boolean;
}

export function EscrowSummary({
  baseRate,
  rateUnit,
  estimatedHours,
  surgeMultiplier,
  isPremiumMember,
  onBook,
  loading
}: EscrowSummaryProps) {
  const [useTrustShield, setUseTrustShield] = useState(false);

  // Calculations
  const unitMultiplier = rateUnit === 'HOURLY' ? estimatedHours : 1.0;
  const basePayout = baseRate * unitMultiplier;
  
  const workerPayout = basePayout * surgeMultiplier;
  const surgeBonusAmount = workerPayout - basePayout;
  
  // Platform fee logic: 8% on base, 12% on surge bonus
  const basePlatformFee = basePayout * 0.08;
  const surgeMatchingFee = surgeBonusAmount * 0.12;
  const rawPlatformFee = basePlatformFee + surgeMatchingFee;
  
  const finalPlatformFee = isPremiumMember ? 0 : rawPlatformFee;
  
  // Insurance logic
  const insuranceFee = (useTrustShield && !isPremiumMember) ? 49 : 0;
  
  const totalEscrow = workerPayout + finalPlatformFee + insuranceFee;

  return (
    <GlassCard className="p-6 sticky top-6">
      <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2 text-[var(--foreground)]">Escrow Summary</h2>
      
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between opacity-80">
          <span>Worker Base Rate {rateUnit === 'HOURLY' && `(x${estimatedHours} hrs)`}</span>
          <span>₹{basePayout.toFixed(2)}</span>
        </div>
        
        {surgeMultiplier > 1.0 && (
          <div className="flex justify-between text-red-500 font-semibold">
            <span>Surge Bid ({surgeMultiplier}x)</span>
            <span>+ ₹{surgeBonusAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between opacity-80">
          <span>Platform Fees</span>
          <div className="text-right">
            {isPremiumMember ? (
              <div className="flex flex-col items-end">
                <span className="line-through opacity-50">₹{rawPlatformFee.toFixed(2)}</span>
                <span className="text-[var(--primary)] font-bold text-xs uppercase bg-[var(--primary)]/10 px-2 py-0.5 rounded-sm mt-1">GullyGigs Plus</span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span>₹{rawPlatformFee.toFixed(2)}</span>
                {surgeMultiplier > 1.0 && <span className="text-[10px] opacity-70">(Includes AI matching fee)</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Shield Insurance Toggle */}
      <div 
        onClick={() => !isPremiumMember && setUseTrustShield(!useTrustShield)}
        className={`p-4 rounded-xl border transition-all cursor-pointer mb-6 flex items-start gap-3 ${useTrustShield || isPremiumMember ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 bg-white/5 hover:border-amber-500/50'}`}
      >
        <div className={`mt-0.5 ${useTrustShield || isPremiumMember ? 'text-amber-500' : 'text-white/30'}`}>
          <ShieldAlert size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-sm">Trust Shield Protection</span>
            <span className="font-bold text-amber-500 text-sm">
              {isPremiumMember ? 'FREE' : '+₹49'}
            </span>
          </div>
          <p className="text-xs opacity-60">Add ₹10,000 liability insurance in case of accidental property damage during the gig.</p>
        </div>
        {!isPremiumMember && (
          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${useTrustShield ? 'bg-amber-500 border-amber-500' : 'border-white/30'}`}>
            {useTrustShield && <CheckIcon />}
          </div>
        )}
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

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  )
}
